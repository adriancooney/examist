import { Resource } from "../../library";
import { without, unionBy } from "lodash/array";
import * as Paper from "./Paper";
import * as User from "../User";

const Question = new Resource("questions", "id");

export const create = Question.createStatefulAction("CREATE_QUESTION", User.selectAPI, 
    (api, ...details) => api.createQuestion(...details));

Question.handleAction(create, (questions, payload) => {
    const newQuestion = payload.question;

    if(newQuestion.parent) {
        // Update the parent
        questions = questions.map(question => {
            if(newQuestion.parent === question.id) {
                return { ...question, children: [...question.children, newQuestion.id] };
            } else return question;
        });
    }

    return [...questions, newQuestion];
});

export const remove = Question.createStatefulAction("REMOVE_QUESTION", User.selectAPI, 
    (api, code, year, period, question) => api.removeQuestion(code, year, period, question).then((data) => [question, ...data.questions]));

Question.handleAction(remove, (questions, [removedQuestion, ...modified]) => {
    // Remove the old question
    questions = questions.filter(question => question.id !== removedQuestion.id);

    // Remove it from any parents
    if(removedQuestion.parent)
        questions = questions.map(question => {
            if(removedQuestion.parent === question.id) {
                return { ...question, children: without(question.children, removedQuestion.id) };
            } else return question;
        });

    if(modified.length)
        questions = unionBy(modified, questions, "id");

    return questions;
});

export const update = Question.createStatefulAction("UPDATE_QUESTION", User.selectAPI, 
    (api, ...details) => api.updateQuestion(...details));

export const getByPath = Question.createStatefulAction("GET_QUESTION", User.selectAPI,
    (api, ...details) => api.getQuestion(...details));

/*
 * Handle when a paper loads.
 */
Question.addProducer(getByPath, ({ question, children }) => [question, ...children]);
Question.addProducer(Paper.getPaper, ({ questions }) => questions);
Question.addProducer(update, ({ questions }) => questions);

Question.handleAction("GET_COMMENTS", (questions, { entity, comments }) => {
    // Add comments to any questions
    const selectedQuestion = questions.find(q => q.id === entity.id);

    if(selectedQuestion) {
        return questions.map(question => {
            if(question.id === selectedQuestion.id) {
                return {
                    ...question,
                    comments: comments.map(comment => comment.id)
                }
            }
        });
    } else return questions;
});

Question.handleAction("CREATE_COMMENT", (questions, { comment }) => {
    // Add comments to any questions
    const selectedQuestion = questions.find(q => q.id === comment.entity_id);

    if(selectedQuestion) {
        return questions.map(question => {
            if(question.id === selectedQuestion.id) {
                return {
                    ...question,
                    comments: [...(question.comments || []), comment.id]
                }
            }
        });
    } else return questions;
});

/**
 * Select questions by paper ID.
 * @param  {Number} paper Paper id.
 * @return {Function}     Selector.
 */
export const selectByPaper = (paper) => {
    return Question.select(questions => questions.filter(questions => questions.paper === paper));
};

export const selectByPath = path => {
    return Question.select(questions => questions.find(question => question.path.every((i, n) => path[n] === i)));
};

export default Question;