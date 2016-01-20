import React from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import * as views from "./views";

render((
    <Router history={browserHistory}>
        <Route path="/module/:module/paper/:year/:period/parse" component={views.parser.Parser} />
        <Route path="/" component={views.Container}>
            <Route path="login" component={views.Login}/>
            <Route path="signup" component={views.Signup} />
            <Route component={views.app.App} /* onEnter={requireAuth} */>
                <IndexRoute component={views.app.Dashboard} />
                <Route path="modules" component={views.app.modules.Modules} />
                <Route path="module/:module" component={views.app.modules.Module}>
                    <Route path="paper/:year/:period" component={views.app.Paper} />
                    {/* Render the question. If we're not linking directly to a 
                        link or solution, just render the question comments. */}
                    <Route path="paper/:year/:period/question/:id" component={views.app.Question}>
                        <IndexRoute component={views.app.Comments} />

                        <Route path="solutions" component={views.app.SolutionList} />
                        <Route path="solution/:id" component={views.app.Solution}>
                            <Route path="comments" component={views.app.Comments}/>
                        </Route>

                        <Route path="links" component={views.app.LinkList} />
                        <Route path="link/:id" component={views.app.Link}>
                            <Route path="comments" component={views.app.Comments}/>
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Route>
    </Router>
), document.querySelector(".app"));
