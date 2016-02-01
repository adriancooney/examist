export views from "./views";
export resources from "./resources";

// Each export here is a property on the global state object. neat.
export user from "./user";
export error from "./error";

// Instead of combining it in the main file cluttering it
// up, we can just export the router
export { routeReducer as routing } from "redux-simple-router";
export { pendingReducer as pending } from "redux-pending";