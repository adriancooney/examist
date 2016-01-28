import { select } from "./Store";
import * as selectors from "./selectors";

/**
 * Require authorization to enter a route.
 * @param  {Object}   nextState The next state once this function completes execution.
 * @param  {Function} replace   The state to replace it with.
 */
export function authorize(nextState, replace) {
    const user = select(selectors.User.current);
    const { location } = nextState;

    if(!user)
        replace({ pathname: "/login", state: { location } });
}