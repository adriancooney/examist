import { Resource } from "../../library";
import { compose } from "../../library/Selector";
import * as User from "../User";
import * as Course from "./Course"

const Paper = new Resource("paper", "id");

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
 * Add papers when a specific course is selected
 */
Paper.addProducerHandler(Course.getCourse, ({ papers }) => papers);
Paper.addProducerHandler(getPaper, ({ paper }) => paper);
export default Paper;