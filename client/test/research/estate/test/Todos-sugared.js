import { scope, State } from "../";

export default Todos extends State {
    getInitialState() {
        return {
            filter: "all",
            todos: []
        }
    }

    setFilter(type) {
        this.set("filter", type)
    }

    addTodo(id) {

    }

    removeTodo(id) {

    }

    complete(id) {
        // This notices something within the state has update, notify
        // anything listening
        this.getTodoById(id).complete();
    }

    getTodoById(id) {
        return this.todos.find(todo => todo.id === id);
    }
}