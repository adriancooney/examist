import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import * as model from "../../model";
import { PaperGrid } from "../ui/paper";
import { Loading } from "../ui/";
import { Box, Flex } from "../ui/layout";

class Module extends Component {
    static selector = (state, { params }) => ({
        module: model.resources.Module.selectByCode(params.module)(state),
        paper: params.module && params.year && params.period ? model.resources.Paper.selectPaper(params.module, params.year, params.period)(state) : undefined,
        isLoadingModule: isPending(model.resources.Module.type)(state)
    });

    static actions = {
        getModule: model.resources.Module.getModule
    };

    componentWillMount() {
        if(!this.props.module)
            this.props.getModule(this.props.params.module)
    }

    render() {
        let module = this.props.module;

        if(this.props.isLoadingModule) {
            return <Loading />
        } else if(module) {
            return (
                <Flex className="Module">
                    <Box>
                        <Flex><h1><Link to={`/module/${module.code}`}>{ module.code.toString().toUpperCase() }</Link></h1></Flex>
                        <Flex><h3>{ module.name }</h3></Flex>
                    </Box>
                    
                    <PaperGrid papers={module.papers} module={module.code} currentPaper={this.props.paper}/>

                    { this.props.children }
                </Flex>
            );
        } else return (<div>Module not found.</div>);
    }
}

export default connect(Module.selector, Module.actions)(Module);