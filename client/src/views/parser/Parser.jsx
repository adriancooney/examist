import "../../../style/Parser.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import PaperView from "./PaperView"
import { FlexBox, Box } from "../ui/layout";
import { IconLink, Loading } from "../ui";
import { PaperLink } from "../ui/paper";
import * as model from "../../model";

class Parser extends Component {
    static selector = (state, { params }) => {
        const course = model.resources.Course.selectByCode(params.course)(state);

        return {
            course,
            paper: course ? model.resources.Paper.selectPaperWithQuestions({ 
                period: params.period,
                year: parseInt(params.year),
                course: course.id 
            })(state) : null
        }
    };

    static actions = {
        getPaper: model.resources.Paper.getPaper,
        push: model.Routing.push
    };

    componentWillMount() {
        const { paper, params: { course, year, period } } = this.props;

        if(!paper)
            this.props.getPaper(course, year, period);
    }

    render() {
        const { paper, course, children } = this.props;

        if(!paper) {
            return <Loading />;
        }

        const paperLink = `/course/${course.code}/paper/${paper.year_start}/${paper.period}/`;
        let currentPage = this.props.location.pathname.match(/\/(\w+)$/);
        currentPage = currentPage && currentPage[1] !== "parse" ? currentPage[1] : "info";

        return (
            <FlexBox className="Parser">
                <Box vertical className="Sidebar">
                    <IconLink to={paperLink} name="arrow-circle-o-left" size={2} />
                    <IconLink to={`${paperLink}parse/`} name="info-circle" size={2} active={currentPage === "info"} />
                    <IconLink to={`${paperLink}parse/questions`} name="list" size={2} active={currentPage === "questions"} />
                    <IconLink to={`${paperLink}parse/help`} name="question-circle" size={2} active={currentPage === "help"} />
                </Box>

                <div className="panel-container">
                    <header className="header">
                        <PaperLink course={course} paper={paper} />
                    </header>

                    { children }
                </div>

                <PaperView link={this.props.paper.link}/>
            </FlexBox>
        );
    }
}

export default connect(Parser.selector, Parser.actions)(Parser);