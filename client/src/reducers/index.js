export user from "./user";

// Instead of combining it in the main file cluttering it
// up, we can just export the router
export { routeReducer as routing } from "redux-simple-router";