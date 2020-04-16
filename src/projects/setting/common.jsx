import React from 'react';
import {observer,inject} from "mobx-react";
import {
    withStyles,Typography,Paper,Button,Card,CardHeader,CardContent,Tooltip
} from '@material-ui/core'
import DeleteServiceDialog from './components/deleteServiceDialog'
import ConfirmDialog from 'components/Dialog/Alert.jsx'
import Service from '../Service'
import AuthFilter from '@/AuthFilter.jsx'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import intl from 'react-intl-universal'

const styles = theme => ({
    root:{
        margin:'0 8px'
    },
    card:{
        padding:'0 16px',
        '& .icon_button':{
            minWidth:'150px',
            marginRight:'8px'
        }
    },
    token_info:{
        width:'580px',
        height:'1.8rem',
        lineHeight:'1.8rem',
        margin:'0 8px',
        padding:'0 8px',
        verticalAlign:'middle',
        color:'#555',
        backgroundColor:'#f1f1f1',
        letterSpacing:'.2rem',
        fontSize:'1rem',
        display:'inline-block',

        '& .dot':{
            fontWeight:'600'
        }
    }
})

@withStyles(styles)
@inject('store')
@observer
@AuthFilter
class Index extends React.PureComponent {

    componentWillMount(){
        const sc = this;
        const { store } = this.props;
        sc.params = this.props.params;
        //
        store.project.ajaxSetting(sc.params)
    }

    componentDidMount(){}

    state = {
        token_show:false,
        token_copy:false
    }

    leaveService = ()=>{
        const sc = this;
        const { store } = this.props;
        const serviceData = store.project.serviceData;
        sc.refs.$del.setState({open:true,title:intl.get('services.setting.delServiceButton'),text:serviceData.name,disabled:true})
    }

    leaveService_ok = ()=>{
        // ajax
        const { store } = this.props;
        let $del = this.refs.$del;
        let serviceData = store.project.serviceData;
        Service.serviceDel({
            id:serviceData.id,
            isDelK8s:$del.state.checkAll
        },function(res){
            $del.setState({open:false})
            window.History.push('/')
        })
    }

    clickTokenCopy = ()=>{
        this.setState({token_copy:true})
    }

    clickTokenShow = (flag)=>{
        this.setState({token_show:flag,token_copy:false})
    }

    clickTokenGenerate = ()=>{
        this.refs.$confirm.onOpen({open:true,title:intl.get('tips'),message:<Typography variant="body1" style={{width:'240px',fontWeight:400}}>{intl.get('services.setting.tipsCreateToken')}</Typography>})
    }

    clickConfirmCreateToken = ()=>{
        const sc = this;
        const { store } = this.props;
        let serviceData = store.project.serviceData;
        Service.tokenServiceGenerate({id:serviceData.id,name:serviceData.name},function(res){
            if(res){
                sc.refs.$confirm.onOpen({open:false})
                window.Store.notice.add({text:intl.get('tipsCreate')})
                //store.project.updateService({token:res.token})
                sc.setState({token:res.token,token_show:true})
            }
            return true;
        })
    }

    render(){
        const {classes,store} = this.props;
        const { token_show,token_copy } = this.state;
        const serviceData = store.project.serviceData;
        let auth = this.getServiceAuth(store.project.serviceData);
        let tokenDot = token_copy ? <i>Token copied!</i> : (token_show ? serviceData.token : <span className="dot">······················</span>)
        //
        return (
            <div className={classes.root}>

                <Card className={classes.card}>
                    <div className="header">
                        <CardHeader
                            title={<Typography variant="h4" compoonent="b" ><span className="">{intl.get('services.setting.tokenTitle')}</span></Typography>}
                        />
                    </div>
                    <CardContent className="content">
                        <div>TOKEN <span className={classes.token_info}>{tokenDot}</span></div>
                        <br/>
                        <CopyToClipboard text={serviceData.token} onCopy={this.clickTokenCopy}>
                            <Button variant="contained" className="icon_button" >{intl.get('services.setting.tokenCopyButton')}</Button>
                        </CopyToClipboard>
                        <Button variant="contained" className="icon_button" onClick={()=>{this.clickTokenShow(!token_show)}} >{token_show?intl.get('services.setting.tokenHideButton'):intl.get('services.setting.tokenShowButton')}</Button>
                        {
                            auth(20) ? (
                                <Button variant="contained" className="icon_button" onClick={()=>{this.clickTokenGenerate()}} >{intl.get('services.setting.tokenGenerateButton')}</Button>
                            ):(
                                <Tooltip title={intl.get('tipsNoAuthority')}>
                                    <Button variant="contained" className="icon_button" style={{opacity:.4}}>{intl.get('services.setting.tokenGenerateButton')}</Button>
                                </Tooltip>
                            )
                        }
                    </CardContent>
                </Card>
                <br/>
                <Card className={classes.card}>
                    <div className="header">
                        <CardHeader
                            title={<Typography variant="h4" compoonent="b" ><span className="danger">{intl.get('services.setting.delServiceTitle')}</span></Typography>}
                        />
                    </div>
                    <CardContent className="content">
                        {
                            auth("X") ? (
                                <Button variant="contained" className="danger_button"
                                        onClick={this.leaveService}>{intl.get('services.setting.delServiceButton')}</Button>
                            ) : (
                                <Tooltip title={intl.get('tipsNoAuthority')}>
                                    <Button variant="contained" className="danger_button" style={{opacity:.4}}>{intl.get('services.setting.delServiceButton')}</Button>
                                </Tooltip>
                            )
                        }
                    </CardContent>
                </Card>
                <DeleteServiceDialog  ref="$del" onOk={this.leaveService_ok}/>
                <ConfirmDialog  ref="$confirm" onOk={this.clickConfirmCreateToken}/>
            </div>
        )
    }
}

export default Index;
