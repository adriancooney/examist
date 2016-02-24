import { difference } from "lodash/array";
import { Reducer } from "../../library";
import * as User from "../User";
import * as Course from "../resources/Course";

const Picker = new Reducer("picker", {
    results: []
});

/*
 * Handle course searches.
 */
Picker.handleAction(Course.search, (state, { courses }) => ({
    results: courses.map(mod => mod.id)
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

    // Filter out user's courses
    if(state.user.courses && state.user.courses.length)
        results = difference(results, state.user.courses);

    return results.map(id => Course.selectById(id)(state));
};

export default Picker;