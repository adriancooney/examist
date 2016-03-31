import { without } from "lodash/array";
import { Resource } from "../../library";
import { compose } from "../../library/Selector";
import * as User from "../User";
import * as Course from "./Course"

const Paper = new Resource("papers", "id");

/*
 * Get a paper by course, year and period.
 */
export const getPaper = Paper.createStatefulAction("GET_PAPER", User.selectAPI, 
    (api, course, year, period) => api.getPaper(course, year, period));

/**
 * Select a paper based on the following criteria:
 * @param  {String}   course The course id.
 * @param  {Number}   year   The paper year.
 * @param  {String}   period The paper period.
 * @return {Function}        Selector.
 */
export const selectPaper = ({ course, year, period }) => {
    return Paper.select(papers => 
        papers.find(paper => paper.course === course && paper.year_start === year && paper.period === period));
};

/**
 * Select questions for a paper.
 * @param  {Number}   questions Array of question ids.
 * @return {Function}           Selector.
 */
export const selectQuestions = questions => state => {
    return questions.map(id => state.resources.questions.find(q => q.id === id));
};

/*
 * Select a paper including questions. See `selectPaper` for params.
 */
export const selectPaperWithQuestions = compose(selectPaper, paper => state => ({
    ...paper,
    questions: paper.questions ? selectQuestions(paper.questions)(state) : null
}));

/**
 * Select a course's papers by id.
 * @param  {Number}    id Course id.
 * @return {Function}     Selector.
 */
export const selectByCourse = Paper.selectAllByProp("course");

/*
 * Handle a new question.
 */
Paper.handleAction("CREATE_QUESTION", (papers, { question }) => {
    return papers.map(paper => {
        if(paper.id === question.paper) {
            return { ...paper, questions: [...paper.questions, question.id] };
        } else return paper;
    });
});

Paper.handleAction("REMOVE_QUESTION", (papers, [removedQuestion]) => {
    return papers.map(paper => {
        if(paper.id === removedQuestion.paper) {
            return { ...paper, questions: without(paper.questions, removedQuestion.id) };
        } else return paper;
    });
});

/*
 * Add papers when a specific paper is selected
 */
Paper.addProducer(Course.getCourse, ({ papers }) => papers);
Paper.addProducer(Course.getPopular, ({ papers }) => papers);
Paper.addProducer(getPaper, ({ paper }) => paper);
export default Paper;