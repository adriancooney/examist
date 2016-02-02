import { Reducer } from "../library";

import User from "./User";
import Error from "./Error";
import resources from "./resources";
import views from "./views";
import { routeReducer } from "redux-simple-router";
import { pendingReducer } from "redux-pending";

/*
 * Root reducer.
 */
export default Reducer.combine(
    User, 
    Error,
    resources,
    views,
    new Reducer("routing", routeReducer),
    new Reducer("pending", pendingReducer)
);

/*
 * Models
 */
export * as User from "./User";
export Error from "./Error";
export { routeActions as Routing } from "redux-simple-router";
export * as resources from "./resources";
export * as views from "./views";