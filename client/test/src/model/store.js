import Store from "../../../src/Store";
import rootReducer from "../../../src/model";
import Attendant from "../../library/Attendant";

const store = new Attendant(Store, rootReducer.getReducer());

// Test if it works
describe("Attendant", () => {
    it("should emit an event for an action", done => {
        store.on("MY_ACTION_TYPE", (state, action, nextState) => {
            done();
        });

        store.dispatch({ type: "MY_ACTION_TYPE" });
    });
});

export default store;

