import React from "react";
import { Route, IndexRoute } from "react-router";
import { authorize } from "../../Middleware";
import App from "./App";
import CoursePicker from "./CoursePicker";
import Course from "./Course";
import Paper from "./Paper";
import Logout from "./Logout";
import Dashboard from "./Dashboard";
import Question from "./Question";

export default (
    <Route component={App} onEnter={authorize}>
        <IndexRoute component={Dashboard} />
        <Route path="logout" component={Logout} onEnter={Logout.onEnter} />
        <Route path="courses/pick" component={CoursePicker} />
        <Route path="course/:course" component={Course}>
            <Route path="paper/:year/:period/q/:path(/:view)" component={Question} />
            <Route path="paper/:year/:period" component={Paper} />
        </Route>
    </Route>
);