import url from "url";
import Debug from "debug";
import fetch from "isomorphic-fetch";
import { range } from "lodash/util";
import { random } from "lodash/number";
import { API_BASE_URL, DEBUG } from "./Config";

const debug = Debug("examist:api");

export default class API {
    constructor(key) {
        this.key = key;
    }

    static request(method, path, data = {}, headers = {}) {
        method = method.toUpperCase(); // Normalize the method

        debug(`>> %c${method} ${API_BASE_URL}${path}${headers["Auth-Key"] ? " (authorized)" : ""}`, "color: purple", data);

        return fetch(API_BASE_URL + path, {
            method, 
            headers: {
                ...headers,
                "Content-Type": "application/json"
            }, 
            body: method !== "GET" ? JSON.stringify(data) : undefined
        }).then(response => {
            // Hold yer horser
            if(DEBUG) {
                return new Promise(resolve => setTimeout(() => resolve(response), 1000));
            } else return response;
        }).then(response => {
            return Promise.all([response.json(), response]);
        }).catch(error => {
            // Match invalid JSON response
            if(error instanceof SyntaxError && error.message.match(/Unexpected end of input/))
                throw new InvalidResponse("Invalid JSON response.");
        }).then(([body, response]) => {
            debug("<< %s", response.status, body)

            // Throw any HTTP errors
            if(response.status >= 400) 
                throw new HTTPError(response.status, body.message, body);

            return body;
        });
    }

    request(method, path, data) {
        return API.request(method, url, data, { "Auth-Key": this.key });
    }

    /**
     * Log the user into the API.
     * @param  {Object} details { username, password }
     * @return {Promise} -> {Object}
     */
    static login({ email, password }) {
        return API.request("POST", "/login", { email, password });
    }

    /**
     * Create a new user.
     * @param  {String} options.name     User's name.
     * @param  {String} options.email    User's email.
     * @param  {String} options.password User's password.
     * @return {Promise} -> {Response}
     */
    static createUser({ name, email, password }) {
        return API.request("POST", "/user", { name, email, password });
    }

    /**
     * Get university by their domain name. e.g. nuigalway.ie. Used when
     * finding the university on the signup page.
     * @param  {String} domain The university domain.
     * @return {Promise} -> {Insititution}
     */
    static getInstitutionByDomain(domain) {
        return API.fakeRequest("GET", `/institution/search?q=${domain}`).then(() => ({
            id: 1,
            shorthand: "NUIG",
            name: "National University of Ireland, Galway",
            image: "http://www.nuigalway.ie/cdn/images/dropdown-thumb-1.jpg",
            domain: "nuigalway.ie",
            colors: {
                primary: "#68085B",
                secondary: "#7DB8C5"
            },
            stats: {
                students: 312,
                modules: 1249,
                papers: 14940
            }
        }));
    }

    /**
     * Get the current logged in user's own modules.
     * @return {Promise} -> {Object{modules: Array}}
     */
    getModules() {
        return this.fakeRequest("GET", "/profile/modules").then(() => ({
            modules: range(6).map(() => Generator.module("CT" + Math.floor(Math.random() * 1000)))
        }))
    }

    /**
     * Get a module by code.
     * @param  {String} code Code e.g. CT470
     * @return {Promise} -> {Object}
     */
    getModule(code) {
        return this.fakeRequest("GET", `/module/${code}`).then(() => ({
            module: Generator.module(code)
        }));
    }

    /**
     * Get a paper module, year, period.
     * @param  {String} module Code e.g. CT470
     * @param  {Number} year   The year e.g. 2007
     * @param  {String} period One of ["summer", "winter", "autumn", "spring"]
     * @return {Promise} -> {Object}
     */
    getPaper(module, year, period) {
        return this.fakeRequest("GET", `/module/${module}/paper/${year}/${period}`).then(() => ({
            paper: Generator.paper(module, year, period)
        }));
    }
}

export class HTTPError extends Error {
    constructor(status, message, body) {
        super(`${status}: ${message}`);
        this.status = status;
        this.message = message;
        this.body = body;
    }
}

export class InvalidResponse extends Error {}

/*
 * Dummy data generators
 */
const Generator = {
    module(code) {
        return {
            code,
            name: "Maths",
            papers: range(5).map((v, i) => ({ 
                ...Generator.paper(code, 2015 - i, ["autumn", "winter", "summer"][random(0, 2)]),
                isIndexed: random(0, 1) == 0
            }))
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
            path: [1, 1]
        }
    },

    __uid: 0,
    getUID() {
        return Generator.__uid++;
    }
};