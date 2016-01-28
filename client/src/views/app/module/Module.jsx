import React, { Component } from "react";
import { connect } from "react-redux";
import { isPending } from "redux-pending";
import * as actions from "../../../actions";
import * as selectors from "../../../selectors";
import { Box, Flex } from "../../ui/layout";
import { Loading } from "../../ui/";
import PaperGrid from "./PaperGrid";

class Module extends Component {
    static selectors = (state, { params }) => ({
        module: selectors.Module.byId(params.module)(state),
        paper: params.module && params.year && params.period ? 
            selectors.Paper.getPaper(params.module, params.year, params.period)(state) : undefined,
        isLoadingModule: isPending(actions.Module.types.MODULE)(state)
    });

    static actions = {
        getModule: actions.Module.getModule
    };

    componentWillMount() {
        if(!this.props.module)
            this.props.getModule(this.props.params.module)
    }

    render() {
        let mod = this.props.module;

        if(this.props.isLoadingModule) {
            return <Loading />
        } else if(mod) {
            return (
                <Flex className="Module">
                    <Box>
                        <Flex><h1>{ mod.code.toString().toUpperCase() }</h1></Flex>
                        <Flex><h3>{ mod.name }</h3></Flex>
                    </Box>
                    
                    <PaperGrid papers={mod.papers} module={mod.code} currentPaper={this.props.paper}/>

                    { this.props.children }
                </Flex>
            );
        } else return (<div>Module not found.</div>);
    }
}

export default connect(Module.selectors, Module.actions)(Module);