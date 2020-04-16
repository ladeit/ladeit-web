import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {
    withStyles,IconButton,Button,Paper,Typography,Grid,TextField
} from '@material-ui/core';

import Flow from '@/topology/flow/flow'
import FlowStrategyT from '@/topology/flow/flowStrategy.jsx'
import FlowMatchT from "../flow/flowMatch";
import FlowPodT from "../flow/flowPod";
import FlowHostT from "../flow/flowHost";

import Service from "@/projects/Service"

const styles = theme => ({
    box:{
        //background:'#f8f8f8'
    }
})


@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){}

    componentDidMount(){
        this.loadRoute()
    }

    loadRoute(){
        let sc = this;
        let serviceData = this.props.serviceData;
        let routeNode = this.props.routeNode;
        Service.serviceTopo(serviceData.id,function (result) {
            result.host || (result.host = []);
            result.route.push(routeNode);
            //
            sc.dg = Flow(result).zoom([200,100],.8);
            sc.dg.clickSelectNode = _.debounce(sc.clickSelectNode);
            sc.dg.clickAddNode = _.debounce(sc.clickAddNode);
            sc.dg.clickCreateLink = _.debounce(sc.clickCreateLink);
            sc.dg.clickSelectLink = _.debounce(sc.clickSelectLink);
        })
    }

    loadData(){
        const sc = this;
        setTimeout(function () {
            let data = {
                host:["dev.ladeit.io",'test.ladeit.io'],
                match:[
                    {
                        id:'default',
                        name:'default',
                        rule:[
                            {
                                name:'xx',
                                stringMatch:[
                                    {
                                        type:'method',
                                        expression:'=',
                                        value:'xxx'
                                    }
                                ]
                            }
                        ],
                        redirect:'xxx'
                    }
                ],
                route:[
                    {id:'1',host:'xxx',subset:'v0.3.1'},
                ],
                matchRouteMap:[{matchId:'default',routeId:'1',disabled:true,weight:8}]
            }

            sc.dg = Flow(data).zoom();
            sc.dg.clickSelectNode = _.debounce(sc.clickSelectNode);
            sc.dg.clickAddNode = _.debounce(sc.clickAddNode);
            sc.dg.clickCreateLink = _.debounce(sc.clickCreateLink);
            sc.dg.clickSelectLink = _.debounce(sc.clickSelectLink);
        },500)
    }

    state = {
        selNode:{},
        selLink:{source:{text:' 一 '}},
        selNodeLink:[],
        selNodeLinkWeight:0
    }

    clickAddNode = (nodeData)=>{
        this.refs.$addmatch.onOpen({
            data:{name:'',rule:[]}
        })
    }

    clickAddNode_save = ()=>{
        const sc = this;
        return (isOk)=>{
            if(isOk){
                sc.dg.getAddNode(isOk);
                sc.refs.$addmatch.onCancel();
            }else{
                sc.refs.$addmatch.onCancel();
            }
        }
    }

    clickSelectNode = (nodeData)=>{
        if(nodeData.type=="server"){
            this.state.selNode = nodeData;
            this.refs.$match.onOpen({
                data:nodeData.data,
                hasServerLink:this.dg.hasServerLink(nodeData),
                //hostRule:hostData.rule||[]
            })
        }else if(nodeData.type=="pod"){
            this.state.selNode = nodeData;
            this.refs.$pod.onOpen({
                data:nodeData.data
            })
        }else if(nodeData.type == "env"){
            this.state.selNode = nodeData;
            this.refs.$host.onOpen({
                tags:nodeData.data,
                data:{_value:nodeData.data.rule}
            })
        }
    }

    clickSelectNode_env_save = ()=>{
        const sc = this;
        return (isOk)=>{
            let selNode = sc.state.selNode;
            if(isOk){
                let result = isOk;
                if(result.tags.length<1){
                    window.Store.notice.add({text:'无host信息. ',type:'warning'})
                    return;
                }
                selNode.data = result.tags;
                selNode.text = result.tags[0]||'';
                sc.dg.activeNode(selNode);
                sc.refs.$host.onCancel();
            }else{
                sc.refs.$host.onCancel();
            }
        }
    }

    clickSelectNode_server_save = ()=>{
        const sc = this;
        return (isOk)=>{
            if(isOk){
                let selNode = sc.state.selNode;
                selNode.data = isOk;
                //
                sc.dg.activeNode({id:selNode.id})
                sc.refs.$match.onCancel();
            }else{
                sc.refs.$match.onCancel();
            }
        }
    }

    clickSelectNode_pod_save = ()=>{
        const sc = this;
        return (opr)=>{
            if(opr=='delete'){
                sc.dg.removeNode(sc.state.selNode);
                sc.refs.$pod.onCancel();
            }else if(typeof opr == "object"){
                sc.state.selNode.data.cos = opr.cos;
                sc.state.selNode.data.headers = opr.headers;
                sc.refs.$pod.onCancel();
            }else{
                sc.refs.$pod.onCancel();
            }
        }
    }

    clickCreateLink = (linkData)=>{
        let nodeData = linkData.source;
        let result = this.dg.getNodeLink(nodeData);
        this.state.selLink = linkData;
        this.state.selNodeLink = result;
        this.refs.$flow.onOpen({
            selLink:linkData,
            selNodeLink:result,
            selNodeLinkWeight:result.weight
        })
    }

    clickSelectLink = (linkData)=>{
        let nodeData = linkData.source;
        let result = this.dg.getNodeLink(nodeData);
        this.state.selLink = linkData;
        this.state.selNodeLink = result;
        this.refs.$flow.onOpen({
            selLink:linkData,
            selNodeLink:result,
            selNodeLinkWeight:result.weight
        })
    }

    clickCreateLink_save(){
        const sc = this;
        return (isOk)=>{
            let { selLink,selNodeLink } = sc.state;
            let nodeData = selLink.source;
            sc.refs.$flow.onCancel();
            if(isOk){
                selNodeLink.map(function(v){
                    v.weight = v.weight_text;
                    if(!v.weight){
                        //sc.dg.removeLink(v);
                        v.stroke = 'rgba(234, 233, 233,.8)';
                    }else{
                        v.stroke = '';
                    }
                })
                sc.dg.getNodeLink(nodeData);
                sc.dg.refreshLink();
                //
                sc.dg.activeNode(nodeData);
            }else{
                if(selLink.weight==0){
                    // sc.dg.removeLink(selLink)
                    selLink.stroke = 'rgba(234, 233, 233,.8)';
                    sc.dg.activeLink(selLink)
                }
            }
        }
    }

    clickRemoveNode = ()=>{
        this.dg.clickRemoveNode();
    }

    render(){
        const {classes} = this.props;
        return (
            <div className={classes.box}>
                <div style={{width:'100%',height:'360px',position:'relative'}}>
                    <svg className="flow-strategy" xmlns="http://www.w3.org/2000/svg" >
                        <defs joint-selector="defs"><filter id="dropShadow" filterUnits="objectBoundingBox" x="-1" y="-1" width="3" height="3"><feDropShadow stdDeviation="2" dx="0" dy="2" flood-color="#000" flood-opacity="0.05"></feDropShadow></filter></defs>
                    </svg>
                    <div id="node_info"><IconButton color="primary" size="small" onClick={this.clickRemoveNode} className="svg_close"><CloseIcon className="icon"/></IconButton></div>
                </div>
                <FlowStrategyT ref="$flow" onOk={this.clickCreateLink_save()} />
                <FlowMatchT ref="$match" onOk={this.clickSelectNode_server_save()} />
                <FlowMatchT ref="$addmatch" onOk={this.clickAddNode_save()} />
                <FlowPodT ref="$pod" onOk={this.clickSelectNode_pod_save()} />
                <FlowHostT ref="$host" onOk={this.clickSelectNode_env_save()}/>
            </div>
        )
    }
}

export default Index;