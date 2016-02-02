import { Reducer } from "../../library";
import Login from "./Login";
import Signup from "./Signup";

export default Reducer.combine("views", Login, Signup);