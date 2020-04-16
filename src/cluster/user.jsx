import React,{useState} from 'react';
import {inject,observer} from 'mobx-react';
import clsx from 'clsx'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
    ExitToApp as ExitToAppIcon,
    Info as InfoIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Tooltip,IconButton,
    Paper,Avatar,Button,Divider,Switch
} from '@material-ui/core'

import Layout from '@/layout1/dashboard.jsx'
import Icons from '@/components/Icons/icons.jsx'
import intl from 'react-intl-universal'
// template
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Popover from '@/components/Dialog/Popover.jsx'
import DrawerT from '@/components/Dialog/Drawer.jsx'
import ConfirmDialog from '@/components/Dialog/Alert.jsx'
import ProjectsUser from "./cluster/user/user_select";
import ProjectsUserAuth from './cluster/user/user_auth.jsx'
import Service from '@/cluster/Service'
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
            width:'120px'
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
        store.cluster.ajaxCluster({id:params.id,name:params._name,accessLevel:params.r>0?'RW':'R'});
        store.cluster.ajaxUsers();
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
        Service.clusterAUsersDel({id:userSel.id},function(res){
            if(res){
                store.cluster.delUser(userSel);
                sc.refs.$delUser.onOpen({open:false});
            }
        })
    }

    leaveGroup = ()=>{
        this.refs.$leave.onOpen({
            open:true,
            title:intl.get('tips'),
            message:<Typography variant="body1" style={{width:'240px',fontWeight:400}}>{intl.get('cluster.tipsLeaveCluster')}</Typography>
        })
    }

    leaveGroup_ok = ()=>{
        let userSel = this.state.userSel;
        Service.clusterAUsersDel({id:userSel.id},function(res){
            window.History.push('/cluster');
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
        const { store } = this.props;
        return ()=>{
            sc.refs.$user.onOpen({open:true,data:store.cluster.clusterMap})
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
        const clusterMap = store.cluster.clusterMap;
        const userMap = store.cluster.userMap;
        const params = this.params;
        const userListFooter = userMap.loaded ? (userMap.records.length ? '' : <Icons.NodataT />) : <Icons.Loading />;
        //
        let user = _.local("user");
        let inviteUrl = window.location.href.replace(window.location.pathname+'?',`/inviteEnv?user=${user.username}&namespace=${params._name}&code=${clusterMap.code}&`)
        let auth = sc.getClusterAuth(clusterMap);
        //
        return (
            <Layout
                crumbList={[{text:''}]}
                crumbFooter={
                    <div className={`${classes.actions}`}>
                        <IconButton onClick={this.toUrl('/cluster')}><KeyboardBackspaceIcon /></IconButton>
                        {
                            userMap.loaded
                                ? (
                                    <React.Fragment>
                                        <Button color="primary" onClick={this.clickAddUser()} startIcon={<PersonAddIcon />} disabled={!auth("W")} style={{marginLeft:'32px'}}>{intl.get('add')}</Button>
                                        <CopyToClipboard text={inviteUrl} onCopy={this.clickInviteUser()}>
                                            <Button color="primary" startIcon={<Icons.InviteBoldIcon className="inviteButton" />} disabled={!auth("W")} style={{marginLeft:'16px'}}>{intl.get('invite')}</Button>
                                        </CopyToClipboard>
                                        {
                                            userSel.userId==user.id ? (
                                                <Button color="primary" disabled={!auth("W")} startIcon={<ExitToAppIcon/>}
                                                        style={{marginLeft: '16px'}} onClick={this.leaveGroup}>{intl.get('leave')}</Button>
                                            ) : (
                                                <Button color="primary" disabled={!userSel.id || !auth("W")} startIcon={<DeleteIcon/>}
                                                        style={{marginLeft: '16px'}} onClick={this.delUser}>{intl.get('delete')}</Button>
                                            )
                                        }
                                    </React.Fragment>
                                ) : ''
                        }

                    </div>
                }
                contentT={
                    <div className={classes.box}>
                        <div className={clsx(classes.root)} >
                            {
                                userMap.records.map((v,i)=>{
                                    let id = v.id;
                                    let isSelf = v.userId==user.id;
                                    let isActive = v.userId == userSel.userId;
                                    v.clusterId = params.id;
                                    if(v.userName == 'admin'){
                                        return (
                                            <Paper className={clsx('flex-r','flex-center',isActive?'active':'',classes.row)} key={i} onClick={()=>{auth("W") && this.clickSelectUser(v) }}>
                                                <div className="flex-one item">
                                                    <Avatar src="https://img.toutiao.io/subject%2F6fb1a80dffde44eda80e6eb5c63df9e1"/>
                                                </div>
                                                <div className="flex-one item" style={{width:'185px'}}>
                                                    <span className="username text link2" onClick={sc.toUrl(`/profile/${v.userName}`)}>{v.userName}</span>
                                                    {!isSelf?'':<span className="status_success label text">{intl.get('tipsItsYou')}</span>}
                                                </div>
                                                <Divider className="item divider" light={true} orientation={'vertical'} />
                                                <div className="flex-box item">
                                                    {intl.get('tipsNoAuthorityByAdmin')}
                                                </div>
                                            </Paper>
                                        )
                                    }else{
                                        return (
                                            <Paper className={clsx('flex-r','flex-center',isActive?'active':'',classes.row)} key={i} onClick={()=>{auth("W") && this.clickSelectUser(v) }}>
                                                <div className="flex-one item">
                                                    <Avatar src="https://img.toutiao.io/subject%2F6fb1a80dffde44eda80e6eb5c63df9e1"/>
                                                </div>
                                                <div className="flex-one item" style={{width:'185px'}}>
                                                    <span className="username text link2" onClick={sc.toUrl(`/profile/${v.userName}`)}>{v.userName}</span>
                                                    {!isSelf?'':<span className="status_success label text">{intl.get('tipsItsYou')}</span>}
                                                </div>
                                                <Divider className="item divider" light={true} orientation={'vertical'} />
                                                <div className="flex-one item">
                                                    <Typography variant="body2" component="div" gutterBottom>
                                                        <span className="text">{intl.get('namespace.tipsAuthority')}</span>
                                                        <Tooltip title={intl.get('cluster.authorityMemo')} ><InfoIcon className={classes.tipIcon}/></Tooltip>
                                                    </Typography>
                                                    <div className="service_auth">
                                                        <NSAuthHtml data={v} onRender={(render)=>{v._render=render}}/>
                                                        { !isSelf && auth("W") && <IconButton size="small" onClick={(e)=>{this.editUser(e,v)}}><EditIcon className="icon" /></IconButton>}
                                                    </div>
                                                </div>
                                                <div className="flex-box" >
                                                </div>
                                                <Divider className="item divider" light={true} orientation={'vertical'} />
                                                <div className="flex-one">
                                                    <div className="group_auth">
                                                        <Typography variant="body2" gutterBottom>
                                                            <span className="text">{intl.get('cluster.authority')}</span>
                                                            <Tooltip title={intl.get('cluster.authorityMemo')} ><InfoIcon className={classes.tipIcon}/></Tooltip>
                                                        </Typography>
                                                        <ClusterAuthHtml data={v} disabled={isSelf || !auth("W")}/>
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


// component - groupAuth
function ClusterAuthHtml({data,disabled}){
    const [auth, setAuth] = useState(data.accessLevel=='RW');
    const groupAuthCheck = function (e) {
        let checked = e.target.checked;
        Service.clusterAuthUpdate({
            accessLevel:checked?'RW':'R',
            id:data.id,
            clusterId:data.clusterId,
            userId:data.userId
        },(res)=>{
            setAuth(checked);
        })
    }
    
    return (
        <div className="flex-middle">
            <b>{intl.get('user.tipsClusterAdmin')}</b>
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

// component - serviceAuth
function NSAuthHtml({data,...props}){
    const [list, setList] = useState(data.envuser);
    let text = [];
    list.map((one)=>{
        text.push(<span>{one.namespace+' : '}<b>{(one.accessLevel || ' 一 ').replace(/\,/g,'')}</b> ; </span>)
    })
    //
    props.onRender((one)=>{// userServiceReId
        data.envuser.every(function (v) {
            if(!v.envId && v.namespace==one.namespace){
                v.accessLevel = one.accessLevel;
                return false;
            }else if(v.envId == one.envId){
                v.accessLevel = one.accessLevel;
                return false;
            }
            return true;
        })
        setList([...data.envuser])
    })
    return text;
}