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
        this.addProducerHandler(this.type);
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
        if(this.debug) this.debug("Handling incoming resource(s): ", resources);
        resources = resources.map(resource => {
            if(typeof resource === "undefined")
                throw new Error("Unable to handle undefined resource.");

            let cleaned = this.clean(resource);

            if(typeof cleaned === "undefined")
                throw new Error("Error while cleaning: returned undefined.");

            return cleaned;
        });

        return unionBy(resources, loadedResources, this.key);
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
     * Add an action to the resource that when dispatched, creates
     * the current resource.
     * @param   {String}   actionType The action type.
     * @param   {Function} extractor  A function to return the resource(s).
     * @param   {Function} cleaner    A cleaner for the return reducer (run aswell as default cleaner).
     * @returns {Action}              The producer action.
     */
    addProducerHandler(actionType, extractor, cleaner) {
        return this.handleAction(actionType, 
            (resources, resource) => {
                resource = extractor ? extractor(resource) : resource;
                resource = Array.isArray(resource) ? resource : [resource]
                if(cleaner) resource = resource.map(cleaner);
                return this.onLoad(resources, resource);
            });
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
        return this.createStatefulAction(this.type, selector, creator, meta);
    }

    /**
     * Return a selector creator that will select all the 
     * resources that property matches the value passed to
     * the selector.
     * @param  {String} prop The property name.
     * @return {Function}    The selector creator which takes (value);
     */
    selectByProp(prop) {
        return value => this.select(resources => resources.find(resource => resource[prop] === value));
    }

    /**
     * Like `selectByProp` except select all matching resources.
     * @param  {String} prop The property name.
     * @return {Function}    The selector creator which takes (value);
     */
    selectAllByProp(prop) {
        return value => this.select(resources => resources.filter(resource => resource[prop] === value));
    }
}