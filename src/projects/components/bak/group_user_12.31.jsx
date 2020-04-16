import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import {
    Check as CheckIcon,
    Edit as EditIcon
} from '@material-ui/icons';
import {
    withStyles,Typography,Paper,Avatar,IconButton,Button,Divider,
    Toolbar,
    List,ListItem,ListItemText,ListItemSecondaryAction
} from '@material-ui/core';
import Icons from '@/components/Icons/icons.jsx'
import TableT from '@/components/Table/table_page.jsx'
import Popover from '@/components/Dialog/Popover.jsx'
import DrawerT from '@/components/Dialog/Drawer.jsx'
import ProjectsUser from './projects_user.jsx'
import ProjectsUserAuth from './group_user_auth.jsx'
import ProjectsGroupAuth from './group_group_auth.jsx'
import Pagination from 'components/Table/list_page.jsx';
//
import Service from '../Service'

const styles = theme => ({
    root:{
        width:'600px',
        padding:'16px'
    },
    row:{
        height:'60px',
        padding:'16px',
        marginTop:'16px',
        '& .item':{
            marginRight:'16px'
        },
        '& .group_auth':{
            width:'120px'
        },
        '& .icon':{
            width:'1.2rem',
            height:'1.2rem'
        },

        '& .username':{
            fontSize:'1.3rem',
            marginRight:'16px'
        },
        '& .auth':{
            marginRight:'16px',
            color:'#546e7a'
        },
        '& .datetime':{
            color:'#546e7a'
        }
    }
})
const LEVEL = {'10':'admin','20':'regular'};


