import { omit } from "lodash/object";
import { Resource } from "../../library";
import { compose } from "../../library/Selector";
import * as User from "../User";
import Course from "./Course"

const Paper = new Resource("paper", "id", {
    cleaner: paper => omit(paper, "questions")
});

/*
 * Add papers return when a user get's their courses.
 */
// Paper.addProducerHandler(User.getCourses, 
//     (args) => {
//         console.log(args);
//         // courses.reduce((papers, course) => papers.concat(course.papers), [])
//         return [];
//     });

/*
 * Add papers when a specific course is selected
 */
Paper.addProducerHandler(Course.type, course => course.papers);

/*
 * Get a paper by course, year and period.
 */
export const getPaper = Paper.createStatefulResourceAction(User.selectAPI, 
    (api, course, year, period) => api.getPaper(course, year, period).then(res => res.paper));

/**
 * Select a paper based on the following criteria:
 * @param  {String}   course The course code.
 * @param  {Number}   year   The paper year.
 * @param  {String}   period The paper period.
 * @return {Function}        Selector.
 */
export const selectPaper = ({ course, year, period }) => {
    return Paper.select(papers => papers.find(paper => paper.course === course && paper.year === year && paper.period === period));
};

/**
 * Select questions for a paper.
 * @param  {Number}   paper Paper id.
 * @return {Function}       Selector.
 */
export const selectQuestions = paper => state => {
    return state.resources.questions.filter(question => question.paper === paper);
};

/*
 * Select a paper including questions. See `selectPaper` for params.
 */
export const selectPaperWithQuestions = compose(selectPaper, paper => state => ({
    ...paper,
    questions: selectQuestions(paper.id)(state)
}));

/**
 * Select a course's papers by id.
 * @param  {Number}    id Course id.
 * @return {Function}     Selector.
 */
export const selectByCourse = Paper.selectAllByProp("course");

export default Paper;