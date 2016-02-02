import { Resource } from "../../library";
import User from "../User";

const Paper = new Resource("paper", "id");

/*
 * Get a paper by module, year and period.
 */
export const getPaper = Paper.createStatefulResourceAction(User.selectAPI, 
    (api, module, year, period) => api.getPaper(module, year, period));

/**
 * Select a paper based on the following criteria:
 * @param  {String}   module The module code.
 * @param  {Number}   year   The paper year.
 * @param  {String}   period The paper period.
 * @return {Function}        Selector.
 */
export const selectPaper = (module, year, period) => {
    return Paper.select(papers => papers.find(paper => paper.module === module && paper.year === year && paper.period === period));
}

export default Paper;