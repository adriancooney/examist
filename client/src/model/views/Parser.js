import { Reducer } from "../../library";
import { Enum } from "../../Util";

export const views = Enum("info", "questions", "help")

const Parser = new Reducer("parser", {
    view: views.info
});

export const switchView = Parser.createAction("PARSER_SWITCH_VIEW").handle((state, view) => ({
    ...state, view
}));

export const selectView = state => state.views.parser.view;

export default Parser;