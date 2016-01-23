import { handleActions } from "redux-actions";

export default handleActions({
    LOGIN: (state, action) => {
        console.log("Handling action: ", action.payload);
        return state;
    }
}, {});