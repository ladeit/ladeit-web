import React from 'react';
import {inject,observer} from 'mobx-react';
import clsx from 'clsx'
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
    Check as CheckIcon,
    ExitToApp as ExitToAppIcon,
    Edit as EditIcon,
    Info as InfoIcon
} from '@material-ui/icons';
import {
    withStyles,Typography,Paper,Avatar,IconButton,Button,Divider,Tooltip,
    Toolbar,
    List,ListItem,ListItemText,ListItemSecondaryAction
} from '@material-ui/core';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Icons from '@/components/Icons/icons.jsx'
import Popover from '@/components/Dialog/Popover.jsx'
import DrawerT from '@/components/Dialog/Drawer.jsx'
//
import ProjectsUser from './group_user_select.jsx'
import ProjectsUserAuth from './group_user_auth.jsx'
import ProjectsGroupAuth from './group_group_auth.jsx'
import ConfirmDialog from 'components/Dialog/Alert.jsx'
//
import Service from '../Service'
import intl from 'react-intl-universal'

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
        height:'80px',
        padding:'16px',
        marginTop:'16px',
        position:'relative',
        '&.active':{
            border:'1px solid #3f51b5'
        },

        '& .item':{
            marginRight:'16px'
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
    }
})

@withStyles(styles)
@inject("store")
@observer
class Index extends React.PureComponent {
    componentWillMount(){
        //const sc = this;
    }

    componentDidMount(){
        this.loadUser();
    }

