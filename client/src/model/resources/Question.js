import { Resource } from "../../library";
import { without } from "lodash/array";
import * as Paper from "./Paper";
import * as User from "../User";

const Question = new Resource("question", "id");

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
    (api, code, year, period, question) => api.removeQuestion(code, year, period, question).then(() => question));

Question.handleAction(remove, (questions, removedQuestion) => {
    // Remove the question
    questions = questions.filter(question => question.id !== removedQuestion)

    if(removedQuestion.parent)
        questions = questions.map(question => {
            if(question.id == removedQuestion.parent) {
                return { ...question, children: without(question.children, removedQuestion.id) };
            } else return question;
        });

    return questions;
});

/*
 * Handle when a paper loads.
 */
Question.addProducerHandler(Paper.getPaper, ({ questions }) => questions);

/**
 * Select questions by paper ID.
 * @param  {Number} paper Paper id.
 * @return {Function}     Selector.
 */
export const selectByPaper = (paper) => {
    return Question.select(questions => questions.filter(questions => questions.paper === paper));
};

export default Question;