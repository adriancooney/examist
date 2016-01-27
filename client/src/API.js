import Debug from "debug";
import { range } from "lodash/util";
import { random } from "lodash/number";

const debug = Debug("examist:api");

export default class API {
    constructor(key) {
        this.key = key;
    }

    static request(method, url, data = {}, headers = {}) {
        debug(`>> %c${method.toUpperCase()} ${url}${headers["Auth-Key"] ? " (authorized)" : ""}`, "color: purple", data);

        return new Promise((resolve) => {
            setTimeout(resolve.bind(this, {
                req: { code: 200 },
                body: "Success"
            }), 300);
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

    getModule(code) {
        return this.request("GET", `/module/${code}`).then(() => ({
            module: Generator.module(code)
        }));
    }

    getPaper(module, year, period) {
        return this.request("GET", `/module/${module}/paper/${year}/${period}`).then(() => ({
            paper: Generator.paper(module, year, period)
        }));
    }
}

/*
 * Dummy data generators
 */
const Generator = {
    module(code) {
        return {
            code,
            name: "Maths",
            papers: range(5).map((v, i) => {
                return { 
                    year: 2015 - i, 
                    period: ["autumn", "winter", "summer"][random(0, 2)],
                    isIndexed: random(0, 1) == 0,
                    module: code
                };
            })
        }
    },

    paper(module, year, period) {
        let id = Generator.getUID();
        return {
            id,
            questions: range(10).map(Generator.question.bind(null, id)),
            module, year, period
        };
    },

    question(paper) {
        return {
            paper,
            id: Generator.getUID(),
            content: "What is the highest point on planet earth?",
            path: [1, 1],
        }
    },

    __uid: 0,
    getUID() {
        return Generator.__uid++;
    }
};