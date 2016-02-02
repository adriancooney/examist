import { Resource } from "../../library";
import User from "../User";

const Paper = new Resource("paper", "id");

/*
 * Get a paper by module, year and period.
 */
export const getPaper = Paper.createStatefulResourceAction(User.selectAPI, 
    (api, module, year, period) => api.getPaper(module, year, period));

export default Paper;