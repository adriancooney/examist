import Reducer from "./Reducer";
import { Enum } from "../Util";
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

        // Bind the actions
        this.handleAction(name.toUpperCase(), this.onLoad.bind(this));
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
     * @param  {Array}  loadedResources  The loaded resources (i.e. state of the reducer).
     * @param  {Object} resource         The merged, loaded resources. (i.e. the new state of the reducer).
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
    getByKey(key) {
        return this.select(resources => resources.find(resource => this.getResourceKey(resource) === key));
    }
}