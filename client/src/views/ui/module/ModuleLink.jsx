import "../../../../style/ui/Module.scss";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { Box, FlexBox } from "../layout";

export default class ModuleLink extends Component {
    static propTypes = {
        module: PropTypes.object.isRequired,
        onRemove: PropTypes.func,
        onAdd: PropTypes.func
    };

    constructor(props) {
        super(props);

        if(this.props.onRemove && this.props.onAdd)
            throw new Error("A module cannot be removable and addable simultaneously.");
    }

    renderModuleCode(code, link) {
        let match = code.match(/([A-Z]+)(\d+)(-\d+)?/);

        if(match) {
            let [ _full, category, number ] = match;

            return (
                <h4>
                    <Link to={link}>
                        <strong className={`code-size-${category.length}`}>{ category }</strong>
                        <br/>
                        { number }
                    </Link>
                </h4>
            );
        } else {
            return (<h4><Link to={link}>{ code }</Link></h4>);
        }
    }

    renderOverlay() {
        if(this.props.onRemove) {
            return (<div className="overlay removable" onClick={this.props.onRemove}><span>-</span></div>);
        } else if(this.props.onAdd) {
            return (<div className="overlay addable" onClick={this.props.onAdd}><span>+</span></div>);
        }
    }

    render() {
        let { code, name } = this.props.module;
        const link = `/module/${code.toLowerCase()}`;

        return (
            <div className="ModuleLink">
                { this.renderOverlay() }
                <Box>
                    { this.renderModuleCode(code, link) }
                    <h3><Link to={link}>{ name }</Link></h3>
                </Box>
            </div>
        );
    }
}