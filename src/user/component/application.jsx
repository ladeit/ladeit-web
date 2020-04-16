import React from 'react';
import {
    withStyles,Typography,Button,Card,CardHeader,CardContent
} from '@material-ui/core';
import Component from '@/Component.jsx'
import Icons from 'components/Icons/icons.jsx'
import intl from 'react-intl-universal'
// template
import ConfirmDialog from 'components/Dialog/Alert.jsx'
import Service from '../Service'

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
});

@withStyles(styles)
class Index extends Component{

    componentDidMount(){
        this.loadSlack()
    }

    loadSlack = ()=>{
        const sc = this;
        const user = _.local("user");
        Service.userSlack({userId:user.id},function (res) {
            sc.setState({slack:res||{}})
        })
    }

    state = {
        slack:{}
    }

    clickSlackDel = ()=>{
        const sc = this;
        const { slack } = this.state;
        sc.refs.$del.onOpen({
            open:true,
            title:intl.get('tips'),
            message:<Typography variant="body1" style={{width:'280px',fontWeight:400}}>确认删除 Slack用户（ {slack.slackUserName} ）授权 ?</Typography>
        })
    }

    clickSlackDel_ok = () => {
        const sc = this;
        const { slack } = this.state;
        sc.refs.$del.onOpen({open:false});
        Service.userSlackDel({userSlackRelationId:slack.id},function (res) {
            window.Store.notice.add({text:_.template(intl.get('user.tipsSlackDel'))({name:slack.slackUserName})})
            sc.setState({slack:{}})
        })
    }

    renderSlack(){
        const { classes } = this.props;
        const { slack } = this.state;
        if(!slack.id){
            return '';
        }
        return (
            <Card className={classes.card}>
                <div className="header">
                    <CardHeader
                        title={<Typography variant="h4" compoonent="b" ><span className="danger">Slack Application</span></Typography>}
                    />
                </div>
                <CardContent className="content">
                    <p className="flex-middle" style={{marginTop:0}}><Typography component="span">{intl.get('user.tipsAuthorityUsers')} {slack.slackUserName}</Typography></p>
                    <Button variant="contained" className="danger_button" onClick={()=>{this.clickSlackDel()}} >{intl.get('user.tipsDeleteAuthor')}</Button>
                </CardContent>
            </Card>
        )
    }

    render(){
        const { classes } = this.props;
        return (
            <>
                {this.renderSlack()}
                <ConfirmDialog ref="$del" onOk={this.clickSlackDel_ok} />
            </>
        )
    }
}

export default Index;
