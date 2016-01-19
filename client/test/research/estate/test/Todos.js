import State from "state";

// Return the 
const todos = State.get("todos");

todos.setInitialState({
    todos: [],
    filter: "all"
});

// Add the actions to the state
todos.__proto__.addTodo = function(todo) {
    // Get the current state
    let state = todos.getState();

    // With immutable js, 
    state.withMutations(state => {
        (function() {

        }).call(new )
    })
};