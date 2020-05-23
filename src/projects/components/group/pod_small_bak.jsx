import React from "react";
import clsx from "clsx";
import {ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon} from "@material-ui/icons";
import AuthFilter from '@/AuthFilter.jsx'
import intl from "react-intl-universal";
import _ from "lodash";
import {
    withStyles,Button,Paper,Typography,Grid,IconButton,Tooltip,Divider
} from '@material-ui/core';
import CreatePipe from "./pod_pipe";
import Service from "../../Service";
//
const styles = theme => ({
    pipeChart_left:{
    },
    pipeChart_right:{
        '& .MuiButton-root':{
            width:'20px'
        },
    },
    operation:{
        '& .icon':{
            fontSize:'1.5rem'
        }
    }
})

@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount() {
        const { service } = this.props;
        const auth = this.getServiceAuth(service);
        this.id = `pipe_${((1 + Math.random()) * 0x10000000 | 0).toString(16)}`;
        this.state.service = service;
        this.state.pod = service.podStatus || {SUM:0};
        this.state.pod._pod = this.state.pod.SUM;
        this.state.authX = auth("X");
    }

    componentDidMount(){
        this.renderPipe = renderPipeChart.call(this,this.state.pod);
        this.renderPipe();
    }

    loadPipeChart(serviceData){
        const sc = this;
        const id = serviceData.id;
        if(serviceData.status == -1){
            let pod = _.extend(sc.state.pod,{SUM:0});
            pod._pod = pod.SUM;
            sc.renderPipe = renderPipeChart.call(sc,pod);
            sc.renderPipe();
            sc.forceUpdate();
        }else{
            Service.serviceInfoScale(id,function(res) {
                let pod = _.extend(sc.state.pod,res);
                pod._pod = pod.SUM;
                sc.renderPipe = renderPipeChart.call(sc,pod);
                sc.renderPipe();
            })
        }
    }

    state = {
        service:{},
        authX:false,
    }

    handlePipeChart = (num)=>{
        let sc = this;
        let size = sc.state.pod._pod + num;
        if(size>-1){
            sc.state.pod._pod = size;
            sc.renderPipeChart = renderPipeChart.call(sc,sc.state.pod);
            sc.renderPipeChart(true);
        }
    }
    handlePipeChart_save = (value)=>{
        const sc = this;
        let pod = sc.state.pod;
        let service = sc.state.service;
        Service.serviceInfoScaleUpdate({serviceId:service.id,count:value},function(res){
            sc.loadPipeChart(service);
        })
    }
    handlePipeChart_cancel = ()=>{
        const sc = this;
        let pod = sc.state.pod;
        pod._pod = pod.SUM;
        sc.renderPipeChart = renderPipeChart.call(sc,pod);
        sc.renderPipeChart();
    }
    // on
    onEdit = () => {}
    // render
    renderScaleButton(){
        const { classes } = this.props;
        const { authX } = this.state;
        if(authX){
            return (
                <div className={`flex-c ${classes.operation}`}>
                    <div className="flex-box">
                        <Tooltip title="Scale Up" placement="right">
                            <IconButton size="small" onClick={()=>{this.handlePipeChart(+1)}} ><ExpandLessIcon className="icon"/></IconButton>
                        </Tooltip>
                    </div>
                    <div className="flex-box">
                        <Tooltip title="Scale Down" placement="right">
                            <IconButton size="small" onClick={()=>{this.handlePipeChart(-1)}}><ExpandMoreIcon className="icon"/></IconButton>
                        </Tooltip>
                    </div>
                </div>
            )
        }else{
            return (
                <div className={`flex-c ${classes.operation}`}>
                    <div className="flex-box">
                        <Tooltip title={intl.get('tipsNoAuthority')} placement="right">
                            <IconButton size="small" style={{opacity:.4}} ><ExpandLessIcon className="icon"/></IconButton>
                        </Tooltip>
                    </div>
                    <div className="flex-box">
                        <Tooltip title={intl.get('tipsNoAuthority')} placement="right">
                            <IconButton size="small" style={{opacity:.4}} ><ExpandMoreIcon className="icon"/></IconButton>
                        </Tooltip>
                    </div>
                </div>
            )
        }
    }
    render(){
        const { classes,className,service,...props } = this.props;
        return (
            <div className={clsx('flex-r','flex-center',className)} {...props}>
                <div className={clsx('flex-box',classes.pipeChart_left)}><div id={this.id}></div></div>
                <div className={clsx('flex-one',classes.pipeChart_right)}>{this.renderScaleButton()}</div>
            </div>
        )
    }
}

export default Index;


function renderPipeChart(data){
    data._pod || (data._pod = 0);
    let view = this;
    let editHtml = `<div class="g2-guide-html">
        <p class="g2_title">pod</p>
        <div class="g2_value">
            <input type="number" value="${data._pod}" class="input"/>
            <div>
                <button class="cancel MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-outlinedSizeSmall MuiButton-sizeSmall fl" tabindex="0" type="button">`+ intl.get('cancel') +`</button>
                <button class="ok MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-outlinedSizeSmall fr" tabindex="0" type="button">`+ intl.get('confirm') +`</button>
            </div>
        </div>
    </div>`
    let showHtml = `<div class="g2-guide-html">
        <p class="g2_title">pod</p>
        <p class="g2_value">${data._pod}</p>
    </div>`
    //
    let pipeChart = document.getElementById(view.id);
    if(pipeChart){
        pipeChart.onclick = function(e){
            let el = e.target;
            if(el.className.indexOf('cancel')>-1){
                view.handlePipeChart_cancel();
            }else if(el.className.indexOf('ok')>-1){
                let input = pipeChart.querySelector('.input');
                view.handlePipeChart_save(input.value - 0);
            }
        }
        pipeChart.onkeydown = _.debounce(function(e){ // 验证：不能小于0
            let el = e.target;
            if(el.tagName=="INPUT"){
                let val = el.value - 0;
                if(val<0){
                    el.value = 0;
                }
            }
        },500)
    }
    //
    return function(isEdit){
        let html = showHtml;// _.template
        if(isEdit!=void 0){
            html = editHtml;
        }
        try{
            CreatePipe(view.id,view.state.pod,html,{height:80,legend:false});
        }catch (e) {
            console.error('heatmapChart faild')
        }
    }
}