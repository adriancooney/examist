import "../../../style/Parser.scss";
import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { InfoPanel, QuestionsPanel, HelpPanel } from "./panels";
import PaperView from "./PaperView"
import { FlexBox, Box } from "../ui/layout";
import { Icon, Loading } from "../ui";
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
            })(state) : null,
            view: model.views.Parser.selectView(state)
        }
    };

    static actions = {
        switchView: model.views.Parser.switchView,
        getPaper: model.resources.Paper.getPaper,
        push: model.Routing.push
    };

    componentWillMount() {
        const { paper, params: { course, year, period } } = this.props;

        if(!paper)
            this.props.getPaper(course, year, period);
    }

    render() {
        const views = model.views.Parser.views;
        const currentView = this.props.view;
        if(!this.props.paper) {
            return <Loading />;
        }

        let panel, header;
        const { paper, course } = this.props;

        if(currentView === views.help) {
            panel = <HelpPanel />;
        } else {
            header = (
                <header className="header">
                    <PaperLink course={course} paper={paper} />
                </header>
            );

            if(currentView === views.info) {
                panel = <InfoPanel />;
            } else if(currentView === views.questions) {
                panel = <QuestionsPanel />;
            }
        }

        return (
            <FlexBox className="Parser">
                <Box vertical className="Sidebar">
                    <Link to={`/course/${course.code}/paper/${paper.year_start}/${paper.period}/`}>
                        <Icon name="arrow-circle-o-left" size={2} />
                    </Link>
                    <Icon name="info-circle" size={2} onClick={this.switchView.bind(this, views.info)} active={currentView === views.info} />
                    <Icon name="list" size={2} onClick={this.switchView.bind(this, views.questions)} active={currentView === views.questions} />
                    <Icon name="question-circle" size={2} onClick={this.switchView.bind(this, views.help)} active={currentView === views.help} />
                </Box>

                <div className="panel-container">
                    { header }
                    { panel }
                </div>

                <PaperView link={this.props.paper.link}/>
            </FlexBox>
        );
    }

    switchView(view) {
        this.props.switchView(view);
    }
}

export default connect(Parser.selector, Parser.actions)(Parser);