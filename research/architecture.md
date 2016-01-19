## Architecture
This is a handbook for the architecture of Examist. Whenever I ask myself a question about how it works, I write it down here with the answer.

### Flux
The app is based on the concept of [Facebook's Flux architecture](http://facebook.github.io/flux). To quote Flux's website:

> Flux is the application architecture that Facebook uses for building client-side web applications. It complements React's composable view components by utilizing a unidirectional data flow. It's more of a pattern rather than a formal framework, and you can start using Flux immediately without a lot of new code.

It's built for being used with React and since React is our library of choice, it's a perfect fit. For a good introduction to Flux, [watch this intro video](https://www.youtube.com/watch?list=PLb0IAmt7-GS188xDYE-u1ShQmFFGbrk0v&v=nYkdrAPrdcw) (It's long but worth it).

## Considerations
### Redux
Redux is in the same vein as Flux in that the application state is decoupled from the views, can only be modified via actions and is entirely unidirectional. I still feel as though it's a foreign implementation however. Redux forces you to `dispatch` actions via object that have a `type` property that "reducers" use to identify the required action. It does this by using a switch or if elses. I think this mehtod of passing a string as the function to be completed is crazy. It's essentially just calling a function with an intermediate step:

    // Redux
    store.dispatch({ type: 'REMOVE_TODO', id: 1 });

    // And who receives the action
    function todoReducer(state, action) {
        if(action.type === 'REMOVE_TODO') todos.remove(id);
    }

The above should just be `todos.remove(id)`. There's no need for that producer/consumer pattern. It's like an internal server within the app, it's just unnecessary given they're in the same platform.

What I'm really looking for is something that allows functions to update the state of the application via functions. Take the same concepts of Redux, a single state application that's store in a global object but have a nicer implementation without the ridiculous boiler plate. e.g.:

    import State from "./state";

    // Scope our state
    const state = State.get("todos");

    export function addTodo(todo) {
        // Get the updated state on the scoped state
        let state = state.get(); // state.todos

        // Add the todo to a new object and set the new state.
        let newState = Object.assign({}, state, {
            todos: state.todos.clone().concat([todo])
        });

        // state.todos = newState
        state.set(newState);
    }

And within the application we would access our state properties:

    import todos from "./todos";

    todos.subscribe((state) => {
        console.log(state);
    });

    todos.addTodo()

Remove even more boiler plate code by adding in a function that will wrap our function to set the first argument as the state and any returned data as the state (much like Redux's reducers, just scoped).

    export var addTodo = State.mutation((state, todo) => {
        return Object.assign({}, state, {
            todos: state.todos.clone().concat([todo])
        });
    });

We could go even further and create classes that act on a particular scope. Any properties defined on the class reflect the state of the 
    
    @scope("todos")
    export default class Todos extends State {

    }

Infact, the more and more I think about this, the more ridiculous the whole notion of what Flux is doing becomes more and more crazy. Redux is nearly there with the notion of immutable state (and the sweet reference comparasion technique) but still feels like too much boilerplate. 

Dan Abramov's talk on [Redux](https://www.youtube.com/watch?v=xsSnOQynTHs) was really eye opening and really get across the reasoning for his design decisions. I want to build on his work by mashing the likes of [NuclearJS](http://optimizely.github.io/nuclear-js/) and Redux. Essentially create a better API for Redux.



### Scenarios
* Moving to the app via a URL.