import React from 'react';
import {
    withStyles,Typography,Paper,Button,
    FormControl,FormLabel,RadioGroup,FormControlLabel,Radio
} from '@material-ui/core';
import Tabs from 'components/Tab/nav_pills.jsx'
import Icons from 'components/Icons/icons.jsx'
import Service from '../projects/Service'
import intl from 'react-intl-universal'

let tabData = [];
let tabAuthData = [];
let tabDepolyData = [];
let tabDepolyData2 = [];


class Index extends React.PureComponent {
    componentWillMount(){
        tabData = [
            {text:intl.get('close')},
            {text:intl.get('robot.assessment')},
            {text:intl.get('robot.auto')}
        ];
        tabAuthData = [
            {key:1,text:'Slack'},
            // {key:2,text:'飞书'},
            // {key:0,text:'站内'},
        ];
        tabDepolyData = [
            {key:8,text:intl.get('services.releaseType.8')},
            // {key:2,text:'蓝绿发布'},
            // {key:4,text:'ABTEST发布',className:'disabled'},
            // {key:1,text:'金丝雀发布',className:'disabled'},
        ]
        tabDepolyData2 = [
            {key:8,text:intl.get('services.releaseType.8')},
            //{key:2,text:'蓝绿发布'}
        ]
        //
        let item = this.props.serviceData;
        _.extend(this.state,getData(item.servicePublishBot),{serviceGroupId:item.serviceGroupId,serviceId:item.id});
    }

    state = {
        id:'',
        serviceGroupId:'',
        serviceId:'',
        deployType:8,
        authType:1,
        tabActive:0,
        submit_loaded:false,
    }

    clickItemType(item,name){
        const sc = this;
        return ()=>{
            sc.state[name] = item.key;
            sc.forceUpdate();
        }
    }

    clickSubmit(){
        const sc = this;
        const { serviceData,onOk } = this.props;
        return () => {
            sc.setState({submit_loaded:true})
            //
            const { submit_loaded,...state } = sc.state;
            let data = getData(state,true);
            Service.serviceRobot(data,function (res) {
                if(res){
                    data.id = res;// 😄
                    onOk(state.tabActive?data:'')
                }else{
                    sc.setState({submit_loaded:false})
                }
            })
            //_.delay(function () {},3000)
        }
    }

    onTab = (num)=>{
        this.setState({tabActive:num});
        return true;
    }

    renderClose(){
        return ""
    }

    renderAuth(){
        const sc = this;
        const { classes } = this.props;
        const { authType,deployType } = this.state;
        return (
            <>
                <FormControl component="fieldset">
                    <FormLabel component="legend">{intl.get('robot.assessmentType')}</FormLabel>
                    <div style={{padding:'8px 0'}}>
                        {
                            tabAuthData.map(function (v,i) {
                                return (
                                    <Icons.ItemT className={v.className} title={v.text} active={v.key==authType} onClick={sc.clickItemType(v,'authType')} key={i}/>
                                )
                            })
                        }
                    </div>
                </FormControl>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">{intl.get('robot.deployType')}</FormLabel>
                    <div style={{padding:'8px 0'}}>
                        {
                            tabDepolyData.map(function (v,i) {
                                return (
                                    <Icons.ItemT className={v.className} title={v.text} active={v.key==deployType} onClick={sc.clickItemType(v,'deployType')} key={i}/>
                                )
                            })
                        }
                    </div>
                </FormControl>
            </>
        )
    }

    renderAuto(){
        const sc = this;
        const { classes } = this.props;
        const { deployType } = this.state;
        return (
            <>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">{intl.get('robot.deployType')}</FormLabel>
                    <div style={{padding:'8px 0'}}>
                        {
                            tabDepolyData2.map(function (v,i) {
                                return (
                                    <Icons.ItemT className={v.className} title={v.text} active={v.key==deployType} onClick={sc.clickItemType(v,'deployType')} key={i}/>
                                )
                            })
                        }
                    </div>
                </FormControl>
            </>
        )
    }

    render(){
        const sc = this;
        const { classes } = this.props;
        const { tabActive,submit_loaded } = this.state;
        // <Button variant="contained" color="primary" size="medium" className="fr" onClick={sc.clickSubmit()}>确认</Button>
        return (
            <Paper style={{width:'480px'}}>
                <div className={classes.box}>
                    <div className={classes.title}>
                        <Typography variant="h5" style={{lineHeight:'30px'}}>{intl.get('robot.autoDeploy')}</Typography>
                    </div>
                    <br/>
                    <Tabs className={classes.tabs} data={tabData} active={tabActive} onTab={sc.onTab}/>
                    <br/>
                    {tabActive==0 && sc.renderClose()}
                    {tabActive==1 && sc.renderAuth()}
                    {tabActive==2 && sc.renderAuto()}
                    <br/>
                    <div>
                        <Icons.ButtonT title={intl.get('confirm')} onClick={sc.clickSubmit()}  disabled={submit_loaded}  variant="contained" color="primary" size="medium" className="fr" />
                    </div>
                    <br/>
                </div>
            </Paper>
        )
    }
}


const styles = theme => ({
    title:{
        textAlign:'center'
    },
    tabs:{
        margin:'0 -24px'
    },
    box:{
        padding:"32px 24px",
        '& fieldset':{
            marginBottom:'16px'
        }
    }
})

export default withStyles(styles)(Index);


// 参数转化
function getData(obj,isParam){
    if(isParam){
        return {
            id:obj.id,
            serviceGroupId:obj.serviceGroupId,
            serviceId:obj.serviceId,
            publishType:obj.deployType,//发布方式
            examineType:obj.authType,// 审核方式： 1 ， 2 ，0
            operType:obj.tabActive// 0：关闭 ，1：需要人工审核 ，2 ：全自动
        }
    }else{
        return {
            id:obj.id,
            serviceGroupId:obj.serviceGroupId,
            serviceId:obj.serviceId,
            deployType:obj.publishType||8,//发布方式
            authType:obj.examineType==null?1:obj.examineType,// 审核方式： 1 ， 2 ，0
            tabActive:obj.operType,// 0：关闭 ，1：需要人工审核 ，2 ：全自动
            submit_loaded:false,
        }
    }
}