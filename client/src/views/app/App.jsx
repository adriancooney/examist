import React, { Component } from "react";
import { Route, IndexRoute } from "react-router";

import * as modules from "./modules";
import Dashboard from "./Dashboard";
import Paper from "./Paper";
import Question from "./Question";
import Comments from "./Comments";
import Solution from "./Solution";
import SolutionList from "./SolutionList";
import Link from "./Link";
import LinkList from "./LinkList";

export class App extends Component {
    render() {
        return (<div className="App">
            <h1>Main App</h1>
            { this.props.children }
        </div>);
    }
}

export default (
    <Route component={App} /* onEnter={requireAuth} */>
        <IndexRoute component={Dashboard} />
        <Route path="modules" component={modules.Modules} />
        <Route path="module/:module" component={modules.Module}>
            <Route path="paper/:year/:period" component={Paper} />
            {/* Render the question. If we're not linking directly to a 
                link or solution, just render the question comments. */}
            <Route path="paper/:year/:period/question/:id" component={Question}>
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