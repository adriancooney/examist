export default class API {
    constructor(key) {
        this.key = key;
    }

    static request(method, url, data = {}) {
        console.log(`${method.toUpperCase()} ${url} ${JSON.stringify(data)}`);

        return new Promise((resolve) => {
            setTimeout(resolve.bind(this, {
                req: { code: 200 },
                body: "Success"
            }), 1000);
        });
    }

    request(method, url, data) {
        return API.request(method, url, data);
    }

    /**
     * Log the user into the API.
     * @param  {String} username User's username.
     * @param  {String} password User's password.
     * @return {Promise} -> {Object}
     */
    static login(username, password) {
        return API.request("POST", "/login", { username, password }).then(() => ({ key: "f89sf0n7f0as97fn90sa7fn" }));
    }
}