import { Map } from "immutable";

export default class View extends Component {
    /**
     * Default getInitialState method returns Immutable object.
     * @return {Immutable.Map}
     */
    getInitialState() {
        return Map();
    }

    /**
     * Subscribe to changes to a specific store and
     * insert them into the state under `prop`.
     * @param  {Store} store The data store.
     * @param  {String} prop  The property name on the state object to insert under.
     */
    subscribe(store, prop) {
        if(!this.subscriptions) this.subscriptions = {}
        store.on("change", this.subscriptions[store.name] = (state => this.setState(prop, state)));
    }

    /**
     * Unsubscribe from a store. If not passed a store,
     * all subscriptions are removed.
     * @param  {Store} store The store to unsubscribe from (optional).
     */
    unsubscribe(store) {
        store.off("change", this.subscriptions[store.name]);
    }
}