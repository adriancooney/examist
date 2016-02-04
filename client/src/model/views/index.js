import { Reducer } from "../../library";
import Login from "./Login";
import Signup from "./Signup";

/*
 * Reducer.
 */
export default Reducer.combine("views", Login, Signup);

/*
 * Model.
 */
export * as Login from "./Login";
export * as Signup from "./Signup";