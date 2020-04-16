import React from 'react';
import ReactDOM from 'react-dom';
import LanCom from '@/locales/about.jsx';
import {
    withStyles,Paper,Typography,Button
} from '@material-ui/core';

import Component from '../Component.jsx'
import Service from './Service'
import intl from 'react-intl-universal'

const styles = theme => ({
    root:{
        '&>div':{
            width:'500px',
            margin:'80px 0',
            textAlign: 'center',
            display:'inline-block'
        }
    }
})

@withStyles(styles)
class Index extends Component {
    componentWillMount(){
        this.initParams();
        this.code = this.params.code;
        this.initCode();
    }

    componentDidMount(){}

    initCode(){
        let user = _.local("user") || {};
        let pm = this.params;
        if(!pm.code){
            History.push(`/login`)
        }else if(!user.id){
            History.push(`/login?from=${encodeURIComponent('/inviteEnv?env='+pm.env+'&namespace='+pm.namespace+'&code='+this.code)}`)
        }
    }

    clickInvite(){
        const sc = this;
        const code = this.code;
        return ()=>{
            Service.inviteUserToCluster(code,(res)=>{
                if(res){
                    History.push('/cluster')
                }
            })
        }
    }

    render(){
        const { classes } = this.props;
        let params = this.params;
        return (
            <div className={`flex-center ${classes.root}`} >
                <div>
                    <Typography variant="h5" gutterBottom>Invite you to cluster <b>{params.namespace}</b> from {params.user}</Typography>
                    <Typography variant="body2" gutterBottom>A professional kit that comes with ready-to-use Material-UI© components developed with one common goal in mind, help you build faster & beautiful applications. Each component is fully customizable, responsive and easy to integrate.</Typography>
                    <Button color="primary" variant="contained" onClick={this.clickInvite()} >{intl.get('join')}</Button>
                    <br/>
                    <br/>
                    <LanCom className="" />
                </div>
            </div>
        )
    }
}

export default Index;
