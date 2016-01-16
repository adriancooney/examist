import { Record } from "immutable";

class User extends Record.Class {
    constructor() {
        super({
            a: 1,
            b: 3
        })
    }

    log() {
        console.log(this);
    }
}

var a = User();
console.log(a.b);