    loadUsers = ()=>{
        const { store,params } = this.props;
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
        let userSel = this.state.userSel;
        let userList = this.state.userList;
        Service.groupUserDel({id:userSel.id},function(res){
            if(res){
                let list = userList.filter((v)=>{return v.id!=userSel.id})
                sc.setState({userList:list})
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
            //
            window.Store.notification.loadNotification();
        })
    }

    state = {
        groupData:{},
        userSel:{},
        //userList:{loaded:false,pageNum:1,pageSize:5,pageCount:0,records:[],totalPage:1},
        userList_loaded:false,
        userList:[],
        roleList:[// maintainer / developer / reportor / guest
            {key:'owner',text:'owner'},
            {key:'maintainer',text:'maintainer'},
            {key:'reportor',text:'reportor'},
            {key:'guest',text:'guest'}
        ]
    }

    editGroupAuth = (e,item)=>{
        let groupData = this.state.groupData;
        item.groupName = groupData.name;
        item.groupId = groupData.id;
        this.refs.$auth.onOpen({open:true},<ProjectsGroupAuth data={item} renderUser={this.loadUsers}/>)
        e.stopPropagation()
    }

    editUser = (e,item)=>{
        item.groupId = this.state.groupData.id;
        this.refs.$auth.onOpen({open:true},<ProjectsUserAuth data={item} renderUser={this.loadUsers}/>)
        e.stopPropagation()
    }

    clickShowUserRole(item){
        const sc = this;
        return ()=>{
            sc.loadUserRole(item);
        }
    }

    clickAddUser(){
        const sc = this;
        let groupData = this.state.groupData;
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

    render = ()=>{
        const { classes,store } = this.props;
        const { groupData,userMap } = store;
        const { userSel } = this.state;
        const userListFooter = userMap.loaded ? (userMap.records.length ? '' : <Icons.NodataT />) : <Icons.Loading />;
        const user = _.local("user");
        let authOpt = groupData.accessLevel == 'RW';
        let inviteUrl = window.location.href.replace(window.location.pathname,`/invite?user=${user.username}&group=${groupData.name}&code=${groupData.inviteCode}`)
        let IS_SEL = userSel.userId == user.id;
        // <Button variant="outlined" color="primary" size="small" onClick={this.clickShowUserRole(v)}>Views</Button>
        return (
            <>
                <div className={`crumbs_action ${classes.actions}`} style={{width:'calc( 100% -  160px)'}}>
                    <Button color="primary" onClick={this.clickAddUser()} startIcon={<PersonAddIcon />} disabled={!authOpt} >{intl.get('add')}</Button>
                    <CopyToClipboard text={inviteUrl} onCopy={this.clickInviteUser()}>
                        <Button color="primary" startIcon={<Icons.InviteBoldIcon className="inviteButton" />} disabled={!authOpt}>{intl.get('invite')}</Button>
                    </CopyToClipboard>
                    {IS_SEL && <Button color="primary" disabled={!authOpt || !userSel.id} startIcon={<ExitToAppIcon />} onClick={this.leaveGroup} >{intl.get('leave')}</Button>}
                    {!IS_SEL && <Button color="primary" disabled={!authOpt || !userSel.id} startIcon={<DeleteIcon />} onClick={this.delUser} >{intl.get('delete')}</Button>}
                </div>
                <div className={clsx(classes.root)} >
                    {
                        userList.map((v,i)=>{
                            let id = v.id;
                            let roleText = [];
                            let authSel = v.userId == user.id;
                            let authVal = authOpt;
                            v.serviceUsers.map((one)=>{
                                roleText.push(<span>{one.serviceName+' : '}<b>{one.roleNum || 'R'}</b> ; </span>)
                            })
                            return (
                                <Paper className={clsx('flex-r','flex-center',id==userSel.id?'active':'',classes.row)} key={i} onClick={()=>{authVal && this.clickSelectUser(v) }}>
                                    <div className="flex-one item">
                                        <Avatar src="https://img.toutiao.io/subject%2F6fb1a80dffde44eda80e6eb5c63df9e1"/>
                                    </div>
                                    <div className="flex-one item" style={{width:'185px'}}>
                                        <span className="username text">{v.username}</span>
                                        {!authSel?'':<span className="status_success label text">It's you</span>}
                                    </div>
                                    <Divider className="item" light={true} orientation={'vertical'} />
                                    <div className="flex-one item">
                                        <Typography variant="body2" component="div" gutterBottom>
                                            <span className="text">{intl.get('services.authority')}</span>
                                            <Tooltip title={intl.get('services.authorityMemo')}><InfoIcon className={classes.tipIcon}/></Tooltip>
                                        </Typography>
                                        <div>
                                            {roleText}
                                            {authVal && <IconButton size="small" onClick={(e)=>{this.editUser(e,v)}}><EditIcon className="icon" /></IconButton>}
                                        </div>
                                    </div>
                                    <div className="flex-box" >
                                    </div>
                                    <Divider className="item" light={true} orientation={'vertical'} />
                                    <div className="flex-one">
                                        <div className="group_auth">
                                            <Typography variant="body2" gutterBottom>
                                                <span className="text">{intl.get('group.authority')}</span>
                                                <Tooltip title={intl.get('services.authorityMemo')}><InfoIcon className={classes.tipIcon}/></Tooltip>
                                            </Typography>
                                            <div >
                                                <b>{v.accessLevel||'R'}</b>
                                                {authVal && <IconButton size="small" onClick={(e)=>{this.editGroupAuth(e,v)}}><EditIcon className="icon" /></IconButton>}
                                            </div>
                                        </div>
                                    </div>
                                </Paper>
                            )
                        })
                    }
                    {userListFooter}
                    <ProjectsUser ref="$user" renderUsers={this.loadUsers}/>
                    <Popover id="group_user_menu" onRef={(ref)=>{this.$popover = ref}} />
                    <ConfirmDialog ref="$leave" onOk={this.leaveGroup_ok}/>
                    <ConfirmDialog ref="$delUser" onOk={this.delUser_ok}/>
                    <DrawerT ref="$auth"/>
                </div>
            </>
        )
    }
}

//<div className="flex-one">
//    <span className="auth">auth by {LEVEL[v.accessLevel]}</span>
//    <Icons.TimeT className="datetime" data={v.createAt} />
//</div>

export default Index;
