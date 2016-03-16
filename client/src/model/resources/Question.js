import { Resource } from "../../library";
import * as Paper from "./Paper";
import * as User from "../User";

const Question = new Resource("question", "id");

export const create = Question.createStatefulAction("CREATE_QUESTION", User.selectAPI, 
    (api, ...details) => api.createQuestion(...details));

/*
 * Handle when a paper loads.
 */
Question.addProducerHandler(Paper.getPaper, ({ questions }) => questions);
Question.addProducerHandler(create, ({ question }) => question);

/**
 * Select questions by paper ID.
 * @param  {Number} paper Paper id.
 * @return {Function}     Selector.
 */
export const selectByPaper = (paper) => {
    return Question.select(questions => questions.filter(questions => questions.paper === paper));
};

export default Question;