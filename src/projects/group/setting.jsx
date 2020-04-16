import React from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {
    withStyles,Typography,Grid,IconButton,Button,
    Card,CardHeader,CardContent,Divider,
    List,ListItem,ListItemText,ListItemSecondaryAction,Tooltip
} from '@material-ui/core'

import Moment from "moment"
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import ConfirmText from './deleteGroupDialog'
import ConfirmDialog from 'components/Dialog/Alert.jsx'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import intl from 'react-intl-universal'
// template
import Service from '../Service'
import AuthFilter from '@/AuthFilter.jsx'


const styles = theme => ({
    toolbar:{
        padding:'0 16px',
        '& .flex-right':{
            width:'100%'
        },
        '& .title':{
            whiteSpace:'nowrap'
        }
    },
    card:{
        marginBottom:'24px',
        '& .content':{
            paddingTop:0
        },
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
});

@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){
        this.loadGroup();
    }

    loadGroup(){
        const sc = this;
        let params = this.params;
        sc.setState({data_loaded:false})
        Service.groupListByName(params._group,(res)=>{
            let groupInfo = res[0];
            sc.setState({token:groupInfo.token,data:groupInfo,data_loaded:true});
            sc.loadSlackChannel(groupInfo.id);
        })
    }

    leaveGroup = ()=>{
        this.refs.$leave.onOpen({
            open:true,
            title:intl.get('tips'),
            message:<Typography variant="body1" style={{width:'240px',fontWeight:400}}>{intl.get('group.tipsLeave')}</Typography>
        })
    }

    leaveGroup_ok = ()=>{
        let data = this.state.data;
        Service.groupUserLeave(data.id,function (res) {
            if(res){
                window.History.push('/');
            }
        })
    }

    loadSlackChannel = (id)=>{
        const sc = this;
        Service.groupSlackChannel({ServiceGroupId:id},function (res) {
            if(res){
                sc.setState({channel:res})
            }
        })
    }

    state = {
        data_loaded:false,
        data_group:false,
        data:{},
        channel:[],
        token:'',
        token_show:false,
        token_copy:false
    }

    handleDense = event => {
        this.setState({dense:event.target.checked});
        this.$table.onDense(event.target.checked);
    }

    changeGroupName = (column,error)=>{
        let { data,data_group } = this.state;
        let val = column.value;
        let isChange = val != data.name;
        if(data_group ^ isChange){
            this.state.data_group = isChange;
            this.forceUpdate();
        }
    }

    changeGroupName_save = (e)=>{
        let data = this.state.data;
        let $g = this.refs.$group;
        if($g.getError('',true)){
            return;
        }
        //
        let formData = $g.getData();
        Service.groupUpdateName({id:data.id,name:formData.name},function(res){
            //window.Store.notice.add({text:'更改成功. '})
            let  lc = window.location;
            lc.href = lc.href.replace(lc.pathname,`/group/${formData.name}/setting`);
        })
    }

    clickSlackChannelDel = (channelId,channelName)=> {
        const sc = this;
        const text = _.template(intl.get('group.setting.slackDelTip'))({channelName});
        sc.refs.$slackChannel.onOpen({
            open:true,
            channelId:channelId,
            channelName:channelName,
            title:intl.get('tips'),
            message:<Typography variant="body1" style={{width:'280px',fontWeight:400}}>{text}</Typography>
        })
    }

    clickSlackChannelDel_ok = ()=> {
        let sc = this;
        let channel = sc.state.channel;
        let { channelId,channelName } = sc.refs.$slackChannel.state;
        sc.refs.$slackChannel.setState({open:false});
        Service.groupSlackChannelDel({channelServiceGroupId:channelId}, function (res) {
            window.Store.notice.add({text:`${channelName}${intl.get('tipsDelete')}`})
            //
            channel = channel.filter(function (v) {return v.id!=channelId});
            sc.setState({channel:channel})
        })
    }

    clickDel = ()=>{
        const sc = this;
        const { data } = this.state;
        let name = this.params._group;
        sc.refs.$del.setState({open:true,title:intl.get('group.buttonDelete'),text:name,disabled:true})
    }

    clickDel_ok = ()=>{
        let data = this.state.data;
        let store = window.Store;
        let name = this.params._group;
        data.isdelService = this.refs.$del.state.checkAll;
        Service.groupDel(data,function(res){
            if(res){
                store.notice.add({text:intl.get('tipsDelete')})
                History.push('/services')
            }
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
        let groupData = this.state.data;
        Service.tokenGenerate({serviceGroupId:groupData.id},function(res){
            if(res){
                sc.refs.$confirm.onOpen({open:false})
                window.Store.notice.add({text:intl.get('tipsCreate')})
                sc.setState({token:res.content,token_show:true})
            }
            return true;
        })
    }

    renderChannel(show){
        const sc = this;
        const { classes } = this.props;
        const { channel } = this.state;
        if(!channel || channel.length<1){
            return '';
        }
        return (
            <Card className={classes.card}>
                <div className="header">
                    <CardHeader
                        title={<Typography variant="h4" compoonent="b" ><span className="danger">{intl.get('group.setting.slackTitle')}</span></Typography>}
                    />
                </div>
                <CardContent className="content">
                    <Divider light={true}/>
                    <List dense={false}>
                        {
                            channel.map(function (one) {
                                return (
                                    <>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h5" component="span">{one.channelName}</Typography>
                                                }
                                                secondary={one.createAt && Moment(one.createAt).format('YYYY-MM-DD HH:mm:ss')}
                                            />
                                            <ListItemSecondaryAction>
                                                {
                                                    show ? (
                                                        <IconButton edge="end" aria-label="delete" onClick={()=>{sc.clickSlackChannelDel(one.id,one.channelName)}}>
                                                            <DeleteForeverIcon color="error"/>
                                                        </IconButton>
                                                    ):''
                                                }
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider light={true}/>
                                    </>
                                )
                            })
                        }
                    </List>
                </CardContent>
            </Card>

        )
    }

    render = ()=>{
        const { classes } = this.props;
        const { data,data_group,token,token_copy,token_show } = this.state;
        let params = this.params;
        let tokenDot = token_copy ? <i>Token copied!</i> : (token_show ? token : <span className="dot">······················</span>)
        let auth = this.getAuth(data)

        return (
            <>
                <Layout
                    crumbList={[{text:params._group,url:`/group/${params._group}`},{text:'Settings'}]}
                    menuT={<MenuLayout type="group" params={params} />}
                    contentT={
                        <>
                            <div className={classes.root}>
                                <Card className={classes.card}>
                                    <CardContent className="content">
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <Inputs.Form className="small" size={12} ref="$group" data={[
                                                    {name:'name',label:intl.get('group.setting.infoLabelGroup'),value:params._group,valid:['require','name',this.changeGroupName]},
                                                ]} />
                                            </Grid>
                                            <br/>
                                            <Grid item xs={6} className="flex-middle" ></Grid>
                                        </Grid>
                                        {
                                            auth(20) ? (
                                                <Button variant="contained" disabled={!data_group} color="primary" onClick={this.changeGroupName_save}>{intl.get('save')}</Button>
                                            ):(
                                                <Tooltip title={intl.get('tipsNoAuthority')}>
                                                    <Button variant="contained" color="primary" style={{opacity:.4}}>{intl.get('save')}</Button>
                                                </Tooltip>
                                            )
                                        }
                                    </CardContent>
                                </Card>

                                <Card className={classes.card}>
                                    <div className="header">
                                        <CardHeader
                                            title={<Typography variant="h4" compoonent="b" ><span className="">{intl.get('group.setting.tokenTitle')}</span></Typography>}
                                        />
                                    </div>
                                    <CardContent className="content">
                                        <div>TOKEN <span className={classes.token_info}>{tokenDot}</span></div>
                                        <br/>
                                        <CopyToClipboard text={token} onCopy={this.clickTokenCopy}>
                                            <Button variant="contained" className="icon_button" >{intl.get('group.setting.tokenCopyButton')}</Button>
                                        </CopyToClipboard>
                                        <Button variant="contained" className="icon_button" onClick={()=>{this.clickTokenShow(!token_show)}} >{token_show?intl.get('group.setting.tokenHideButton'):intl.get('group.setting.tokenShowButton')}</Button>
                                        {
                                            auth(20) ? (
                                                <Button variant="contained" className="icon_button" onClick={()=>{this.clickTokenGenerate()}} >{intl.get('group.setting.tokenGenerateButton')}</Button>
                                            ):(
                                                <Tooltip title={intl.get('tipsNoAuthority')}>
                                                    <Button variant="contained" className="icon_button" style={{opacity:.4}}>{intl.get('group.setting.tokenGenerateButton')}</Button>
                                                </Tooltip>
                                            )
                                        }
                                    </CardContent>
                                </Card>

                                {this.renderChannel(auth(20))}

                                <Card className={classes.card}>
                                    <div className="header">
                                        <CardHeader
                                            title={<Typography variant="h4" compoonent="b" ><span className="danger">{intl.get('group.setting.leaveGroupTitle')}</span></Typography>}
                                        />
                                    </div>
                                    <CardContent className="content">
                                        <Button variant="contained" className="danger_button" onClick={this.leaveGroup} >{intl.get('group.setting.leaveGroupButton')}</Button>
                                    </CardContent>
                                </Card>

                                <Card className={classes.card}>
                                    <div className="header">
                                        <CardHeader
                                            title={<Typography variant="h4" compoonent="b" ><span className="danger">{intl.get('group.setting.delGroupTitle')}</span></Typography>}
                                        />
                                    </div>
                                    <CardContent className="content">
                                        {
                                            auth(20) ? (
                                                <Button variant="contained" className="danger_button" onClick={() => {
                                                    this.clickDel()
                                                }}>{intl.get('group.setting.delGroupButton')}</Button>
                                            ) : (
                                                <Tooltip title={intl.get('tipsNoAuthority')}>
                                                    <Button variant="contained" className="danger_button" style={{opacity:.4}}>{intl.get('group.setting.delGroupButton')}</Button>
                                                </Tooltip>
                                            )
                                        }
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    }
                />
                <ConfirmText ref="$del" onOk={this.clickDel_ok}/>
                <ConfirmDialog ref="$leave" onOk={this.leaveGroup_ok}/>
                <ConfirmDialog ref="$slackChannel" onOk={this.clickSlackChannelDel_ok}/>
                <ConfirmDialog  ref="$confirm" onOk={this.clickConfirmCreateToken}/>
            </>
        )
    }
}

export default Index;