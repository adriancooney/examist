import React, { Component } from "react";
import { states } from "estate";
import Todo from "./components/Todo"; 
import Todos from "./state/Todos";

// This annotation sets the state of the component to reflect
// that of the global state of "todos". I.e. since "todos" is 
// the property the Todos class on the global state, it is
// also the property on the App state.
// 
// This annotation also sets up the component to subscribe to the
// Todos state and unsubscribe when it is unmounted. It will also
// setup the getInitialState to return the initial state of the
// component. You could also do this manually as shown below.
@states(Todos)
export default class App extends Component {

    // Manual setup (without the states keyword)
    getInitialState() {
        return { todos: Todos }
    }

    componentWillMount() {
        this.subscription = Todos.subscribe((state) => {
            this.setState({ todos: state });
        });
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        let todos = this.state.todos
            .filter(todo => this.state.filter === "completed" && todo.completed === true)
            .map(todo => <Todo todo={todo} onComplete={Todos.complete.bind(Todos, todo)} />);

        return (<div className="App">
            <ul>
                { todos }
            </ul>
        </div>);
    }
}