import React from 'react';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import {
    withStyles,
    Typography,
    Button,IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core'

import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import Selects from '@/components/Form/selects.jsx'
import Service from '../Service'

const styles = theme => ({
    root:{
        width:'600px',
        padding:'0 16px 40px'
    },
    content:{
        textAlign:'center'
    },
    close:{
        position:'absolute',
        right:'16px',
        top:'16px'
    }
})

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        this.renderUsers = this.props.renderUsers;
    }

    componentDidMount(){
        let props = this.props;
        props.onRef && props.onRef(this);
    }

    state = {
        open:false,
        data:{name:''},
        list:[]
    }

    renderData(){
        const sc = this;
        const groupData = this.state.data;
        return (str,callback)=>{
            Service.groupUsersListByName({ServiceGroupId:groupData.id, UserName:str},function(res){
                callback(res)
            })
        }
    }

    inviteUser = (list)=>{
        let sc = this;
        let groupData = this.state.data;
        let data = [];
        list.map((v)=>{
            data.push({accessLevel:'R',serviceGroupId:groupData.id,userId: v.key})
        })
        sc.onClose();
        Service.groupUsersInvite(data,function(){
            sc.renderUsers();
            //
            window.Store.notification.loadNotification();
        })
    }

    onOpen = (options,html)=>{
        _.extend(this.state,options);
        this.forceUpdate();
    }

    onClose = ()=>{
        this.setState({open:false})
    }

    render = ()=>{
        const { classes } = this.props;
        const { open,data } = this.state;
        //
        return (
            <Dialog
                open={Boolean(open)}
                onClose={this.onClose}
            >
                <DialogContent>
                    <Typography variant="h3" className={clsx('',classes.close)} onClick={this.onClose}>×</Typography>
                    <div className={classes.root}>
                        <div className={classes.content} >
                            <Typography component="p"><Icons.InviteIcon /></Typography>
                            <div className="split"><Typography variant="h4">Invite member to {data.name}</Typography></div>
                        </div>
                        <Selects ref="$selects" renderData={this.renderData()} invite={this.inviteUser}/>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}

export default Index;
