import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {inject,observer} from 'mobx-react';
import { Prompt } from 'react-router-dom';
import {
    withStyles,IconButton,Button,Paper,Typography,Grid,TextField,Divider
} from '@material-ui/core';

import Icons from '@/components/Icons/icons.jsx'
import Flow from '@/topology/flow/flow'
import FlowStrategyT from '@/topology/flow/flowStrategy.jsx'
import FlowMatchT from "../flow/flowMatch";
import FlowPodT from "../flow/flowPod";
import FlowHostT from "../flow/flowHost";
import Service from "@/projects/Service"
import moment from 'moment'

const styles = theme => ({
    box:{
        height:'100%',
        minHeight:'500px',
        background: '#f8f8f8',
        position:'relative'
        // margin:'-16px -24px',
        // paddingBottom: '30px',
        // boxSizing: 'content-box',
    }
})
let hostData = [];

@withStyles(styles)
@inject("store")
@observer
class Index extends React.PureComponent{
    componentWillMount(){
        const { store } = this.props;
        store.project.updateTopoOpt({isChange:false})
    }

    componentDidMount(){
        this.loadRoute();
        //this.loadData();
    }

    loadRoute(){
        let sc = this;
        let topoData = this.props.topoData;
        sc.dg = Flow(topoData).zoom([200,220],.85);
        sc.dg.clickSelectNode = _.debounce(sc.clickSelectNode);
        sc.dg.clickAddNode = _.debounce(sc.clickAddNode);
        sc.dg.clickCreateLink = _.debounce(sc.clickCreateLink);
        sc.dg.clickSelectLink = _.debounce(sc.clickSelectLink);
    }

    loadData(){
        const sc = this;
        setTimeout(function () {
            let data = {
                "host":[
                    "prod.example.com"
                ],
                "match":[
                    {
                        "id":"4e09e652-52cd-4565-b2c4-cec51a2694e2",
                        "rule":[

                        ],
                        "name":"name",
                        "redirect":null,
                        "rewrite":null,
                        "retries":null,
                        "timeout":null,
                        "headers":null,
                        "corsPolicy":null,
                        "fault":null,
                        "nameWeight":[
                            {
                                "4916":0
                            },
                            {
                                "4938":100
                            }
                        ]
                    }
                ],
                "route":[
                    {
                        "id":"865547b6-0773-408c-bd0d-c42b1411c371",
                        "host":"cnbl-trex-web",
                        "subset":"4916",
                        "labels":{
                            "version":"4916"
                        }
                    },
                    {
                        "id":"6b29038f-fcdf-4bb2-ae9e-9d0e164b80b1",
                        "host":"cnbl-trex-web",
                        "subset":"4934",
                        "labels":{
                            "version":"4934"
                        }
                    },
                    {
                        "id":"88b4ff8e-e4b4-4800-abc9-d894f6050180",
                        "host":"cnbl-trex-web",
                        "subset":"4938",
                        "labels":{
                            "version":"4938"
                        }
                    }
                ],
                "map":[
                    {
                        "matchId":"4e09e652-52cd-4565-b2c4-cec51a2694e2",
                        "routeId":"865547b6-0773-408c-bd0d-c42b1411c371",
                        "subset":"4916",
                        "weight":0
                    },
                    {
                        "matchId":"4e09e652-52cd-4565-b2c4-cec51a2694e2",
                        "routeId":"88b4ff8e-e4b4-4800-abc9-d894f6050180",
                        "subset":"4938",
                        "weight":100
                    }
                ]
            }
            hostData = data.host;
            sc.dg = Flow(data).zoom([200,220]);
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
        });
    }

