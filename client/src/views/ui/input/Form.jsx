import React, { Component, PropTypes } from "react";
import { Box } from "../layout";
import Input from "./Input";
import Button from "./Button";

export default class Form extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        onChange: PropTypes.func
    };

    constructor(props) {
        super(props);

        let inputs = this.props.children.reduce((inputs, child, key) => {
            if(child.type === Input) {
                let name = child.props.name;
                inputs[name] = React.createElement(child.type, {
                    ...child.props, 
                    key, 
                    ref: name,
                    onChange: this.onChange.bind(this, name)
                });
            }

            return inputs;
        }, {});

        this.state = { inputs };
    }

    render() {
        let buttonText = this.props.button || "Submit";

        return (
            <Box vertical className="Form">
                { Object.keys(this.state.inputs).map(key => this.state.inputs[key]) }

                <div className="form-center">
                    <Button onClick={::this.onSubmit}>{ buttonText }</Button>
                </div>
            </Box>
        );
    }

    onChange(name, event) {
        if(this.props.onChange) this.props.onChange(name, this.refs[name].getValue(), event);
    }

    onSubmit() {
        this.props.onSubmit(this.getValues());
    }

    getValues() {
        return Object.keys(this.state.inputs).reduce((values, name) => {
            values[name] = this.refs[name].getValue();
            return values;
        }, {});
    }
}