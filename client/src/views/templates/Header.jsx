import "../../../style/Template.scss";
import React from "react";
import { Link } from "react-router";
import * as Config from "../Config";
import { Box, Flex } from "../ui/layout";

export default function Header() {
    return (
        <header className="Header">
            <Box>
                <Flex>
                    <h1><Link to="/">{ Config.APP_NAME }</Link></h1>
                </Flex>
                <Flex>
                    <nav>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/login">Login</Link></li>                   
                    </nav>
                </Flex>
            </Box>
        </header>
    );
}