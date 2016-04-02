import { Reducer } from "../../library";
import Paper from "./Paper";
import Course from "./Course";
import Question from "./Question";
import Institution from "./Institution";
import Comment from "./Comment";
import People from "./People";
import Note from "./Note";
import User from "../User";

const resources = Reducer.combine("resources", 
    Paper, 
    Institution, 
    Course, 
    Question,
    Comment,
    People,
    Note
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
export * as Note from "./Note";
export * as Paper from "./Paper";
export * as Course from "./Course";
export * as People from "./People";
export * as Comment from "./Comment";
export * as Question from "./Question";
export * as Institution from "./Institution";