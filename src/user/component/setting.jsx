import React from 'react';
import {observer,inject} from "mobx-react";
import {
    AttachFile
} from '@material-ui/icons'
import {
    withStyles,Typography,Button,IconButton,Divider,TextField,
    Grid,
    Card,CardHeader,CardContent,
    Avatar
} from '@material-ui/core';
import intl from 'react-intl-universal';
import Inputs from 'components/Form/inputs.jsx'
import Component from '@/Component.jsx'
import Icons from 'components/Icons/icons.jsx'
import Service from '../Service'
// template
import CustomFileInput from "components/CustomFileInput/CustomFileInput.js";

const styles = theme => ({
    root:{
        paddingBottom:'80px'
    },
    card:{
        display:'flex',
        '& .header':{
            width:'300px',
            alignItems:'flex-start'
        },
        '& .content':{
            flex:1
        }
    },
    user_avatar:{
        width:'120px',
        height:'120px'
    },
    input:{
        padding:'8px 0'
    }
});

@inject('store')
@observer
@withStyles(styles)
class Index extends Component{

    componentWillMount(){
        let user = this.props.store.global.user;
        this.state.user = {id:user.id,username:user.username,nickName:user.nickName,email:user.email};
    }

    state = {// TODO
        avatar:'https://img.toutiao.io/subject%2F6fb1a80dffde44eda80e6eb5c63df9e1',
        user:{
            id:'',
            username:'',
            email:'',
            nickName:''
        }
    }

    changeAvatar = (files)=>{
        let file = files[0];
        this.setState({avatar:window.URL.createObjectURL(file)})
    }

    changeInput(name){
        const sc = this;
        const user = this.state.user;
        return (e)=>{
            user[name] = e.target.value;
            sc.forceUpdate();
        }
    }

    clickSubmit = ()=>{
        let user = this.state.user;
        let store = window.Store;
        Service.userUpdate(user,function(res){
            store.notice.add({text:'更新成功 .'})
            store.global.updateUser(user)
        })
    }

    render(){
        const { classes,store } = this.props;
        const { avatar,user } = this.state;
        const params = this.params;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <div className="header" >
                        <CardHeader
                            title="Public Avatar"
                            subheader="You can upload an avatar here or change it at gravatar.com"
                        />
                    </div>
                    <CardContent className="content">
                        <Avatar src={avatar} className={classes.user_avatar} />
                        <CustomFileInput
                            onChange={this.changeAvatar}
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                placeholder: intl.get('user.labelAvator')+" ... "
                            }}
                            endButton={{
                                buttonProps: {
                                  round: true,
                                  color: "primary",
                                  justIcon: true,
                                  fileButton: true
                                },
                                icon: <AttachFile />
                            }}
                        />
                    </CardContent>
                </Card>
                <br/>
                <Card className={classes.card}>
                    <CardHeader
                        className="header"
                        title="Main settings"
                        subheader="This information will appear on your profile."
                    />
                    <CardContent className="content">
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <div className={classes.input}>
                                    <TextField fullWidth label={intl.get('user.labelUsername')} disabled={true} value={user.username} onChange={this.changeInput('username')} />
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div className={classes.input}>
                                    <TextField fullWidth label={intl.get('user.labelNickname')} value={user.nickName} onChange={this.changeInput('nickName')} />
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div className={classes.input}>
                                    <TextField fullWidth label={intl.get('user.labelEmail')} value={user.email} onChange={this.changeInput('email')} />
                                </div>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <div class="split">
                    <Button variant="contained" color="primary" className="" onClick={this.clickSubmit}>{intl.get('user.buttonUpdate')}</Button>
                </div>
            </div>
        )
    }
}

export default Index;