@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        const sc = this;
        this.$table = {
            noChecked:true,
            columns: [
                {id: 'username',disablePadding: true, label: '用户'},
                {id: 'createAt',disablePadding: true, label: '加入时间'},
                {id: 'accessLevel',disablePadding: true, label: '访问级别',render:(row)=>{
                    return LEVEL[row.accessLevel]
                }},
                {id: 'role',disablePadding: true, label: '权限角色',render(row){
                    return <Button variant="outlined" color="primary" size="small" onClick={sc.clickShowUserRole(row)}>查看</Button>
                }},
            ],
            event: _.debounce((name,data)=>{
                let opt = sc.state.userList;
                if(name=='page'){
                    opt.pageNum = data + 1;
                }else if(name=='pageSize'){
                    opt.pageSize = data;
                }
                sc.loadUsers();
            },300)
        }
        // 角色信息
        this.$role = {
            noChecked:true,
            columns: [
                {id: 'serviceName',disablePadding: true, label: '服务',style:{width:'180px'}},
                {id: 'role',disablePadding: true, label: '角色',render(row){
                    const roleRow = sc.state.roleRow;
                    if(roleRow.auth=='admin'){
                        return <Button variant="outlined" color="primary" size="small" aria-describedby="group_user_menu" onClick={sc.clickSelectRole(row)}>{row.role}</Button>;
                    }else{
                        return row.role||'guest';
                    }
                }}
            ]
        }
    }

    componentDidMount(){
        const sc = this;
        const { params } = this.props;
        Service.groupListByName(params._group,function(res){
            sc.state.groupData = res[0];
            sc.loadUsers();
        })
    }

    loadUsers = ()=>{
        const sc = this;
        const userList = this.state.userList;
        const groupData = this.state.groupData;
        Service.groupUsers({currentPage:userList.pageNum,pageSize:userList.pageSize,ServiceGroupId:groupData.id},(res)=>{
            sc.setState({userList:res})
        })
    }

    loadUserRole(item){
        const sc = this;
        const options = this.state.roleRow_auth;
        let groupData = sc.state.groupData;
        sc.setState({roleRow:item,roleRow_auth_loaded:false})
        Service.groupUsersAuth({currentPage:options.pageNum,pageSize:options.pageSize,ServiceGroupId:groupData.id,UserId:item.id},(res)=>{
            sc.setState({roleRow_auth_loaded:true,roleRow_auth:res})
        })
    }

    state = {
        groupData:{},
        userList:{pageNum:1,pageSize:1,pageCount:0,records:[],totalPage:1},
        roleRow:{list:[]},
        roleRow_auth:{pageNum:1,pageSize:10,pageCount:0,records:[]},
        roleRow_auth_loaded:false,
        roleList:[// maintainer / developer / reportor / guest
            {key:'owner',text:'owner'},
            {key:'maintainer',text:'maintainer'},
            {key:'reportor',text:'reportor'},
            {key:'guest',text:'guest'}
        ]
    }

    editGroupAuth = ()=>{
        let groupData = this.state.groupData;
        this.refs.$auth.onOpen({open:true},<ProjectsGroupAuth data={groupData}/>)
    }

    editUser = (item)=>{
        item.groupId = this.state.groupData.id;
        this.refs.$auth.onOpen({open:true},<ProjectsUserAuth data={item}/>)
    }

    clickShowUserRole(item){
        const sc = this;
        return ()=>{
            sc.loadUserRole(item);
        }
    }

    clickAddUser(){
        const sc = this;
        return ()=>{
            sc.$user.onOpen({open:true})
        }
    }

    clickSelectRole(row){
        const sc = this;
        return (event)=>{
            sc.$popover.onOpen({anchor:event.target},<List component="nav" aria-label="menu">{sc.htmlMenu(row)}</List>)
        }
    }

    clickSelectRole_select(roles,row){// roles {key:'',text:''}
        const sc = this;
        return ()=>{
            row.role = roles.key;
            sc.state.roleRow.list = [...sc.state.roleRow.list];
            sc.$popover.onOpen({anchor:NULL})
            sc.forceUpdate();
        }
    }

    changePage = (p)=>{
        _.extend(this.state.groupList,p);
        this.loadUsers();
    }

    htmlMenu(row){
        const sc = this;
        const { roleList,roleRow } = this.state;
        return roleList.map((v)=>{
            return (
                <ListItem button onClick={sc.clickSelectRole_select(v,row)}>
                    <ListItemText primary={v.text} />
                    <ListItemSecondaryAction>
                        {row.role == v.key?<CheckIcon />:''}
                    </ListItemSecondaryAction>
                </ListItem>
            )
        })
    }

    render = ()=>{
        const { classes,className } = this.props;
        const { roleRow,userList,roleRow_auth_loaded,roleRow_auth } = this.state;
        const authFooter = roleRow_auth_loaded ? (roleRow_auth.records.length ? '' : <Icons.NodataT />) : <Icons.Loading />
        return (
            <div className={clsx(classes.root,className)} >
                <div className="split">
                    <Button variant="outlined" color="primary" size="small" className="fr" onClick={this.clickAddUser()}>添加</Button>
                </div>
                {
                    userList.records.map((v,i)=>{
                        return (
                            <Paper className={clsx('flex-r','flex-center',classes.row)} key={i}>
                                <div className="flex-one item">
                                    <Avatar src="https://img.toutiao.io/subject%2F6fb1a80dffde44eda80e6eb5c63df9e1"/>
                                </div>
                                <div className="flex-one item">
                                    <span className="username">{v.username}</span>
                                </div>
                                <Divider className="item" light={true} orientation={'vertical'} />
                                <div className="flex-one item">
                                    buzzy-web : <b>RW</b> ;
                                    <IconButton onClick={()=>{this.editUser(v)}}><EditIcon className="icon" /></IconButton>
                                </div>
                                <div className="flex-box" >
                                </div>
                                <Divider light={true} orientation={'vertical'} />
                                <div className="flex-one">
                                    <div className="group_auth flex-center">
                                        <b>{'RW'}</b>
                                        <IconButton onClick={()=>{this.editGroupAuth()}}><EditIcon className="icon" /></IconButton>
                                    </div>
                                </div>
                            </Paper>
                        )
                    })
                }
                {
                    userList.totalPage == 1 || (
                        <Pagination
                            pagination={{pageNum:userList.pageNum,pageSize:userList.pageSize,count:userList.totalRecord}}
                            render={this.changePage}
                        />
                    )
                }
                <ProjectsUser onRef={(ref)=>{this.$user = ref}} />
                <Popover id="group_user_menu" onRef={(ref)=>{this.$popover = ref}} />
                <DrawerT ref="$auth"/>
            </div>
        )
    }
}

export default Index;
