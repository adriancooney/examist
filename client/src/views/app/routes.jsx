import React from "react";
import { Route, IndexRoute } from "react-router";
import { authorize } from "../../Middleware";
import App from "./App";
import CoursePicker from "./CoursePicker";
import Course from "./Course";
import Paper from "./Paper";
import Logout from "./Logout";
import Dashboard from "./Dashboard";

export default (
    <Route component={App} onEnter={authorize}>
        <IndexRoute component={Dashboard} />
        <Route path="logout" component={Logout} onEnter={Logout.onEnter} />
        <Route path="courses/pick" component={CoursePicker} />
        <Route path="course/:course" component={Course}>
            <Route path="paper/:year/:period" component={Paper} />
            {/* Render the question. If we're not linking directly to a 
                link or solution, just render the question comments. 
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
            </Route> */}
        </Route>
    </Route>
);