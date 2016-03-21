import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import * as model from "../../model";
import { Loading, Empty, Icon } from "../ui";
import { Box } from "../ui/layout";
import { PaperView, PaperInfo } from "../ui/paper";

class Paper extends Component {
    static selector = (state, { params }) => {
        const course = model.resources.Course.selectByCode(params.course)(state);

        return {
            course,
            paper: model.resources.Paper.selectPaperWithQuestions({ 
                period: params.period,
                year: parseInt(params.year),
                course: course.id 
            })(state),
            isLoadingPaper: isPending(model.resources.Paper.getPaper.type)(state)
        };
    };

    static actions = {
        getPaper: model.resources.Paper.getPaper
    };

    componentWillMount() {
        const { paper, params: { course, year, period } } = this.props;

        // When we directly link to the paper
        if(!paper || !paper.questions)
            this.props.getPaper(course, year, period);
    }

    componentWillReceiveProps(props) {
        const { paper, isLoadingPaper, params: { course, year, period } } = props;

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
        const { isLoadingPaper, paper, course } = this.props;

        if(!paper) 
            return <Empty/>;

        let content;
        const questions = paper.questions;
        
        if(questions) {
            if(questions.length) {
                content = <PaperView course={course} paper={paper} />;
            } else {
                content = (
                    <div className="paper-empty">
                        <Icon name="exclamation-triangle" size={5}/>
                        <h4>This paper has no questions yet.</h4> 
                        <p>Help your course out and <Link to={this.getParserLink() + "/questions"}>pick them from the paper</Link>.</p>
                    </div>
                );
            }

            return (
                <Box>
                    <div className="Paper">{ content }</div>
                    {/* <PaperInfo course={course} paper={paper} /> */}
                </Box>
            );
        } else return <Loading />;
    }

    getParserLink() {
        const { course, paper } = this.props;
        return `/course/${course.code}/paper/${paper.year_start}/${paper.period}/parse`;
    }
}

export default connect(Paper.selector, Paper.actions)(Paper);