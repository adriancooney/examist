import { Reducer } from "../../library";
import Paper from "./Paper";
import Module from "./Module";
import Question from "./Question";
import Institution from "./Institution";
import User from "../User";

const resources = Reducer.combine("resources", Paper, Institution, Module, Question);

resources.resetAction(User.logout);

export default resources;