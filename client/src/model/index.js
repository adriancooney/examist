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
    new Reducer("routing", routeReducer),
    new Reducer("pending", pendingReducer)
).getReducer();
