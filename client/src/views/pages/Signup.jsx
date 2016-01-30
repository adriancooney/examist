import React, { Component } from "react";
import { Institution } from "../ui";
import { Flex, FlexBox } from "../ui/layout";
import { Form, Input } from "../ui/input";
import { content } from "../../i18n";

export default class Signup extends Component {
    render() {
        return (
            <FlexBox className="Signup">
                <Flex>
                    <p>{ content("signup.institution_address") }</p>
                    <p>{ content("signup.young") }</p>
                </Flex>
                <Flex>
                    <Form onSubmit={::this.onSubmit}>
                        <Input name="name" label="Name" placeholder="e.g. John Smith"/>
                        <Input name="email" label="Institution Email" placeholder="e.g. john.smith@nuigalway.ie"/>
                        <Input name="password" label="Password" />
                    </Form>
                </Flex>
                <Flex>
                    <Institution />
                </Flex>
            </FlexBox>
        );
    }

    onSubmit() {

    }
}