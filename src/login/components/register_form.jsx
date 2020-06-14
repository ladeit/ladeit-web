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
class Index extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            disableSubmit:'no',
            form:[
                {name:'username',valid:['require',this.clickAbleSubmit], inputProps:{placeholder:intl.get('login.username'),endAdornment: <PersonIcon className="inputIcon"/>}},
                {name:'password',valid:['require',this.clickAbleSubmit,this.validPassword], inputProps:{type:'password',placeholder:intl.get('login.password'),endAdornment: <VisibilityOffIcon className="inputIcon" onClick={this.clickVisiblePassword}/>}},
                {name:'rpassword',valid:['require',this.clickAbleSubmit,this.validPassword], inputProps:{type:'password',placeholder:intl.get('login.prepassword'),endAdornment: <VisibilityOffIcon className="inputIcon" onClick={this.clickVisiblePassword}/>}},
            ]
        }
    }

    componentWillMount(){
        //
    }

    componentDidMount(){
        //
    }

    toUrl(url){
        return ()=>{
            History.push(url)
        }
    }

    state = {}

    clickVisiblePassword = ()=>{
        const sc = this;
        const column = sc.state.form[1];
        const column2 = sc.state.form[2];
        if(column.inputProps.type!=''){
            column.inputProps = {type:'',placeholder:intl.get('login.password'),endAdornment: <VisibilityIcon className="inputIcon" onClick={this.clickVisiblePassword}/>}
            column2.inputProps = {type:'',placeholder:intl.get('login.prepassword'),endAdornment: <VisibilityIcon className="inputIcon" onClick={this.clickVisiblePassword}/>}
        }else{
            column.inputProps = {type:'password',placeholder:intl.get('login.password'),endAdornment: <VisibilityOffIcon className="inputIcon" onClick={this.clickVisiblePassword}/>}
            column2.inputProps = {type:'password',placeholder:intl.get('login.prepassword'),endAdornment: <VisibilityOffIcon className="inputIcon" onClick={this.clickVisiblePassword}/>}
        }
        sc.state.form = [...sc.state.form];
        sc.forceUpdate();
    }

    validPassword = (column,error)=>{
        const map = this.refs.$form.getData();

        if(!map.password) {
            //
        } else if(!map.rpassword) {
            //
        } else if(map.password != map.rpassword){
            error.rpassword = intl.get('tipsDifPassword')
        } else{
            delete error.rpassword;
        }
    }

    clickAbleSubmit = (column,error) => {
        const map = this.refs.$form.getData();
        const flag = map.username && map.password && map.rpassword ? false : 'no';
        if(Boolean(flag) ^ Boolean(this.state.disableSubmit)){
            this.setState({disableSubmit:flag})
        }
    }

    changeInput(data,name){
        const sc = this;
        return (event)=>{
            data[name] = event.target.value;
            if(data.username && data.password && data.rpassword){
                sc.state.disableSubmit = 'no';
            }else{
                sc.state.disableSubmit = false;
            }
            sc.forceUpdate();
        }
    }

    clickSubmit = ()=>{
        let sc = this;
        let changeTab = this.props.changeTab;
        let param = this.refs.$form.getData();
        if(!(param.username && param.password)){return;}
        if(param.rpassword != param.password){
            return;
        }
        sc.setState({disableSubmit:true})
        Service.userPost({username:param.username,password:SHA.sha256(param.password)},(res)=>{// res ： true
            sc.setState({disableSubmit:false})
            if(res){
                //History.push('/login')
                window.Store.notice.add({text:intl.get('tipsCreate')})
                changeTab('tabIndex',0);
            }
        })
    }

    clickKey = (e)=>{
        if(e.keyCode==13 && ["password","rpassword"].indexOf(e.target.name)>-1){
            this.clickSubmit();
        }
    }

    render = ()=>{
        const { classes } = this.props;
        const { form,disableSubmit } = this.state;
        window.sc  =this;
        return (
            <div className={classes.root} >
                <form onKeyDown={this.clickKey} >
                    <p className="flex-center" ></p>
                    <Inputs.Form data={form} size={12} ref="$form"/>
                    <div className="row">
                        <Icons.ButtonT fullWidth variant="contained" color="primary" disabled={disableSubmit} title={intl.get('login.register')} onClick={this.clickSubmit}/>
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
