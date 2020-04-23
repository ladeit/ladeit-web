import React from 'react';
import ReactDOM from 'react-dom';
import {
    withStyles, Paper, Input, Button, Checkbox, FormControlLabel,LinearProgress
} from '@material-ui/core';
import clsx from "clsx";
import Service from '../Service'
import intl from 'react-intl-universal'

const style = theme => ({
    row:{
        width:'680px',
        margin:'16px auto',
        padding:'16px',
        paddingRight:'32px',
        fontSize:'1rem',
        '& .title':{
            padding:'8px',
            fontWeight:'600'
        },
        "& label":{
            width:'120px',
            padding:'8px',
            lineHeight:'30px',
            textAlign:'right'
        },
        "& .input_box":{
            padding:'8px'
        }
    },
    mask:{
        width:'100%',
        height:'100%',
        backgroundColor:'rgba(0,0,0,.4)',
        position:'fixed',
        top:0,
        left:0,
        zIndex:'2000',
        '& .progress':{
            width: "80%",
            height: "100%",
            transform: "translateY(80%)",
            margin: "0 auto"
        },
        '& .text':{
            color: 'white',
            fontSize: "1.1rem",
            textAlign: "right",
            marginBottom: "8px"
        }
    }
})

@withStyles(style)
class Index extends React.PureComponent {

    loadStart(){
        const sc = this;
        let {mysqlForm,redisForm} = sc.state;
        Service.dataTransferMap(function (res) {
            let mysqlAO = res.mysqlInfoAO || {};
            let redisAO = res.redisInfoAO || {};
            mysqlAO.type = mysqlAO.type - 0;
            redisAO.type = redisAO.type - 0;
            sc.state.mysqlData = mysqlAO;
            sc.state.redisData = redisAO;
            mysqlForm.map(function (v) {
                v.value = mysqlAO[v.label];
            })
            redisForm.map(function (v) {
                v.value = redisAO[v.label];
            })
            sc.forceUpdate();
        })
    }

    submitMysql = ()=>{
        const sc = this;
        let {mysqlForm,mysqlData} = sc.state;
        mysqlForm.map(function (v) {
            mysqlData[v.label] = v.value;
        })
        sc.refs.$mask.onStart();
        Service.dataTransferMysql(mysqlData,function (res) {
            if(res){
                sc.refs.$mask.onEnd();
            }
        })
    }

    submitRedis = ()=>{
        const sc = this;
        let {redisForm,redisData} = sc.state;
        redisForm.map(function (v) {
            redisData[v.label] = v.value;
        })
        sc.refs.$mask.onStart();
        Service.dataTransferRedis(redisData,function (res) {
            if(res){
                sc.refs.$mask.onEnd();
            }
        })
    }

    state = {
        mysqlData:{
            type:false,
            url:'',
            driver:'',
            username:'',
            password:'',
            operflag:true
        },
        redisData:{
            type:false,
            database:'',
            host:'',
            port:'',
            password:''
        },
        mysqlForm:[
            {label:'url',value:''},
            {label:'driver',value:''},
            {label:'username',value:''},
            {label:'password',value:''},
        ],
        redisForm:[
            {label:'database',value:''},
            {label:'host',value:''},
            {label:'port',value:''},
            {label:'password',value:''},
        ]
    }

    componentDidMount(){
        this.loadStart();
    }

