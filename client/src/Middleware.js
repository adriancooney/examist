import { select } from "./Store";
import * as model from "./model";

/**
 * Require authorization to enter a route.
 * @param  {Object}   nextState The next state once this function completes execution.
 * @param  {Function} replace   The state to replace it with.
 */
export function authorize(nextState, replace) {
    const user = model.User.selectCurrent();
    const { location } = nextState;

    if(!user)
        replace({ pathname: "/login", state: { location } });
}