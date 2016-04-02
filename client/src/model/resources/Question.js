import Resource, { updateResources } from "../../library/Resource";
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
            } else return question;
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
                    comment_count: question.comment_count + 1,
                    comments: [...(question.comments || []), comment.id]
                }
            } else return question;
        });
    } else return questions;
});

Question.handleAction("GET_NOTES", updateResources((q, { question }) => {
    return q.id === question.id;
}, (question, { notes }) => {
    return {
        ...question,
        notes: notes.map(note => note.id)
    }    
}));

Question.handleAction("CREATE_NOTE", updateResources((q, { question }) => {
    return q.id === question.id;
}, (question, { note }) => {
    return {
        ...question,
        notes: [...(question.notes || []), note.id]
    }    
}));

export const getSimilar = Question.createStatefulAction("GET_SIMILAR_QUESTIONS", User.selectAPI, 
    (api, ...args) => api.getSimilarQuestions(...args));

Question.addProducer(getSimilar, ({ similar, question }) => [...similar, question]);
Question.addProducer("GET_POPULAR", ({ popular_questions }) => popular_questions.map(q => { delete q.similar; return q; }));

/**
 * Select questions by paper ID.
 * @param  {Number} paper Paper id.
 * @return {Function}     Selector.
 */
export const selectByPaper = (paper) => {
    return Question.select(questions => questions.filter(questions => questions.paper === paper));
};

export const selectByPath = (path, paper) => {
    return Question.select(questions => 
        questions.find(question => question.paper_id === paper && question.path.every((i, n) => path[n] === i)));
};

export const selectSimilar = id => state => {
    const question = state.resources.questions.find(q => q.id === id);
    return question.similar ? 
        question.similar.map(sim => {
            const similar = state.resources.questions.find(q => q.id === sim.similar_question_id);
            if(similar) similar.similarity = sim.similarity;
            return similar;
        }) : [];
}

export default Question;