    render(){
        const sc = this;
        const {classes} = this.props;
        const {mysqlData,redisData,mysqlForm,redisForm} = this.state;
        console.log('1231')
        return (
            <div>
                <Paper className={classes.row} elevation="1">
                    <div className="title">
                        mysql config :&nbsp;&nbsp;
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small" color="primary"
                                    checked={!mysqlData.type}
                                    onChange={(e)=>{
                                        mysqlData.type = false;
                                        sc.forceUpdate();
                                    }}
                                />
                            }
                            label={intl.get('adminArea.tipsDataIn')}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small" color="primary"
                                    checked={mysqlData.type}
                                    onChange={(e)=>{
                                        mysqlData.type = true;
                                        sc.forceUpdate();
                                    }}
                                />
                            }
                            label={intl.get('adminArea.tipsDataOut')}
                        />
                    </div>
                    {
                        !!mysqlData.type && mysqlForm.map(function (v) {
                            return rowHtml.call(sc,v)
                        })
                    }
                    <div className="flex-r" >
                        <div className="flex-box"></div>
                        <FormControlLabel
                            className="flex-one"
                            style={{width:'180px',display:mysqlData.type?'':'none'}}
                            control={
                                <Checkbox
                                    size="small" color="primary"
                                    checked={mysqlData.operflag}
                                    onChange={(e)=>{
                                        mysqlData.operflag = e.target.checked;
                                        sc.forceUpdate();
                                    }}
                                />
                            }
                            label={intl.get('adminArea.tipsDataTransfer')}
                        />
                        <Button className="flex-one" size="middle" color="primary" onClick={sc.submitMysql}>{intl.get('confirm')}</Button>
                    </div>
                </Paper>
                <Paper className={classes.row} elevation="1">
                    <div className="title">
                        radis config :&nbsp;&nbsp;
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small" color="primary"
                                    checked={!redisData.type}
                                    onChange={(e)=>{
                                        redisData.type = false;
                                        sc.forceUpdate();
                                    }}
                                />
                            }
                            label={intl.get('adminArea.tipsDataIn')}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small" color="primary"
                                    checked={redisData.type}
                                    onChange={(e)=>{
                                        redisData.type = true;
                                        sc.forceUpdate();
                                    }}
                                />
                            }
                            label={intl.get('adminArea.tipsDataOut')}
                        />
                    </div>
                    {
                        !!redisData.type && redisForm.map(function (v) {
                            return rowHtml.call(sc,v)
                        })
                    }
                    <div className="flex-r" >
                        <div className="flex-box"></div>
                        <Button className="flex-one" size="middle" color="primary" onClick={sc.submitRedis}>{intl.get('confirm')}</Button>
                    </div>
                </Paper>
                <Mask className={classes.mask} ref="$mask"/>
            </div>
        )
    }
}

export default Index;


function rowHtml(one){
    const sc = this;
    return (
        <div className="flex-r">
            <label className="flex-one">{one.label} : </label>
            <div className="flex-box input_box" >
                <Input
                    fullWidth
                    defaultValue={one.value}
                    inputProps={{'aria-label': 'description'}}
                    onChange={(event)=>{
                        one.value = event.target.value;
                        //sc.forceUpdate();
                    }}
                />
            </div>
        </div>
    )
}


class Mask extends React.PureComponent {

    startTime(){
        let sc = this;
        let timer = null;
        let action = function(){
            timer = window.setTimeout(function () {
                window.clearTimeout(timer);
                let time = sc.state.time - 1;
                if(time<1){
                    History.push('/503')
                    sc.setState({hidden:true});
                }else{
                    sc.setState({time:time})
                    action();
                }
            },1000)
        }
        action();
    }

    onStart = ()=>{
        this.setState({success:false,hidden:false})
    }

    onEnd = ()=>{
        this.startTime();
        this.setState({success:true,hidden:false});
    }

    state = {
        hidden:true,
        success:false,
        time:5
    }

    componentDidMount(){
        const sc = this;
        // setTimeout(function () {
        //     sc.setState({success:true})
        // },3000)
    }

    render(){
        const {className} = this.props;
        const {hidden,success,time} = this.state;
        return (
            <div className={className} style={{display:hidden?'none':''}}>
                <div className="progress">
                    {success
                        ? <div className="text">{intl.get('adminArea.tipsStarting') + ' ' + time + ' s'}</div>
                        : <div className="text">{intl.get('adminArea.tipsDataTransfering')}</div>
                    }
                    <LinearProgress />
                </div>
            </div>
        )
    }
}