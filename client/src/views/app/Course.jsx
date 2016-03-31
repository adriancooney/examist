import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { some } from "lodash/collection";
import { matchesProperty } from "lodash/util";
import { isPending } from "redux-pending";
import * as model from "../../model";
import { PaperGrid } from "../ui/paper";
import { Questions } from "../ui/question";
import { Loading } from "../ui/";
import { Box, Flex } from "../ui/layout";

class Course extends Component {
    static selector = (state, { params }) => {
        let papers, paper, popularQuestions;
        const course = model.resources.Course.selectByCode(params.course)(state);

        if(course) {
            papers = model.resources.Paper.selectByCourse(course.id)(state);

            if(params.year && params.period) {
                paper = model.resources.Paper.selectPaper({ 
                    period: params.period,
                    year: parseInt(params.year), 
                    course: course.id 
                })(state);
            } else if(course.popular_questions) {
                popularQuestions = course.popular_questions.map(id => {
                    return state.resources.questions.find(q => q.id === id);
                });
            }

        }
        
        return {
            course, papers, paper, popularQuestions,
            isLoadingCourse: isPending("GET_COURSE")(state) || isPending("GET_POPULAR")(state)
        };
    };

    static actions = {
        getCourse: model.resources.Course.getCourse,
        getPopular: model.resources.Course.getPopular
    };

    static childContextTypes = {
        course: PropTypes.object,
        paper: PropTypes.object
    };

    getChildContext() {
        return { 
            course: this.props.course,
            paper: this.props.paper 
        };
    }

    componentWillMount() {
        const { course, papers } = this.props;

        let getCourse = this.props.children ? this.props.getCourse : this.props.getPopular;

        if(!course)
            getCourse(this.props.params.course);

        // This is for the instance when we the course has been loaded
        // but not all the papers have been loaded. We loop over each
        // paper id in the course's papers and check if it's loaded.
        if(course && papers && !course.papers.every(id => some(papers, matchesProperty("id", id))))
            getCourse(this.props.params.course);
    }

    render() {
        let { course, papers, paper, children } = this.props;

        if(this.props.isLoadingCourse) {
            return <Loading />
        } else if(course) {
            if(!children) {
                if(this.props.popularQuestions) {
                    this.props.popularQuestions.sort((a, b) => a.similar_count > b.similar_count ? -1 : 1)

                    children = (
                        <div className="popular-questions">
                            <h3>{`Popular questions in ${course.code}`}</h3>
                            <Questions 
                                papers={papers} 
                                questions={this.props.popularQuestions} 
                                course={course} 
                                sorted fullView singleView />
                        </div>
                    );
                } else children = <Loading />;
            }

            return (
                <Flex className="Course">
                    <Box className="course-header">
                        <h1><Link to={`/course/${course.code}`}>{ course.code.toString().toUpperCase() }</Link></h1>
                        <Flex><h3>{ course.name }</h3></Flex>
                    </Box>
                    
                    <PaperGrid papers={papers} course={course} currentPaper={paper} />

                    { children }
                </Flex>
            );
        } else return (<div>Course not found.</div>);
    }
}

export default connect(Course.selector, Course.actions)(Course);