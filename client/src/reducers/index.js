// Each export here is a property on the global state object. neat.
export user from "./user";
export modules from "./modules";
export questions from "./questions";
export institutions from "./institutions";
export papers from "./papers";
export error from "./error";
export views from "./views";

// Instead of combining it in the main file cluttering it
// up, we can just export the router
export { routeReducer as routing } from "redux-simple-router";
export { pendingReducer as pending } from "redux-pending";