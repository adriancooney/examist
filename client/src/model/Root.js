import { Reducer, Resource } from "../library";
import { routeReducer } from "redux-simple-router";
import { pendingReducer } from "redux-pending";

/*
 * Root reducer.
 */
export default Reducer.create({
    User: new Reducer("user"),
    Error: new Reducer("error"),
    Routing: new Reducer("routing", routeReducer),
    Pending: new Reducer("pending", pendingReducer),

    resources: {
        Module: new Resource("module"),
        Institution: new Resource("institution"),
        Paper: new Resource("paper"),
        Question: new Resource("question")
    },
    
    views: {
        Login: new Reducer("login"),
        Signup: new Reducer("signup")
    }
});