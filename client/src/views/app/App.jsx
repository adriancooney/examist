import "../../../style/app/App.scss";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, IndexRoute } from "react-router";

import * as selectors from "../../selectors";
import { authorize } from "../../Middleware";
import * as module from "./module";
import * as paper from "./paper";
import * as question from "./question";
import { FlexBox } from "../ui/layout";
import ErrorPage from "../ui/error/ErrorPage";
import Logout from "./Logout";
import Dashboard from "./Dashboard";
import Comments from "./Comments";
import Solution from "./Solution";
import SolutionList from "./SolutionList";
import Link from "./Link";
import LinkList from "./LinkList";

export class App extends Component {
    render() {
        let content = this.props.error ?
            <ErrorPage error={this.props.error} /> :
            this.props.children;

        return (
            <FlexBox className="App">
                { content }
            </FlexBox>
        );
    }
}

App = connect(state => ({
    error: selectors.Error.getError(state)
}))(App);

export default (
    <Route component={App} onEnter={authorize}>
        <IndexRoute component={Dashboard} />
        <Route path="logout" component={Logout} onEnter={Logout.onEnter} />
        <Route path="modules" component={module.ModuleList} />
        <Route path="module/:module" component={module.Module}>
            <Route path="paper/:year/:period" component={paper.Paper} />
            {/* Render the question. If we're not linking directly to a 
                link or solution, just render the question comments. */}
            <Route path="paper/:year/:period/question/:path" component={question.Question}>
                <IndexRoute component={Comments} />

                <Route path="solutions" component={SolutionList} />
                <Route path="solution/:id" component={Solution}>
                    <Route path="comments" component={Comments}/>
                </Route>

                <Route path="links" component={LinkList} />
                <Route path="link/:id" component={Link}>
                    <Route path="comments" component={Comments}/>
                </Route>
            </Route>
        </Route>
    </Route>
);