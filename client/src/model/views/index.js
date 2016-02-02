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
export Login from "./Login";
export Signup from "./Signup";