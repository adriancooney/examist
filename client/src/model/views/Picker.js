import { difference } from "lodash/array";
import { Reducer } from "../../library";
import * as User from "../User";
import * as Module from "../resources/Module";

const Picker = new Reducer("picker", {
    results: []
});

/*
 * Handle module searches.
 */
Picker.handleAction(Module.search, (state, { modules }) => ({
    results: modules.map(mod => mod.id)
}));

/**
 * Clear the search results.
 * @type {Function}
 */
export const clearResults = Picker.createAction("PICKER_CLEAR_SEARCH_RESULTS").handle(Picker.initial);

/*
 * Select the search results.
 */
export const selectResults = state => {
    let results = state.views.picker.results;

    // Filter out user's modules
    if(state.user.modules && state.user.modules.length)
        results = difference(results, state.user.modules);

    return results.map(id => Module.selectById(id)(state));
};

export default Picker;