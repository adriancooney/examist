import { expect } from "chai";
import API from "../../../src/API";
import * as User from "../../../src/model/User";
import client from "../../library/client";
import { expectAsync, APIError } from "../../library/util";
import store from "./store";

const USER_EMAIL = "a.cooney10@nuigalway.ie";
const USER_PASSWORD = "root";

/*
 * Notes for writing reducer tests:
 *     * Assertions in listeners will not automatically be handled by mocha, they are async! Use
 *       `expectAsync` utility function.
 *     * Nock interceptors are ephemeral. Once the endpoint is hit and the data returned, it will
 *       be removed!
 *     * Action listeners should only be listened for ONCE! Otherwise you'll get an error saying
 *       you're calling `done` too much. 
 */
describe("UserModel", () => {
    describe("actions", () => {
        describe("login", () => {
            it("should log a user in and create their store", done => {
                const details = { email: USER_EMAIL, password: USER_PASSWORD };

                client()
                    .post("/login", details)
                    .reply(200, {
                        id: 1,
                        name: "Adrian",
                        key: "124lkh1l24jkjfasf"
                    });

                // Listen for actions and the state change afterwards
                store.once(User.login.type, expectAsync((state, action, nextState) => {
                    expect(nextState.user).to.be.ok;
                    expect(nextState.user).to.contain.any.keys("api");
                    expect(nextState.user.api).to.be.instanceof(API);
                    done();
                }, done));

                store.dispatch(User.login(details));
            });

            it("should set error on login view on failed response", done => {
                client()
                    .post("/login")
                    .reply(APIError(403, "Invalid credentials"));

                store.once(User.login.type, expectAsync((state, action, nextState) => {
                    expect(action.error).to.be.ok;
                    expect(nextState.views.login.error).to.be.instanceof(Error);
                    expect(nextState.views.login.error.message).to.match(/invalid credentials/i);
                    done();
                }, done));

                store.dispatch(User.login({ email: "foo", password: "bar" }));
            });
        });

        describe("create", () => {
            it("should create and log the user in", done => {
                client()
                    .post("/user")
                    .reply(200, {
                        id: 1,
                        name: "Adrian",
                        key: "124lkh1l24jkjfasf"
                    });

                // The USER_LOGIN action (login) is the equivalent in reducing
                // so all we need to do is check if the user store is not null
                store.once(User.create.type, expectAsync((state, action, nextState) => {
                    expect(nextState.user).to.not.be.null;
                    done();
                }, done));

                store.dispatch(User.create({ email: USER_EMAIL, name: "Adrian", password: USER_PASSWORD }));
            });

            it("should set error on signup view on failed response", done => {
                client()
                    .post("/user")
                    .reply(APIError(422, "Invalid institution"));

                // The USER_LOGIN action (login) is the equivalent in reducing
                // so all we need to do is check if the user store is not null
                store.once(User.create.type, expectAsync((state, action, nextState) => {
                    expect(nextState.views.signup.error).to.not.be.null;
                    done();
                }, done));

                store.dispatch(User.create({ email: USER_EMAIL, name: "Adrian", password: USER_PASSWORD }));
            });
        });
    });
});