import "../../../style/Template.scss";
import React, { Children } from "react";
import { connect } from "react-redux";
import * as model from "../../model";
import { Link } from "react-router";
import * as Config from "../../Config";
import { Box, Flex } from "../ui/layout";

export default function Header(props) {
    let nav = [];

    if(props.user) {
        // Display user welcome message
        let name = props.user.name.split(" ")[0];
        name = name[0].toUpperCase() + name.substr(1);

        nav.push(
            <li>Hi {name}</li>,
            "Dashboard",
            "About",
            "Logout"
        );
    } else {
        nav.push(
            "Home", 
            "Signup",
            "Login"
        );
    }

    nav = nav.map(item => {
        if(typeof item === "string") {
            let link = `/${item.toLowerCase()}`;

            if(item === "Home") link = "/";

            return <li><Link to={link}>{item}</Link></li>;
        } else return item;
    });

    return (
        <header className="Header">
            <Box>
                <h1 className="Logo"><Link to="/">{ Config.APP_NAME }</Link></h1>
                <Flex>
                    <nav>{ Children.toArray(nav) }</nav>
                </Flex>
            </Box>
        </header>
    );
}

export default connect(state => ({
    user: model.User.selectCurrent(state)
}))(Header);