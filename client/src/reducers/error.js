import { DEBUG } from "../Config";

export default function(state = null, action) {
    if(action.error && action.meta && action.meta.network && action.meta.fatal) {
        // Log the error if we're in debug mode
        if(DEBUG) console.error(`${action.type} action error:`, action.payload.stack);

        // Return the error as the state
        return action.payload;
    } else if(state && action.type === "@@router/UPDATE_LOCATION") return null; // Delete the error when we move
    else return state;
}