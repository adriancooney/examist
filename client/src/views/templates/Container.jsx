import "../../../style/Container.scss";
import React from "react";
import { connect } from "react-redux";
import * as model from "../../model";
import { selector } from "../../Util";
import Header from "./Header";
import Footer from "./Footer";
import { Box, FlexBox, Solid } from "../ui/layout";

function Container(props) {
    return (
        <Box className="Container" vertical>
            <Solid><Header user={props.user}/></Solid>
            <FlexBox>{props.children}</FlexBox>
            <Solid><Footer /></Solid>
        </Box>
    );
}

export default connect(selector({
    user: model.User.selectCurrent
}))(Container);