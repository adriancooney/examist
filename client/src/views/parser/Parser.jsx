import "../../../style/Parser.scss";
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import PDFView from "./PDFView"
import { FlexBox, Box } from "../ui/layout";
import { IconLink, Loading } from "../ui";
import { PaperLink } from "../ui/paper";
import Error404 from "../pages/Error404";
import * as model from "../../model";

class Parser extends Component {
    static selector = (state, { params }) => {
        const course = model.resources.Course.selectByCode(params.course)(state);
  
        const selection = { 
            course,
            isLoadingPaper: isPending(model.resources.Paper.getPaper.type)(state)
        };

        if(course) {
            selection.paper = model.resources.Paper.selectPaper({ 
                period: params.period,
                year: parseInt(params.year),
                course: course.id 
            })(state);
        } 

        return selection;
    };

    static actions = {
        getPaper: model.resources.Paper.getPaper,
        push: model.Routing.push
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
        const { paper, params: { course, year, period } } = this.props;

        if(!paper)
            this.props.getPaper(course, year, period);
    }

    render() {
        const { paper, course, children, isLoadingPaper } = this.props;

        if(isLoadingPaper) {
            return <Loading />;
        } else if(!paper) {
            return <Error404 />;
        }

        const paperLink = `/course/${course.code}/paper/${paper.year_start}/${paper.period}/`;
        let currentPage = this.props.location.pathname.match(/\/(\w+)$/);
        currentPage = currentPage && currentPage[1] !== "parse" ? currentPage[1] : "info";

        return (
            <FlexBox className="Parser">
                <Box vertical className="Sidebar">
                    <IconLink title="Back to paper" to={paperLink} name="arrow-circle-o-left" size={2} />
                    <IconLink title="Paper information" to={`${paperLink}parse/`} name="info-circle" size={2} active={currentPage === "info"} />
                    <IconLink title="Paper questions" to={`${paperLink}parse/questions`} name="list" size={2} active={currentPage === "questions"} />
                    <IconLink title="Help" to={`${paperLink}parse/help`} name="question-circle" size={2} active={currentPage === "help"} />
                </Box>

                <Box vertical className="panel-container">
                    <header className="header">
                        <PaperLink course={course} paper={paper} />
                    </header>

                    { children }
                </Box>

                <PDFView link={this.props.paper.link}/>
            </FlexBox>
        );
    }
}

export default connect(Parser.selector, Parser.actions)(Parser);