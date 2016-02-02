import { Resource, Reducer } from "../../Library";
import User from "../User";

const Module = new Resource("module", "id");
/*
 * Get a paper by module, year and period.
 */
export const getModule = Module.createStatefulResourceAction(User.selectAPI, 
    (api, code) => api.getModule(code));

/**
 * Select a module by code.
 * @param  {String} code Module code.
 * @return {Function}      Selector.
 */
export const selectByCode = (code) => {
    return Module.select(modules => modules.find(module => module.code === code));
}

export default Module;