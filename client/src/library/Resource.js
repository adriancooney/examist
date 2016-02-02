import Reducer from "./Reducer";
import { unionBy } from "lodash/array";
import { pick } from "lodash/object";

export default class Resource extends Reducer {
    constructor(name, key, { cleaner } = {}) {
        // Create our resource under the pluralized name
        super(name.toLowerCase() + "s", []);

        if(typeof key === "undefined")
            throw new Error("Resource key parameter (string or function) is required.");

        if(typeof key !== "string" && typeof key !== "function")
            throw new Error("Resource key parameter must be string describing key prop or function which returns key.");

        this.key = key;

        if(cleaner) {
            if(typeof cleaner !== "string" && typeof cleaner !== "function" && !Array.isArray(cleaner))
                throw new Error("Resource cleaner must be string or array describing props, or function which returns cleaned resource.");

            this.cleaner = cleaner;
        }

        // The resource action type
        this.type = name.toUpperCase();

        // Bind the actions
        this.handleAction(this.type, this.onLoad.bind(this));
    }

    /**
     * Get the resource unique key.
     * @param  {Object} resource The resource.
     * @return {Any}             The resource key.
     */
    getResourceKey(resource) {
        if(typeof this.key === "string") return resource[this.key];
        else return this.key(resource);
    }

    /**
     * Clean a resource object.
     * @param  {Obejct} object The unclean resource object.
     * @return {Object}        The cleaned resource.
     */
    clean(object) {
        if(this.cleaner) {
            if(typeof this.cleaner === "function") return this.cleaner(object);
            else return pick(object, this.cleaner);
        } else return object;
    }

    /**
     * When a single resource is loaded.
     * @param   {Array}  loadedResources  The loaded resources (i.e. state of the reducer).
     * @param   {Any}    resources        The new resources.
     * @returns {Object}                  The merged, loaded resources (i.e. the new state of the reducer).
     */
    onLoad(loadedResources, resources) {
        return unionBy(Array.isArray(resources) ? resources : [resources].filter(this.clean.bind(this)), 
            loadedResources, this.key);
    }

    /**
     * Select from resource by comparing resource key to key.
     * @param  {Any}      key The resource key.
     * @return {Function}     The selector function.
     */
    selectByKey(key) {
        return this.select(resources => resources.find(resource => this.getResourceKey(resource) === key));
    }

    /**
     * Create an action that updates the resource.
     * @param  {Function} creator The action transformer.
     * @param  {Function} meta    The meta creator.
     * @return {Function}         Action creator.
     */
    createResourceAction(creator, meta) {
        return this.createAction(this.type, creator, meta);
    }

    /**
     * Create a resource action that requires tate.
     * @param  {Function} selector The bounded selector function.
     * @param  {Function} creator  The action transformer.
     * @param  {Function} meta     The meta creator.
     * @return {Function}          Action creator.
     */
    createStatefulResourceAction(selector, creator, meta) {
        return this.createStatefulAction(this.name.toUpperCase(), selector, creator, meta);
    }
}