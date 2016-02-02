import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import { PaperGrid } from "../ui/paper";
import { Loading } from "../ui/";
import { Box, Flex } from "../ui/layout";

class Module extends Component {
    static selectors = (state, { params }) => ({
        module: selectors.Module.byId(params.module)(state),
        paper: params.module && params.year && params.period ? 
            selectors.Paper.getPaper(params.module, params.year, params.period)(state) : undefined,
        isLoadingModule: isPending(actions.Module.types.MODULE)(state)
    });

    static actions = {
        // getModule: actions.Module.getModule
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

export default connect(Module.selectors, Module.actions)(Module);