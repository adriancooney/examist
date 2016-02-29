import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import * as model from "../../model";
import { selector } from "../../library/Selector";
import { CourseList } from "../ui/course";
import { Input } from "../ui/input";
import { Box, Flex } from "../ui/layout";
import { Loading } from "../ui";

const COURSE_COLUMN_HEIGHT = 6;
const SEARCH_INTENT_TIMEOUT = 400;

class CoursePicker extends Component {
    static selector = selector({
        user: model.User.selectCurrent,
        userCourses: model.User.selectCourses,
        searchResults: model.views.Picker.selectResults,

        // Loading states of our actions.
        isLoadingUserCourses: isPending(model.User.getCourses.type),
        isLoadingSearchResults: isPending(model.resources.Course.search.type),
        location: state => state.routing.location
    });

    static actions = {
        getCourses: model.User.getCourses,
        addCourse: model.User.addCourse,
        removeCourse: model.User.removeCourse,
        searchCourses: model.resources.Course.search,
        clearResults: model.views.Picker.clearResults
    };

    componentWillMount() {
        // If our user courses is null, it means we haven't attempted to load them
        // yet. If it's empty, it means the user has no courses.
        if(!this.props.user.courses)
            this.props.getCourses();    
    }

    render() {
        let userCourses, searchResults, contineToDashboard;

        if(this.props.isLoadingUserCourses) {
            userCourses = <Loading />;
        } else {
            if(this.props.userCourses && !this.props.userCourses.length && this.props.location.state === "POST_SIGNUP") {
                userCourses = (
                    <div className="welcome">
                        <h1>Welcome to Examist.</h1>
                        <p>To get started, you need to have picked some courses.
                        Please select the courses for your course using the 
                        search box on the right. Enter the course code or course name.</p>
                    </div>
                );
            } else {
                userCourses = (
                    <CourseList 
                        placeholderCount={COURSE_COLUMN_HEIGHT} 
                        courses={this.props.userCourses} 
                        onRemove={::this.onRemoveCourse} />
                );
            }
        }

        if(this.props.isSearchingCourses) {
            searchResults = <Loading />;
        } else if(this.props.searchResults && this.props.searchResults.length) {
            searchResults = (
                <CourseList 
                    courses={this.props.searchResults.slice(0, 6)}
                    onAdd={::this.onAddCourse} />
            );
        } else {
            searchResults = <p className="empty">Nothing found.</p>;
        }

        if(this.props.userCourses && this.props.userCourses.length && this.props.location.state === "POST_SIGNUP") {
            contineToDashboard = <p className="continue"><Link to="/">Continue to your dashboard &rarr;</Link></p>
        }

        return (
            <Flex className="CoursePicker">
                <Box className="header">
                    <Flex className="your-courses">
                        <h5>Your courses</h5>
                        { userCourses }
                    </Flex>
                    <Flex vertical className="search-results">
                        <Input 
                            placeholder="Find courses.." 
                            name="course" 
                            ref="search" 
                            loading={this.props.isLoadingSearchResults}
                            onClear={::this.onClearResults}
                            onChange={::this.onSearchChange} />

                        { searchResults }
                    </Flex>
                </Box>
                { contineToDashboard }
            </Flex>
        );
    }

    onSearchChange() {
        if(this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(this.searchCourse.bind(this, this.refs.search.getValue()), SEARCH_INTENT_TIMEOUT);
    }

    searchCourse(query) {
        this.props.searchCourses(query);
    }

    onRemoveCourse(mod) {
        this.props.removeCourse(mod);
    }

    onAddCourse(mod) {
        this.props.addCourse(mod);
    }

    onClearResults() {
        this.props.clearResults();
    }
}

export default connect(CoursePicker.selector, CoursePicker.actions)(CoursePicker);