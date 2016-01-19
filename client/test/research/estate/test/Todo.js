export default class Todo extends Model {
    constructor() {
        this.completed = false;
    }

    @mutation
    complete() {
        this.completed = true;
    }
}