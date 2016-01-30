import React, { Component, PropTypes } from "react";
import { Box } from "../layout";
import Input from "./Input";
import Button from "./Button";

export default class Form extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        let inputs = this.props.children.reduce((inputs, child, key) => {
            if(child.type === Input)
                inputs[child.props.name] = React.createElement(child.type, 
                    Object.assign({}, child.props, { key, ref: child.props.name }));

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
