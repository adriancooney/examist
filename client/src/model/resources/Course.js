import { omit } from "lodash/object";
import { Resource } from "../../library";
import { compose } from "../../library/Selector"
import * as User from "../User";

const Course = new Resource("course", "id", {
    cleaner: mod => omit(mod, "papers")
});

/*
 * Get a paper by course, year and period.
 */
export const getCourse = Course.createStatefulResourceAction(User.selectAPI, 
    (api, code) => api.getCourse(code).then({ course } => course);

/*
 * Search for courses.
 */
export const search = Course.createStatefulAction("COURSE_SEARCH", User.selectAPI, 
    (api, query) => api.searchCourses(query));

/**
 * Select a course by code.
 * @param  {String}   code Course code.
 * @return {Function}      Selector.
 */
export const selectByCode = (code) => {
    return Course.select(courses => courses.find(course => course.code === code.toUpperCase()));
};

/**
 * Select a course by id.
 * @param  {String}   id   Course id.
 * @return {Function}      Selector.
 */
export const selectById = (id) => {
    return Course.select(courses => courses.find(course => course.id === id));
};

/**
 * Select papers for a course.
 * @param  {String}   code The course code.
 * @return {Function}      Selector.
 */
export const selectPapers = code => state => {
    return state.resources.papers.filter(paper => paper.course === code);
};

/**
 * Select a course by ID (or code) and include papers.
 * @param  {Number}   id Course id.
 * @return {Function}    Selector.
 */
export const selectByCodeWithPapers = compose(selectByCode, mod => state => ({ 
    ...course, 
    papers: selectPapers(mod.code)(state)
}));

/*
 * Ensure courses loaded by user get store in courses resource.
 */
Course.addProducerHandler(User.getCourses, ({ courses }) => courses);
Course.addProducerHandler(search, ({ courses }) => courses);

export default Course;