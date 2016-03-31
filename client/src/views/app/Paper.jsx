import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import * as model from "../../model";
import { Loading, Empty, Icon } from "../ui";
import { Box } from "../ui/layout";
import { PaperInfo } from "../ui/paper";
import { Questions } from "../ui/question";

class Paper extends Component {
    static selector = (state, { params }, { paper }) => {
        return {
            questions: model.resources.Question.selectByPaper(paper.id)(state),
            isLoadingPaper: isPending(model.resources.Paper.getPaper.type)(state)
        };
    };

    static actions = {
        getPaper: model.resources.Paper.getPaper
    };

    static contextTypes = {
        course: PropTypes.object,
        paper: PropTypes.object
    };

    componentWillMount() {
        const { params: { course, year, period } } = this.props;
        const { paper } = this.context;

        // When we directly link to the paper
        if(!paper || !paper.questions)
            this.props.getPaper(course, year, period);
    }

    componentWillReceiveProps(props, context) {
        const { isLoadingPaper, params: { course, year, period } } = props;
        const { paper } = context;

        // Previous state
        let prevCourse = this.props.params.course;
        let prevYear = this.props.params.year;
        let prevPeriod = this.props.params.period;

        if(!isLoadingPaper) {
            // On route navigation while the component is mounted
            if(!paper && (prevCourse !== course || prevYear !== year || prevPeriod !== period))
                this.props.getPaper(course, year, period);

            // If we have the paper loaded in memory, but the questions are not loaded
            if(paper && !paper.questions)
                this.props.getPaper(course, year, period);
        }
    }

    render() {
        const { isLoadingPaper } = this.props;
        const { paper, course } = this.context;

        let content;
        const questions = this.props.questions;

        if(isLoadingPaper) {
            return <Loading />;
        }

        if(paper.questions) {
            if(questions.length) {
                content = <Questions 
                    toplevel
                    course={course} 
                    paper={paper} 
                    questions={questions}/>;
            } else {
                content = (
                    <div className="paper-empty">
                        <h3><Icon name="exclamation-triangle" size={5}/></h3>
                        <h4>This paper has no questions yet.</h4> 
                        <p>Help your course out and <Link to={this.getParserLink() + "/questions"}>pick them from the paper</Link>.</p>
                    </div>
                );
            }

            return (
                <Box>
                    <div className="Paper">{ content }</div>
                    <PaperInfo course={course} paper={paper} />
                </Box>
            );
        } else return <Empty />;
    }

    getParserLink() {
        const { course, paper } = this.context;
        return `/course/${course.code}/paper/${paper.year_start}/${paper.period}/parse`;
    }
}

export default connect(Paper.selector, Paper.actions)(Paper);