import React from 'react';
import ReactDOM from 'react-dom';
import LanCom from '@/locales/about.jsx';
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@material-ui/icons';
import {
    withStyles,Button,Typography,
    Paper,DialogTitle,DialogContent,
    FormControl,Input
} from '@material-ui/core';

import intl from 'react-intl-universal'
import Inputs from 'components/Form/inputs.jsx'
import Icons from 'components/Icons/icons.jsx'
import Service from '../Service'
import AuthFilter from '@/AuthFilter'
import SHA from 'js-sha256'

const styles = theme =>({
    root:{
        width:'100%',
        padding:'8px 40px',
        color:'#999',
        lineHeight:'1.4rem',
        '& .content':{
            padding:'0 48px'
        },
        '& .row':{
            margin:'0 0 16px 0',
            paddingTop:'24px'
        },
        '& .MuiFormControl-root':{
            paddingTop:0
        }
    },
    topArea:{
        width:'100%',
        textAlign:'center',
        '& h5':{
            color:'white'
        }
    },
    input:{
        '& svg':{
            width:'1.6rem',
            marginLeft:'8px'
        }
    }
})


@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent {
    constructor(props){
        super(props);
        this.initParams();
        this.state = {
            disableSubmit:'no',
            form:[
                {name:'username',valid:[this.clickAbleSubmit], inputProps:{placeholder:intl.get("login.username"),endAdornment: <PersonIcon className="inputIcon"/>}},
                {name:'password',valid:[this.clickAbleSubmit], inputProps:{type:'password',placeholder:intl.get("login.password"),endAdornment: <VisibilityOffIcon className="inputIcon" onClick={this.clickVisiblePassword}/>}},
            ]
        }
    }

    toUrl(url){
        let params = this.params;
        return ()=>{
            History.push(`${url}?from=${params.from}`)
        }
    }

    clickVisiblePassword = ()=>{
        const sc = this;
        const column = sc.state.form[1];
        if(column.inputProps.type!=''){
            column.inputProps = {type:'',placeholder:intl.get("login.password"),endAdornment: <VisibilityIcon className="inputIcon" onClick={this.clickVisiblePassword}/>}
        }else{
            column.inputProps = {type:'password',placeholder:intl.get("login.password"),endAdornment: <VisibilityOffIcon className="inputIcon" onClick={this.clickVisiblePassword}/>}
        }
        sc.state.form = [...sc.state.form];
        sc.forceUpdate();
    }

    clickAbleSubmit = (column,error) => {
        const form = this.state.form;
        const flag = form[0].value && form[1].value ? false : 'no';
        if(Boolean(flag) ^ Boolean(this.state.disableSubmit)){
            this.setState({disableSubmit:flag})
        }
    }

    changeInput(data,name){
        const sc = this;
        return (event)=>{
            data[name] = event.target.value;
            if(data.username && data.password && data.r_password){
                sc.state.disableSubmit = 'no';
            }else{
                sc.state.disableSubmit = false;
            }
            sc.forceUpdate();
        }
    }

    clickSubmit = ()=>{
        let sc = this;
        let params = this.params;
        let param = this.refs.$form.getData();
        if(!(param.username && param.password)){return;}
        sc.setState({disableSubmit:true})
        Service.userMap({username:param.username,password:SHA.sha256(param.password)},(res)=>{
            if(res){
                if(res.username=='admin'){
                    res.admin = true;
                }
                Store.global.setUser(res)
                if(params.from){
                    History.replace(decodeURIComponent(decodeURIComponent(params.from)))
                }else{
                    History.replace('/services')
                }
            }else{
                sc.setState({disableSubmit:false})
            }
        })
    }

    clickKey = (e)=>{
        if(e.keyCode==13 && e.target.name=="password"){
            this.clickSubmit();
        }
    }

    render = ()=>{
        const { classes } = this.props;
        const { form,disableSubmit } = this.state;
        return (
            <div className={classes.root}>
                <form onKeyDown={this.clickKey} >
                    <p className="flex-center" ></p>
                    <Inputs.Form data={form} size={12} ref="$form"/>
                    <div className="row">
                        <Icons.ButtonT fullWidth variant="contained" color="primary" disabled={disableSubmit} title={intl.get('login.login')} onClick={this.clickSubmit}/>
                    </div>
                    <p>
                        <a className="link2" >&nbsp;</a>
                        <LanCom className="login" callback={(lan)=>{_.href(lan)}}/>
                    </p>
                    <br/>
                </form>
            </div>
        )
    }
}

export default Index;
