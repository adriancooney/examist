import "../../../style/Template.scss";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import * as selectors from "../../selectors";
import * as Config from "../../Config";
import { Box, Flex } from "../ui/layout";

function Header(props) {
    let user, action;

    if(props.user) 
        user = (<li>Hi {props.user.name}</li>)

    action = props.user ?
        (<li><Link to="/logout">Logout</Link></li>) :
        ([
            <li><Link to="/signup">Signup</Link></li>,
            <li><Link to="/login">Login</Link></li>
        ]);


    return (
        <header className="Header">
            <Box>
                <Flex>
                    <h1><Link to="/">{ Config.APP_NAME }</Link></h1>
                </Flex>
                <Flex>
                    <nav>
                        { user }
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        { action }
                    </nav>
                </Flex>
            </Box>
        </header>
    );
}

export default connect(state => ({
    user: selectors.User.current(state)
}))(Header)