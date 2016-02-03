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
export * as Paper from "./Paper";
export * as Module from "./Module";
export * as Question from "./Question";
export * as Institution from "./Institution";