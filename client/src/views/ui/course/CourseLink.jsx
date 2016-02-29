import "../../../../style/ui/Course.scss";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { Box } from "../layout";

export default class CourseLink extends Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        onRemove: PropTypes.func,
        onAdd: PropTypes.func
    };

    constructor(props) {
        super(props);

        if(this.props.onRemove && this.props.onAdd)
            throw new Error("A course cannot be removable and addable simultaneously.");
    }

    renderCourseCode(code, link) {
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
        let { code, name } = this.props.course;
        const link = `/course/${code.toLowerCase()}`;

        return (
            <div className="CourseLink">
                { this.renderOverlay() }
                <Box>
                    { this.renderCourseCode(code, link) }
                    <h3><Link to={link}>{ name }</Link></h3>
                </Box>
            </div>
        );
    }
}