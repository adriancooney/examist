import { omit } from "lodash/object";
import { Resource } from "../../library";
import { compose } from "../../library/Selector";
import * as User from "../User";
import Course from "./Course"

const Paper = new Resource("paper", "id", {
    cleaner: paper => {
        paper = omit(paper, "questions");

        if(typeof paper.course === "object")
            paper.course = paper.course.id;

        return paper;
    }
});

/*
 * Add papers when a specific course is selected
 */
Paper.addProducerHandler(Course, ({ papers }) => papers);

/*
 * Get a paper by course, year and period.
 */
export const getPaper = Paper.createStatefulResourceAction(User.selectAPI, 
    (api, course, year, period) => api.getPaper(course, year, period).then(res => res.paper));

/**
 * Select a paper based on the following criteria:
 * @param  {String}   course The course id.
 * @param  {Number}   year   The paper year.
 * @param  {String}   period The paper period.
 * @return {Function}        Selector.
 */
export const selectPaper = ({ course, year, period }) => {
    return Paper.select(papers => papers.find(paper => paper.course === course && paper.year_start === year && paper.period === period));
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