import "../../../style/app/Dashboard.scss"
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { isPending } from "redux-pending";
import * as model from "../../model";
import { selector } from "../../library/Selector";
import { Loading } from "../ui/";
import { CourseList } from "../ui/course/";

class Dashboard extends Component {
    static selectors = selector({
        user: model.User.selectCurrent,
        userCourses: model.User.selectCourses,

        // Loading states of our actions.
        isLoadingCourses: isPending(model.User.getCourses.type)
    });

    static actions = {
        getCourses: model.User.getCourses
    };

    componentWillMount() {
        // If our user courses is null, it means we haven't attempted to load them
        // yet. If it's empty, it means the user has no courses.
        if(!this.props.user.courses)
            this.props.getCourses();
    }

    render() {
        let courses = !this.props.user.courses || this.props.isLoadingCourses ? 
            <Loading /> : <CourseList courses={this.props.userCourses} />;

        return (
            <div className="Dashboard">
                <h2>Your Courses <Link to="/courses/pick">edit</Link></h2>
                { courses }
            </div>
        );
    }
}

export default connect(Dashboard.selectors, Dashboard.actions)(Dashboard);