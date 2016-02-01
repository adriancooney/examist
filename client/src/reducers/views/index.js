import { combineReducers } from "redux";
import login from "./login";
import signup from "./signup";

export default combineReducers({
    login, signup
});