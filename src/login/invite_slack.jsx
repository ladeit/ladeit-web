import React from 'react'
import clsx from 'clsx'
import LanCom from '@/locales/about.jsx';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import {
    withStyles,Paper,Typography,Button,Divider
} from '@material-ui/core';
import AuthFilter from '@/AuthFilter'
import intl from 'react-intl-universal'

const styles = theme => ({
    box:{
        width:'100%',
        height:'100%',
        position:'fixed'
    },
    root:{
        width:'480px',
        padding:'16px 24px 32px',
        marginTop:'-80px',
        textAlign:'center',
        display:'inline-block'
    },
    content:{
        padding:'24px',
        '& .info':{
            fontSize:'1.4rem',
            fontWeight:'300',
            lineHeight: '30px'
        }
    }
})

@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent {

    componentWillMount(){
        // slackUserId=UQYLA0PDJ&slackUserName=lzhuopeng&channalId=CQZ4BK12L
        this.initParams();
        this.initCode();
    }

    componentDidMount(){}

    initCode(){
        let user = _.local("user") || {};
        let pm = this.params;
        if(!pm.slackUserId){
            History.push(`/login`)
        }else if(!user.id){
            History.push(`/login?from=${encodeURIComponent('/inviteSlack?slackUserId='+pm.slackUserId+'&slackUserName='+pm.slackUserName+'&channalId='+pm.channalId)}`)
        }else{
            this.validBindUser();
        }
    }

    state = {
        nouse:true // 不可用
    }

    bindUser = ()=>{
        // ajax
        let sc = this;
        let pm = this.params;
        let user = window.Store.global.user;
        let data = {
            slackUserId:pm.slackUserId,
            slackUserName:pm.slackUserName,
            channalId:pm.channalId,
            userName:user.username,
            userId:user.id
        }
        _.ajax({url:'/api/v1/slack/setup',method:'post',data:data},function (res) {
            sc.setState({nouse:true})
            window.Store.notice.add({text:intl.get('inviteWeb.authorEnd')})
        })
    }

    validBindUser(){
        let sc = this;
        let pm = this.params;
        _.ajax({url:'/api/v1/slack/beforeSetup',params:{slackUserId:pm.slackUserId}},function (res) {
            if(res.flag){
                sc.setState({nouse:false})
            }
        })
    }

    render(){
        const { classes } = this.props;
        const user = window.Store.global.user;
        const params = this.params;
        const auth = this.state.nouse;
        return (
            <div className={clsx(classes.box,'flex-center')}>
                <Paper className={classes.root}>
                    <p>{intl.get('inviteWeb.tipsAuthor')}</p>
                    <Divider light={true}/>
                    <div className={clsx(classes.content)}>
                        <Typography component="p" variant="h4">Slack App</Typography>
                        <p className="info">
                            <span className="user_left">{params.slackUserName}</span>&nbsp;<AutorenewIcon className="icon"/>&nbsp;<span className="user_right">{user.username}</span>
                        </p>
                        {auth?<Button size="small" disabled={true} variant="outlined" color="primary">{intl.get('inviteWeb.authorEnd')}</Button>:<Button color="primary" variant="contained" size="small" onClick={this.bindUser}>{intl.get('inviteWeb.authorStart')}</Button>}
                        <br/>
                        <br/>
                        <Typography variant="body2" component="span" className="link1" onClick={this.toUrl('/')}>
                            {intl.get('inviteWeb.back')}
                        </Typography>
                        <br/>
                        <LanCom className="" />
                    </div>
                    <Divider light={true}/>
                    <p><VisibilityIcon style={{verticalAlign:'middle'}}/>{intl.get('inviteWeb.memo1')}&nbsp;&nbsp;<b></b>&nbsp;&nbsp;{intl.get('inviteWeb.memo2')} <b>{intl.get('inviteWeb.memo3')}</b></p>
                </Paper>
            </div>
        )
    }
}

export default Index;
