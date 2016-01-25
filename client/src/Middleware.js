import { select } from "./Store";
import * as selectors from "./selectors";

/**
 * Require authorization to enter a route.
 * @param  {Object} nextState See react-router:Route#onEnter prop.
 * @param  {Function} replace See react-router:Route#onEnter prop.
 */
export function authorize(nextState, replace) {
    const user = select(selectors.User.current);

    if(!user)
        replace("/login");
}