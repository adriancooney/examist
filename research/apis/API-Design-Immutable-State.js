const state = new Store({
    user: User
});

class User extends Store {
    getCurrent() {
        return this; // i.e. state.user
    }

    getApi() {
        return this.get("api");
    }

    getModule(id) { // This is the action { type: 'user:getModule', args: [id] }
        return this.get("api").getModule(id)
            .then(modules => this.set(`modules[${id}]`, modules)) // This is the action handler
    }

    login(username, password) {
        return API.login(username, password).then(({ api, user }) => this.set({ api, user }));
    }
}

@connect({ user: user })
class App extends Component {
    componentDidMount() {
        this.loading(true);
        state.user.getModules() // State update
            .then(this.loading.bind(this, false))
            .catch(::this.error);
    }

    render() {
        if(this.state.isLoading) {
            return <Loading />
        } else if(this.state.error) {
            return <p>Error: {this.state.error}</p>;
        } else return this.state.user.modules.map
    }

    loading(loading) {
        this.state.isLoading = loading;
    }

    error(error) {
        this.error = error.message;
    }
}

