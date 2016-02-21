import { Reducer } from "../../library";
import Login from "./Login";
import Signup from "./Signup";
import Picker from "./Picker";

/*
 * Reducer.
 */
export default Reducer.combine("views", Login, Signup, Picker);

/*
 * Model.
 */
export * as Login from "./Login";
export * as Signup from "./Signup";
export * as Picker from "./Picker";