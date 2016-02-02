import { Resource, Reducer } from "../../Library";
import User from "../User";

const Module = new Resource("module", "id");
/*
 * Get a paper by module, year and period.
 */
export const getModule = Module.createStatefulResourceAction(User.selectAPI, 
    (api, code) => api.getModule(code));

export default Module;