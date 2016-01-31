import "../../../style/pages/Signup.scss";
import React, { Component } from "react";
import { Institution } from "../ui";
import { Flex, Box } from "../ui/layout";
import { Form, Input } from "../ui/input";
import { content } from "../../i18n";

export default class Signup extends Component {
    render() {
        return (
            <Box className="Signup">
                <Flex>
                    <p>{ content("signup.institution_address") }</p>
                    <p>{ content("signup.young") }</p>
                </Flex>
                <Flex grow={2.5}>
                    <Form onSubmit={::this.onSubmit}>
                        <Input name="name" label="Name" placeholder="e.g. John Smith"/>
                        <Input name="email" label="Institution Email" placeholder="e.g. john.smith@nuigalway.ie"/>
                        <Input name="password" label="Password" />
                    </Form>
                </Flex>
                <Flex className="institution-view">
                    <Institution />
                </Flex>
            </Box>
        );
    }

    onSubmit() {

    }
}