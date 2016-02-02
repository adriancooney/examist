import { Reducer } from "../../library";
import Paper from "./Paper";
import Module from "./Module";
import Question from "./Question";
import Institution from "./Institution";
import User from "../User";

const resources = Reducer.combine("resources", 
    Paper, 
    Institution, 
    Module, 
    Question
);

/*
 * Reset the resource on logout.
 */
resources.resetAction(User.logout);


/*
 * Export reducer.
 */
export default resources;

/*
 * Export models.
 */
export Paper from "./Paper";
export Module from "./Module";
export Question from "./Question";
export Institution from "./Institution";