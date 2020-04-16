import React from 'react';
import {inject,observer} from 'mobx-react';
import {withStyles} from '@material-ui/core/styles'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import Icons from 'components/Icons/icons'
import AuthFilter from '@/AuthFilter'
import UserT from './user/user'
import intl from 'react-intl-universal'
//
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button'
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
    }
});

@inject("store")
@withStyles(styles)
@AuthFilter
@observer
class Index extends React.PureComponent {
    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){
        this.loadCluster();
    }

    loadCluster(){
        let sc = this;
        let { store } = this.props;
        let params = this.params;
        store.cluster.ajaxClusterByName(params._name,function(){
            sc.refs.$user.loadUsers();
        });
    }

    state = {}

    clickAddUser = ()=>{
        const sc = this;
        sc.refs.$user.clickAddUser()();
    }

    clickInviteUser = ()=>{
        const sc = this;
        sc.refs.$user.clickInviteUser();
    }

    leaveGroup = ()=>{
        const sc = this;
        sc.refs.$user.leaveGroup();
    }

    delUser = ()=>{
        const sc = this;
        sc.refs.$user.delUser();
    }

    render(){
        let sc = this;
        let { classes,store } = this.props;
        let params = this.params;
        let user = store.global.user;
        let clusterMap = store.cluster.clusterMap;
        let userSelMap = store.cluster.userSelMap;
        let inviteUrl = `${window.SIP}/inviteEnv?user=${user.username}&namespace=${params._name}&code=${clusterMap.code}`;
        let auth = this.getClusterAuth(clusterMap);
        return (
            <Layout
                menuT={<MenuLayout params={params}  type="cluster"/>}
                crumbList={[
                    {text:`${params._name}`,url:`/cluster/${params._name}/summary`},
                    {text:'Users'}
                ]}
                crumbFooter={
                    <div className={`${classes.actions}`}>
                        {
                            clusterMap.loaded
                                ? (
                                    <React.Fragment>
                                        <Button color="primary" onClick={sc.clickAddUser} startIcon={<PersonAddIcon />} disabled={!auth("W")} style={{marginLeft:'32px'}}>{intl.get('add')}</Button>
                                        <CopyToClipboard text={inviteUrl} onCopy={sc.clickInviteUser}>
                                            <Button color="primary" startIcon={<Icons.InviteBoldIcon className="inviteButton" />} disabled={!auth("W")} style={{marginLeft:'16px'}} >{intl.get('invite')}</Button>
                                        </CopyToClipboard>
                                        {
                                            userSelMap.userId==user.id ? (
                                                <Button color="primary" disabled={!auth("W")} startIcon={<ExitToAppIcon/>}
                                                        style={{marginLeft: '16px'}} onClick={sc.leaveGroup}>{intl.get('leave')}</Button>
                                            ) : (
                                                <Button color="primary" disabled={!userSelMap.id || !auth("W")} startIcon={<DeleteIcon/>}
                                                        style={{marginLeft: '16px'}} onClick={sc.delUser}>{intl.get('delete')}</Button>
                                            )
                                        }
                                    </React.Fragment>
                                ) : ''
                        }

                    </div>
                }
                contentT={
                    <UserT ref="$user" />
                }
            />
        )
    }
}

export default Index;
