import "../../../style/Template.scss";
import React from "react";
import { Link } from "react-router";
import * as Config from "../../Config";
import { Box, Flex } from "../ui/layout";

export default function Header(props) {
    let user, action;

    if(props.user) {
        let name = props.user.name.split(" ")[0];
        name = name[0].toUpperCase() + name.substr(1);

        user = (<li key={1}>Hi {name}</li>)
    }

    action = props.user ?
        (<li><Link to="/logout">Logout</Link></li>) :
        ([
            <li key={1}><Link to="/signup">Signup</Link></li>,
            <li key={2}><Link to="/login">Login</Link></li>
        ]);

    return (
        <header className="Header">
            <Box>
                <h1><Link to="/">{ Config.APP_NAME }</Link></h1>
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