import React from "react";
import { Route, IndexRoute } from "react-router";
import { authorize } from "../../Middleware";
import Parser from "./Parser";
import { InfoPanel, HelpPanel, QuestionsPanel } from "./panels";

export default (
    <Route path="/course/:course/paper/:year/:period/parse" component={Parser} onEnter={authorize}>
        <IndexRoute component={InfoPanel} />
        <Route path="help" component={HelpPanel} />
        <Route path="questions" component={QuestionsPanel} />
    </Route>
);