    clickAddNode_save = ()=>{
        const sc = this;
        const { store } = this.props;
        return (isOk)=>{
            if(isOk){
                sc.dg.getAddNode(isOk);
                sc.refs.$addmatch.onCancel();
            }else{
                sc.refs.$addmatch.onCancel();
            }
            store.project.updateTopoOpt({isChange: true})
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
        const { store } = this.props;
        return (isOk)=>{
            let selNode = sc.state.selNode;
            if(isOk){
                let result = isOk;
                // if(result.data._value.length<1){
                //     window.Store.notice.add({text:'无匹配规则. ',type:'warning'})
                //     return;
                // }
                if(result.tags.length<1){
                    window.Store.notice.add({text:'无host信息. ',type:'warning'})
                    return;
                }
                hostData = result.tags;
                selNode.data = hostData;
                selNode.text = hostData[0]||'';
                sc.dg.activeNode(selNode);
                sc.refs.$host.onCancel();
                store.project.updateTopoOpt({isChange: true})
            }else{
                sc.refs.$host.onCancel();
            }
        }
    }

    clickSelectNode_server_save = ()=>{
        const sc = this;
        const { store } = this.props;
        return (isOk)=>{
            if(isOk){
                let selNode = sc.state.selNode;
                selNode.data = isOk;
                //
                sc.dg.activeNode({id:selNode.id})
                sc.refs.$match.onCancel();
                store.project.updateTopoOpt({isChange: true})
            }else{
                sc.refs.$match.onCancel();
            }
        }
    }

    clickSelectNode_pod_save = ()=>{
        const sc = this;
        const { store } = this.props;
        return (opr)=>{
            if(opr=='delete'){
                sc.dg.removeNode(sc.state.selNode);
                sc.refs.$pod.onCancel();
                store.project.updateTopoOpt({isChange: true})
            }else if(typeof opr == "object"){
                sc.state.selNode.data.cos = opr.cos;
                sc.state.selNode.data.headers = opr.headers;
                sc.refs.$pod.onCancel();
                store.project.updateTopoOpt({isChange: true})
            }else{
                sc.refs.$pod.onCancel();
            }
        }
    }

    clickCreateLink = (linkData)=>{
        let nodeData = linkData.source;
        if(nodeData.data.redirect){ //  HTTP route cannot contain both route and redirect
            this.dg.removeLink(linkData);
            window.Store.notice.add({text:"redirect 已被设置，不能连线. ",type:"warning"});// TODO 节点视图 右耳朵样式不对
            return;
        }
        //
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
        const { store } = this.props;
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
                store.project.updateTopoOpt({isChange: true})
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
        const { classes,store,mask } = this.props;
        const options = store.project.topoOpt;
        const events = options.event;
        return (
            <div className={classes.box} >
                <div style={{width:'100%',height:'100%',position:'absolute'}}>
                    <svg className="flow-strategy" xmlns="http://www.w3.org/2000/svg" >
                        <defs joint-selector="defs"><filter id="dropShadow" filterUnits="objectBoundingBox" x="-1" y="-1" width="3" height="3"><feDropShadow stdDeviation="2" dx="0" dy="2" floodColor="#000" floodOpacity="0.05"></feDropShadow></filter></defs>
                    </svg>
                    <div id="node_info"><IconButton color="primary" size="small" onClick={this.clickRemoveNode} className="svg_close"><CloseIcon className="icon"/></IconButton></div>
                </div>
                <div className="mask_topo" style={{display:mask?'inline-block':'none'}}>
                    <div style={{minWidth:'287px',display:'inline-block',paddingTop:'16px'}}>
                    {
                        events.map(function (one,i) {
                            return (
                                <>
                                    {i!==0 && <Divider light={true}/>}
                                    <div className="service_event_item" key={i} style={{paddingLeft:'8px',textAlign:'right'}}>
                                        <div>{moment(one.time).format("YYYY/MM/DD HH:mm:ss")} &nbsp;&nbsp;类型 : {one.type}</div>
                                        <div>{one.kind}/{one.name}</div>
                                    </div>
                                </>
                            )
                        })
                    }
                    <Icons.Loading style={{position:"absolute",right:'50px'}}/>
                    </div>
                </div>
                <FlowStrategyT ref="$flow" onOk={this.clickCreateLink_save()} />
                <FlowMatchT ref="$match" onOk={this.clickSelectNode_server_save()} />
                <FlowMatchT ref="$addmatch" onOk={this.clickAddNode_save()} />
                <FlowPodT ref="$pod" onOk={this.clickSelectNode_pod_save()} />
                <FlowHostT ref="$host" onOk={this.clickSelectNode_env_save()}/>
                { !options.isChange || <Prompt message="拓扑信息未保存, 确定要离开？"  when={true}/> }
            </div>
        )
    }
}

export default Index;


