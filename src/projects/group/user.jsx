import React,{useState} from 'react';
import {inject,observer} from 'mobx-react';
import clsx from 'clsx'
import {
    Edit as EditIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
    Check as CheckIcon,
    ExitToApp as ExitToAppIcon,
    Info as InfoIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Tooltip,IconButton,
    Paper,Avatar,Button,Divider,
    FormControlLabel,Switch
} from '@material-ui/core'

import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import Icons from '@/components/Icons/icons.jsx'
import intl from 'react-intl-universal'
// template
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Popover from '@/components/Dialog/Popover.jsx'
import DrawerT from '@/components/Dialog/Drawer.jsx'
import ConfirmDialog from '@/components/Dialog/Alert.jsx'
import ProjectsUser from "../components/group_user_select";
import ProjectsUserAuth from '../components/group_user_auth.jsx'
import ProjectsGroupAuth from '../components/group_group_auth.jsx'
import Service from '../Service'
import AuthFilter from '@/AuthFilter.jsx'


const styles = theme => ({
    root:{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        margin: '-16px -24px',
        padding: '16px 24px',
        position: 'absolute',
    },
    actions:{
        "& .inviteButton":{
            width:"16px",height:'16px',fill:'#3f51b5 !important'
        },
        "& .Mui-disabled .inviteButton":{
            fill:'#bdbdbd !important'
        }
    },
    row:{
        minHeight:'80px',
        padding:'16px',
        marginTop:'16px',
        position:'relative',
        '&.active':{
            border:'1px solid #3f51b5'
        },

        '& .item':{
            marginRight:'16px'
        },
        '& .divider':{
            height:'48px'
        },
        '& .group_auth':{
            width:'200px',
            '& b':{
                marginRight:'6px'
            }
        },
        '& button':{
            marginTop:'-4px',
            marginLeft:'4px'
        },
        '& .icon':{
            width:'1.2rem',
            height:'1.2rem'
        },

        '& .username':{
            maxWidth:'120px',
            overflow:'hidden',
            textOverflow:'ellipsis',
            fontSize:'1.3rem',
            marginRight:'8px',
            display:'inline-block'
        },
        '& .service_auth':{
            maxWidth:'580px',
            wordBreak:'break-word',
            '&>span':{
                whiteSpace:'nowrap'
            }
        },
        '& .auth':{
            marginRight:'16px',
            color:'#546e7a'
        },
        '& .datetime':{
            color:'#546e7a'
        }
    },
    tipIcon:{
        width:'14px',
        marginLeft:'3px',
        verticalAlign:'middle'
    },
    box:{
        width:'inherit',
        padding:'0 0 50px'
    }
});

