import { omit } from "lodash/object";
import { Resource } from "../../library";
import { compose } from "../../library/Selector"
import * as User from "../User";

const Module = new Resource("module", "id", {
    cleaner: module => omit(module, "papers")
});

/*
 * Get a paper by module, year and period.
 */
export const getModule = Module.createStatefulResourceAction(User.selectAPI, 
    (api, code) => api.getModule(code).then(({ module }) => module));

/**
 * Select a module by code.
 * @param  {String} code Module code.
 * @return {Function}      Selector.
 */
export const selectByCode = (code) => {
    return Module.select(modules => modules.find(module => module.code === code));
};

export const selectPapers = code => state => {
    return state.resources.papers.filter(paper => paper.module === code);
};

/**
 * Select a module by ID (or code) and include papers.
 * @param  {Number}   id Module id.
 * @return {Function}    Selector.
 */
export const selectByCodeWithPapers = compose(selectByCode, (module) => {
    return state => module ? ({ 
        ...module, 
        papers: selectPapers(module.code)(state)
    }) : null;
});

/*
 * Enure modules loaded by user get store in modules resource.
 */
Module.addProducerHandler(User.getModules, ({ modules }) => modules);

export default Module;