import { range } from "lodash/util";

export default class API {
    constructor(key) {
        this.key = key;
    }

    static request(method, url, data = {}, headers = {}) {
        console.log(`${method.toUpperCase()} ${url} ${JSON.stringify(data)}${headers["Auth-Key"] ? " (authorized)" : ""}`);

        return new Promise((resolve) => {
            setTimeout(resolve.bind(this, {
                req: { code: 200 },
                body: "Success"
            }), 1000);
        });
    }

    request(method, url, data) {
        return API.request(method, url, data, { "Auth-Key": this.key });
    }

    /**
     * Log the user into the API.
     * @param  {String} username User's username.
     * @param  {String} password User's password.
     * @return {Promise} -> {Object}
     */
    static login(username, password) {
        return API.request("POST", "/login", { username, password }).then(() => ({
            id: 1,
            usename: "adrian",
            name: "Adrian Cooney",
            email: "cooney.adrian@gmail.com",
            loading: false,
            key: "f89sf0n7f0as97fn90sa7fn" 
        }));
    }

    /**
     * Get the current logged in user's own modules.
     * @return {Promise} -> {Object{modules: Array}}
     */
    getModules() {
        return this.request("GET", "/profile/modules").then(() => ({
            modules: range(6).map(() => {
                return {
                    code: "CT" + Math.floor(Math.random() * 1000)
                }
            })
        }))
    }
}