import React from 'react';
import clsx from 'clsx';
import {
    Close as CloseIcon
} from '@material-ui/icons';
import {
    withStyles,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Popover,FormControl,InputLabel,Select,Input,MenuItem,
    Divider,Paper
} from '@material-ui/core'

import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import Service from '../Service'
import intl from 'react-intl-universal'
// template
import VersionListT from './versionList.jsx'

const styles = theme => ({
    root:{
        '& [role="dialog"]':{
            maxWidth:'888px'
        }
    },
    content: {
        width: '650px',
        height: '500px',
        padding: '0 24px',
        position: 'relative',
        '& .content_title':{
            lineHeight:'40px'
        },
        '& .content_box': {
            padding:'16px 2px 0',
            overflowY: 'auto'
        }
    },
    version:{
        minWidth:'150px',
        borderBottom:'1px solid #ddd',
        display:'inline-block'
    }
})

@withStyles(styles)
class AlertTemp extends React.PureComponent {
    componentDidMount(){
        const props = this.props;
        this.onOk = props.onOk || function(){};
    }

    state = {
        data:{
            id:'',
            serviceId:'',
            prefix:'',
            version:'',
            pod:1,
            type:8
        },
        versionList_loaded:false,
        versionList:[],
        item:{},
        open:false,
        step:0,
    }

    loadVersion = (item)=>{
        const sc = this;
        Service.imageList(item.id,(res)=>{sc.setState({versionList:res,versionList_loaded:true})})
    }

    handle(){
        const sc = this;
        return (name,v)=>{
            sc.state.data.version = v.version;
            sc.state.data.id = v.id;
            sc.state.data.serviceId = v.serviceId;
            sc.forceUpdate();
        }
    }

    setData = (data)=>{
        _.extend(this.state.data,data);
        this.forceUpdate();
    }

    onStep = (num)=>{
        this.setState({step:this.state.step+num})
    }

    onOpen = (options)=>{
        let item = options.item;
        options.step = 0;
        console.log(options)
        _.extend(this.state,options);
        this.state.data.prefix = 'release ' + (item.image_version || 'none') + ' -> ';
        this.forceUpdate();
    }

    onClose = ()=>{
        this.setState({open:false})
    }

    clickSubmit = ()=>{
        const item = this.state.item;
        let data = this.state.data;
        let isFirst = !item.image_version;
        if(isFirst){
            _.extend(data,this.refs.$type.getData())
            _.extend(data,this.refs.$content.getData())
        }else{
            _.extend(data,this.refs.$type.getData())
        }
        Service.releaseAdd({
            name:data.prefix+data.version,
            type:data.type,
            service:{
                id:data.serviceId
            },
            candidate:{
                imageId:data.id,
                podCount:data.pod
            }
        },()=>{
            History.push(`/topology/${item.name}`)
        })
    }

    renderChange(data,name,valid){
        const sc = this;
        return (event)=>{
            let val = event.target.value;
            if(!valid || valid(val)){
                data[name] = val;
                sc.forceUpdate();
            }
        }
    }

    htmlVersion(){
        let { classes } = this.props;
        let { data,item,versionList,versionList_loaded } = this.state;
        let versionListBtnStatus = 2;//
        let listFooter = versionList_loaded ? (versionList.length>0 ? false : <Icons.NodataT />) : <Icons.Loading />
        versionList.map((v)=>{
            if(v.version == item.image_version){
                v.btn = 1;
                versionListBtnStatus = 0;
            }else{
                v.btn = versionListBtnStatus;
            }
        })

        return (
            <div className={clsx('flex-c',classes.content)}>
                <div className="flex-one content_title">
                    <Typography component="b" >{intl.get('services.deploy.labelName')} : <span className={classes.version}>{data.prefix}{data.version}&nbsp;</span></Typography>
                </div>
                <div className="flex-box content_box">
                    {listFooter || <VersionListT handle={this.handle()} data={versionList}/>}
                </div>
            </div>
        )
    }

    htmlType(){
        let { classes } = this.props;
        let { data,item } = this.state;
        let isFirst = !item.image_version;
        if(isFirst){
            return (
                <div className={classes.content}>
                    <div>
                        <Inputs.Form size={6} ref="$type" data={[
                             {label:intl.get('services.deploy.category'),name:'type',type:'select',options:[{key:null,text:intl.get('services.firstButton')}],inputProps:{disabled:true,defaultValue:null}}
                        ]}/>
                        <Divider size={6} light={true} margin="2"/>
                        <Inputs.Form ref="$content" data={[
                             {label:intl.get('services.deploy.podNum'),name:'pod',valid:['number'],inputProps:{type:'number',defaultValue:1}}
                        ]}/>
                    </div>
                </div>
            )
        }else{
            return (
                <div className={classes.content} >
                    <Inputs.Form size={6} ref="$type" data={[
                         {
                            label:'发布类型',name:'type',type:'select',options:[
                                    {key:1,text:intl.get('services.releaseType.1')},
                                    {key:2,text:intl.get('services.releaseType.2')},
                                    {key:4,text:intl.get('services.releaseType.4')},
                                    {key:8,text:intl.get('services.releaseType.8')},
                                ],inputProps:{defaultValue:8}
                            }
                    ]}/>
                </div>
            )
        }
    }

    render() {
        const sc = this;
        const { classes } = this.props;
        let data = sc.state.data;
        let content = sc.htmlVersion();
        sc.state.step == 1 && (content = sc.htmlType());
        //
        window.sc = this;
        return (
            <Dialog
                className={clsx("common_alert",classes.root)}
                open={Boolean(sc.state.open)}
                onClose={sc.onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <CloseIcon onClick={this.onClose} style={{cursor:"pointer",position:'absolute',right:0,margin:'16px',zIndex:1}}/>
                <DialogContent>
                    {content}
                </DialogContent>
                <DialogActions>
                    { sc.state.step>0 ? <Button onClick={()=>{sc.onStep(-1)}} color="primary">{intl.get('nextStep')}</Button> : '' }
                    { sc.state.step<1 ? <Button onClick={()=>{sc.onStep(+1)}} color="primary" disabled={!data.version}>{intl.get('preStep')}</Button> : '' }
                    { sc.state.step==1? (
                        <Button onClick={()=>{sc.clickSubmit()}}
                                disabled={sc.state.step!=1}
                                color="primary" >
                            {intl.get('confirm')}
                        </Button>
                    ):''}
                </DialogActions>
            </Dialog>
        )
    }
}

export default AlertTemp;
