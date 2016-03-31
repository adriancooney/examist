import React, { Component, PropTypes } from "react";

export default class Select extends Component {
    static propTypes = {
        options: PropTypes.oneOfType([
            PropTypes.array.isRequired,
            PropTypes.object.isRequired
        ])
    };

    render() {
        let options = this.props.options;

        if(Array.isArray(options)) {
            options = options.reduce((options, option) => {
                options[option] = option;
                return options;
            }, {})
        }

        options = Object.keys(options).map((key, i) => {
            return <option value={key} key={i} >{options[key]}</option>
        });

        return (
            <select onChange={this.props.onChange} defaultValue={this.props.defaultValue} ref="select">
                { options }
            </select>
        );
    }

    getValue() {
        return this.refs.select.value;
    }
}

export class BinarySelect extends Component {
    render() {
        const options = {
            "true": this.props.boolean ? "True" : "Yes",
            "false": this.props.boolean ? "False" : "No"
        };

        return <Select {...this.props} ref="select" options={options} defaultValue={!!this.props.defaultValue + ""}/>;
    }

    getValue() {
        return this.refs.select.getValue() === "true" ? true : false;
    }
}