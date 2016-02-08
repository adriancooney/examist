import React, { Component, PropTypes } from "react";
import { Box } from "../layout";
import Input from "./Input";
import Button from "./Button";

export default class Form extends Component {
    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.node).isRequired,
        onSubmit: PropTypes.func.isRequired,
        onError: PropTypes.func,
        onChange: PropTypes.func
    };

    state = {
        errors: []
    };

    render() {
        const buttonText = this.props.button || "Submit";

        const inputs = this.props.children.map((child, key) => {
            if(child.type === Input) {
                let name = child.props.name;

                return React.createElement(child.type, {
                    ...child.props, 
                    key, 
                    ref: name,
                    error: this.getFieldError(name),
                    onChange: this.onChange.bind(this, name)
                });
            }
        }).filter(input => !!input);

        return (
            <Box vertical className="Form">
                { inputs }

                <div className="form-center">
                    <Button onClick={::this.onSubmit}>{ buttonText }</Button>
                </div>
            </Box>
        );
    }

    /**
     * Returns an input by name.
     * @param  {String} name The input name.
     * @return {Input}       The input.
     */
    getInput(name) {
        return this.refs[name] instanceof Input ? this.refs[name] : undefined;
    }

    /**
     * On form error.
     * @param  {Array} errors The list of input errors.
     */
    onError(errors) {
        if(this.props.onError) this.props.onError(errors);
        this.setState({ errors });
    }

    /**
     * Return a fields error (if any).
     * @param  {String} name The field name.
     * @return {Error}       The field error (if any).
     */
    getFieldError(name) {
        return this.state.errors.find(error => error.field === name);
    }

    /**
     * Handle when any form input changes.
     * @private
     * @param  {String} name  Input name.
     * @param  {Object} event See React's SyntheticEvent.
     */
    onChange(name, event) {
        if(this.props.onChange) this.props.onChange(name, this.refs[name].getValue(), event);
        if(this.state.errors.length) {
            // Remove any errors on field if the input changes
            const fieldError = this.getFieldError(name);

            if(fieldError)  {
                const errors = this.state.errors.slice();
                errors.splice(errors.indexOf(fieldError), 1);
                this.setState({ errors });
            }
        }
    }

    /**
     * Handle form submissions. 
     * @private
     */
    onSubmit() {
        const values = this.getValues();

        // Ensure we have all our required fields
        const errors = Object.keys(values).reduce((err, field) => {
            const value = values[field];

            if(!value && !this.getInput(field).props.optional) 
                err.push(new InputError(field));

            return err;
        }, []);

        // Only raise an error if there's a handler! Otherwise assume
        // the onSubmit handler wants the raw data.
        if(errors.length) this.onError(errors);
        else {
            if(this.state.errors.length) 
                this.setState({ errors: [] });

            this.props.onSubmit(values);
        }
    }

    /**
     * Return the form's input values in a map of inputName:value.
     * @return {Object} Input value map.
     */
    getValues() {
        return Object.keys(this.refs).reduce((values, name) => {
            const input = this.getInput(name);
            if(input) values[name] = input.getValue();
            return values;
        }, {});
    }
}

class InputError extends Error {
    constructor(field) {
        super(`Missing value for ${field}.`);
        this.field = field;
    }
}