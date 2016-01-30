import React, { Component } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import * as actions from "../../actions";
import * as selectors from "../../selectors";
import { Loading, Empty } from "../ui";
import { QuestionList } from "../ui/question";
import { PaperFooter } from "../ui/paper";

class Paper extends Component {
    static selectors = (state, props) => {
        const paper = selectors.Paper.getPaper(
            props.params.module,
            props.params.year,
            props.params.period
        )(state);

        return {
            paper, questions: paper ? selectors.Paper.getQuestions(paper.id)(state) : null,

            // Loading states
            isLoadingPaper: isPending(actions.Paper.types.PAPER)(state)
        }
    };

    static actions = {
        getPaper: actions.Paper.getPaper
    };

    componentWillMount() {
        const { paper, params: { module, year, period } } = this.props;

        // When we directly link to the paper
        if(!paper)
            this.props.getPaper(module, year, period);
    }

    componentWillReceiveProps(props) {
        const { paper, isLoadingPaper, params: { module, year, period } } = props;

        // When we switch the paper from within the paper route, the componentDidMount
        // doesn't trigger so it doesn't know to load another paper. Here we load the
        // paper if the parameters change.
        // 
        // We have to check if it's not also currently loading a paper because when we
        // dispatch the promise, our props get updated to tell us the paper is loading
        // and paper will be null. If we didn't check if it was loading, the dispatch
        // would be triggered twice.
        if(!paper && !isLoadingPaper)
            this.props.getPaper(module, year, period);
    }

    render() {
        const { isLoadingPaper, paper, questions } = this.props;

        if(isLoadingPaper) {
            return <Loading />
        }

        if(!paper) {
            return <Empty/>
        }

        let content = <Empty/>;

        if(questions && questions.length) {
            content = <QuestionList questions={this.props.questions} />
        }

        return (
            <div className="Paper">
                <h3>Questions</h3>
                { content }
                <PaperFooter paper={this.props.paper} />
            </div>
        );
    }
}

export default connect(Paper.selectors, Paper.actions)(Paper);