@withStyles(styles)
@inject("store")
@observer
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){
        this.loadUsers();
    }

    loadUsers = ()=>{
        const { store } = this.props;
        const params = this.params;
        store.group.ajaxUsers(params);
    }

    delUser = ()=>{
        this.refs.$delUser.onOpen({
            open:true,
            title:intl.get('tips'),
            message:<Typography variant="body1" style={{width:'240px',fontWeight:400}}>{intl.get('user.tipsDelete')}</Typography>
        })
    }

    delUser_ok = ()=>{
        const sc = this;
        const { store } = this.props;
        let userSel = this.state.userSel;
        let userList = store.group.userMap.records;
        Service.groupUserDel({id:userSel.id,serviceGroupId:userSel.serviceGroupId},function(res){
            if(res){
                store.group.delUser(userSel);
                sc.refs.$delUser.onOpen({open:false});
                //
                window.Store.notification.loadNotification();
            }
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
        let userSel = this.state.userSel;
        Service.groupUserDel({id:userSel.id},function(res){
            window.History.push('/');
        })
    }

    state = {
        userSel:{},
    }

    editUser = (e,item)=>{
        this.refs.$auth.onOpen({open:true},<ProjectsUserAuth data={item} />)
        e.stopPropagation()
    }

    clickAddUser(){
        const sc = this;
        let groupData = this.props.store.group.groupData;
        return ()=>{
            sc.refs.$user.onOpen({open:true,data:groupData})
        }
    }

    clickInviteUser(){
        return ()=>{
            window.Store.notice.add({text:intl.get('tipsCopyInvite')})
        }
    }

    clickSelectUser = (userCheck)=>{
        let userSel = this.state.userSel;
        this.setState({userSel:userSel.id==userCheck.id?{}:userCheck})
    }

    changePage = (event, newPage)=>{
        this.state.userList.pageNum = newPage;
        this.loadUsers();
    }

    changeRowsPerPage = (e)=>{
        this.state.userList.pageSize = e.target.value;
        this.state.userList.pageNum = 1;
        this.loadUsers();
    }

    render(){
        const sc = this;
        const { classes,store } = this.props;
        const { userSel } = this.state;
        const groupData = store.group.groupData;
        const userMap = store.group.userMap;
        const params = this.params;
        const userListFooter = userMap.loaded ? (userMap.records.length ? '' : <Icons.NodataT />) : <Icons.Loading />;
        //
        let user = _.local("user");
        let inviteUrl = window.location.href.replace(window.location.pathname,`/invite?user=${user.username}&group=${groupData.name}&code=${groupData.inviteCode}`)
        let auth = sc.getAuth(groupData);
        //
        return (
            <Layout
                crumbList={[{text:params._group,url:`/group/${params._group}`},{text:'Users'}]}
                crumbFooter={
                    <div className={`${classes.actions}`}>
                        <Button color="primary" onClick={this.clickAddUser()} startIcon={<PersonAddIcon />} disabled={!auth(20)} style={{marginLeft:'32px'}}>{intl.get('add')}</Button>
                        <CopyToClipboard text={inviteUrl} onCopy={this.clickInviteUser()}>
                            <Button color="primary" startIcon={<Icons.InviteBoldIcon className="inviteButton" />} disabled={!auth(20)} style={{marginLeft:'16px'}}>{intl.get('invite')}</Button>
                        </CopyToClipboard>
                        {
                            !auth(20, userSel) ? (
                                <Button color="primary" disabled={!auth(20)} startIcon={<ExitToAppIcon/>}
                                        style={{marginLeft: '16px'}} onClick={this.leaveGroup}>{intl.get('leave')}</Button>
                            ) : (
                                <Button color="primary" disabled={!userSel.id || !auth(20)} startIcon={<DeleteIcon/>}
                                        style={{marginLeft: '16px'}} onClick={this.delUser}>{intl.get('group.delete')}</Button>
                            )
                        }
                    </div>
                }
                menuT={<MenuLayout type="group" params={params} />}
                contentT={
                    <div className={classes.box}>
                        <div className={clsx(classes.root)} >
                            {
                                userMap.records.map((v,i)=>{
                                    let id = v.id;
                                    v.serviceGroupId = groupData.id;
                                    v.groupId = groupData.id;
                                    v.groupName = groupData.name;
                                    if(v.username == 'admin'){
                                        return (
                                            <Paper className={clsx('flex-r','flex-center',id==userSel.id?'active':'',classes.row)} key={i} onClick={()=>{auth(20) && this.clickSelectUser(v) }}>
                                                <div className="flex-one item">
                                                    <Avatar src="https://img.toutiao.io/subject%2F6fb1a80dffde44eda80e6eb5c63df9e1"/>
                                                </div>
                                                <div className="flex-one item" style={{width:'185px'}}>
                                                    <span className="username text link2" onClick={sc.toUrl(`/profile/${v.username}`)}>{v.username}</span>
                                                    {auth(0,v)?'':<span className="status_success label text">It's you</span>}
                                                </div>
                                                <Divider className="item divider" light={true} orientation={'vertical'} />
                                                <div className="flex-box item">
                                                    {intl.get('tipsNoAuthorityByAdmin')}
                                                </div>
                                            </Paper>
                                        )
                                    }else{
                                        return (
                                            <Paper className={clsx('flex-r','flex-center',id==userSel.id?'active':'',classes.row)} key={i} onClick={()=>{auth(20) && this.clickSelectUser(v) }}>
                                                <div className="flex-one item">
                                                    <Avatar src="https://img.toutiao.io/subject%2F6fb1a80dffde44eda80e6eb5c63df9e1"/>
                                                </div>
                                                <div className="flex-one item" style={{width:'185px'}}>
                                                    <span className="username text link2" onClick={sc.toUrl(`/profile/${v.username}`)}>{v.username}</span>
                                                    {auth(0,v)?'':<span className="status_success label text">It's you</span>}
                                                </div>
                                                <Divider className="item divider" light={true} orientation={'vertical'} />
                                                <div className="flex-one item">
                                                    <Typography variant="body2" component="div" gutterBottom>
                                                        <span className="text">{intl.get('services.authority')}</span>
                                                        <Tooltip title={intl.get('services.authorityMemo')}><InfoIcon className={classes.tipIcon}/></Tooltip>
                                                    </Typography>
                                                    <div className="service_auth">
                                                        <ServiceAuthHtml data={v} onRender={(render)=>{v._render=render}}/>
                                                        {auth(20,v) && <IconButton size="small" onClick={(e)=>{this.editUser(e,v)}}><EditIcon className="icon" /></IconButton>}
                                                    </div>
                                                </div>
                                                <div className="flex-box" >
                                                </div>
                                                <Divider className="item divider" light={true} orientation={'vertical'} />
                                                <div className="flex-one">
                                                    <div className="group_auth">
                                                        <Typography variant="body2" gutterBottom>
                                                            <span className="text">{intl.get('group.authority')}</span>
                                                            <Tooltip title={intl.get('group.authorityMemo')}><InfoIcon className={classes.tipIcon}/></Tooltip>
                                                        </Typography>
                                                        <GroupAuthHtml data={v} disabled={!auth(20,v)} style={{marginLeft:'4px'}}/>
                                                    </div>
                                                </div>
                                            </Paper>
                                        )
                                    }
                                })
                            }
                            {userListFooter}
                            <ProjectsUser ref="$user" renderUsers={sc.loadUsers}/>
                            <Popover id="group_user_menu" onRef={(ref)=>{this.$popover = ref}} />
                            <ConfirmDialog ref="$leave" onOk={sc.leaveGroup_ok}/>
                            <ConfirmDialog ref="$delUser" onOk={sc.delUser_ok}/>
                            <DrawerT ref="$auth"/>
                        </div>
                    </div>
                }
            />
        )
    }
}

export default Index;


// groupAuth
function GroupAuthHtml({data,disabled}){
    const [auth, setAuth] = useState(data.accessLevel=='RW');
    const groupAuthCheck = function (e) {
        let checked = e.target.checked;
        Service.groupUserGroupAuth({
            accessLevel:checked?'RW':'R',
            id:data.id,
            serviceGroupId:data.serviceGroupId,
            userId:data.userId
        },(res)=>{
            setAuth(checked);
        })
    }
    
    return (
        <div className="flex-middle">
            <b>{intl.get('user.tipsGroupAdmin')}</b>
            <Switch
                disabled={disabled}
                checked={auth}
                onChange={groupAuthCheck}
                size="small"
                color="primary"
            />
        </div>
    )
}

// serviceAuth
function ServiceAuthHtml({data,...props}){
    const [list, setList] = useState(data.serviceUsers);
    let text = [];
    list.map((one)=>{
        text.push(<span>{one.serviceName+' : '}<b>{(one.roleNum || ' 一 ').replace(/\,/g,'')}</b> ; </span>)
    })
    //
    props.onRender((one)=>{// userServiceReId
        data.serviceUsers.every(function (v) {
            if(!v.userServiceReId && v.serviceName==one.serviceName){
                v.roleNum = one.roleNum;
                return false;
            }else if(v.userServiceReId == one.userServiceReId){
                v.roleNum = one.roleNum;
                return false;
            }
            return true;
        })
        setList([...data.serviceUsers])
    })
    return text;
}