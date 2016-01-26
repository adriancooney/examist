export default function(state = null, action) {
    if(action.error) return action.payload;
    else if(state && action.type === "@@router/UPDATE_LOCATION") return null;
    else return state;
}