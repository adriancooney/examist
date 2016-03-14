import { Resource } from "../../library";
import * as Paper from "./Paper";

const Question = new Resource("question", "id");

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