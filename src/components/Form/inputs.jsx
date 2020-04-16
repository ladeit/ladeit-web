import React from 'react';
import clsx from 'clsx';
import { fade, withStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import {
    Menu as MenuIcon,
    Edit as EditIcon
} from '@material-ui/icons'
import {
    InputBase,IconButton,Button,Divider,Input,TextField,InputAdornment,
    Checkbox,Switch,
    FormControl,FormControlLabel,FormHelperText,InputLabel,Select,MenuItem,ListItemText,ListSubheader
} from '@material-ui/core'

import Icons from "@/components/Icons/icons.jsx"
import intl from 'react-intl-universal'
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import selectStyles from "assets/jss/material-kit-pro-react/customSelectStyle.js";
import checkedStyles from "assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle.js";

const AutoInputStyles = theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor:"#fff",
        border: "1px solid rgba(0, 0, 0, 0.15)",
        borderRadius: "4px",
        "&$focused":{
            boxShadow:"rgba(25, 118, 210, 0.25) 0 0 0 0.2rem",
            border: "1px solid #1976d2 !important"
        },
        "&.focused":{
            boxShadow:"rgba(25, 118, 210, 0.25) 0 0 0 0.2rem",
            border: "1px solid #1976d2 !important"
        }
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    footer:{
        width:0,
        height:"38px"
    }
});

@withStyles(AutoInputStyles)
class AutoInput extends React.PureComponent {
    state = {
        hasFocus:false
    };

    handleFocus(flag){
        const sc = this;
        return ()=>{
            sc.setState({
                hasFocus:flag
            })
        }
    }

    htmlAction(actions){// {name:"search"}
        let html = [];
        if(!actions){
            //
        }else if(actions.length > 0){
            actions.map(({name,...props})=>{
                switch (name){
                    case "search":
                        html.push(<IconButton key={name} style={{marginRight:"8px",padding:"4px 4px"}} {...props}><SearchIcon /></IconButton>)
                        break;
                    case "edit":
                        html.push(<IconButton key={name} {...props}><Icons.EditIcon /></IconButton>)
                        break;
                    case "del":
                        html.push(<IconButton key={name} {...props}><Icons.DelIcon /></IconButton>)
                        break;
                }
            })
        }else{
            html.push(actions)
        }
        return html;
    }

    render(){// icons,actions:[{name:'search'}]
        const {hasFocus} = this.state;
        const {classes,className,icons,actions,...props} = this.props;
        return <div className={className+" "+classes.root+" "+(hasFocus?"focused":"")}>
            {icons||""}
            <InputBase
                className={classes.input}
                placeholder=""
                inputProps={{ 'aria-label': 'search google maps' }}
                onBlur={ this.handleFocus(false) }
                onFocus={ this.handleFocus(true) }
                {...props}
            />
            {this.htmlAction(actions)}
            <div className={classes.footer}></div>
        </div>
    }
}



const styles = theme => ({
    auto_label:{
        display:'inline-block',
        margin:'0 8px',
        '& .icon':{
            fontSize:'1.2rem',
            cursor:'pointer',
            margin:'0 3px'
        }
    },
    auto_input:{
        margin:'0 8px',
        position:'relative',
        '& input':{
            padding:'2px'
        }
    },
    button:{
        padding:0
    }
});
@withStyles(styles)
class EditLabel extends React.PureComponent{// icon - blur
    componentWillMount(){
        const props = this.props;// init params
        this.handle = props.handle || function(){};
        this.value = props.value || '';
        this.width = props.width || 160;
    }

    state = {
        editable:false
    }

    blurInput = (event,i)=>{
        const value = event.target.value;
        this.value = value;
        this.setState({editable:false});
        //
        this.handle(value)
    }

    htmlLabel(){
        const sc = this;
        const { classes } = this.props;
        return (
            <div className={classes.auto_label} style={{width:`${sc.width}px`}}>
                <span className={clsx("overflow-text")} style={{maxWidth:`${sc.width-40}px`}}>{sc.value}</span>
                <EditIcon className="icon" onClick={()=>{sc.setState({editable:true})}} />
            </div>
        )
    }

    htmlInput(){
        const sc = this;
        const { classes } = this.props;
        return (
            <Input
                defaultValue={sc.value}
                className={clsx(classes.auto_input)}
                inputProps={{'aria-label': 'description'}}
                style={{width:`${sc.width}px`}}
                onBlur={(event)=>{sc.blurInput(event)}}
                autoFocus={true}
            />
        )
    }

    render(){
        const sc = this;
        const { editable } = this.state;
        return editable ? sc.htmlInput() : sc.htmlLabel();
    }
}

@withStyles(styles)
class EditLabel1 extends React.PureComponent{// button - click
    componentWillMount(){
        const props = this.props;// init params
        this.handle = props.handle || function(){};
        this.value = props.value || '';
        this.width = props.width || 160;
    }

    state = {
        editable:false
    }

    blurInput = (event)=>{
        this.value = event.target.value;
    }

    clickSave = (event) => {
        this.setState({editable:false});
        //
        this.handle(this.value);
    }

    htmlLabel(){
        const sc = this;
        const { classes } = this.props;
        return (
            <div className={classes.auto_label} style={{width:sc.width+'px'}}>
                <div className={clsx("overflow-text")} style={{maxWidth:(sc.width-90)+'px'}}>{sc.value}</div>
                &nbsp;
                <Button
                        size="small"
                        color="primary"
                        className={classes.button}
                        onClick={()=>{sc.setState({editable:true})}} >
                    {intl.get('mod')}
                </Button>
            </div>
        )
    }

    htmlInput(){
        const sc = this;
        const { classes } = this.props;
        return (
            <div className={classes.auto_label} style={{width:sc.width+'px'}}>
                <div className={clsx("overflow-text")} style={{width:(sc.width-90)+'px',overflow:'hidden'}}>
                    <Input
                        defaultValue={sc.value}
                        className={clsx(classes.auto_input)}
                        inputProps={{'aria-label': 'description'}}
                        onBlur={(event)=>{sc.blurInput(event)}}
                        autoFocus={true}
                    />
                </div>
                <Button size="small" color="primary" className={classes.button} onClick={sc.clickSave}>{intl.get('save')}</Button>
            </div>
        )
    }

    render(){
        const sc = this;
        const { editable } = this.state;
        return editable ? sc.htmlInput() : sc.htmlLabel();
    }
}










const FormRule = {
    require:(one)=>{
        one._type = (!one.value || one.value.trim()=="")?"error":""
        one._label = "不能为空"
    },
    'name':function(one){
        one._type = /^[\da-zA-Z\-]*$/.test(one.value)?"":"error"
        one._label = "包含特殊符号"
    },
    numberOrNull:(one)=>{
        one._type = /^[\s0-9]*$/.test(one.value)?"":"error"
        one._label = "必须数字"
    },
    number:(one)=>{
        one._type = /^[0-9]+$/.test(one.value)?"":"error"
        one._label = "必须数字"
    },
    http:function(one){
        one._type = /^http\:\/\/.*/.test(one.value)?"":"error"
        one._label = "地址格式错误"
    },
    email:function(one){
        one._type = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(one.value)?"":"error"
        one._label = "邮箱格式错误"
    },
    'number+word':function(one){
        one._type = /^[\da-zA-Z]*$/.test(one.value)?"":"error"
        one._label = "只能为字母、数字"
    },
}
// form
const FormValid = function(column,error){
    let arr = column.valid || [];
    arr.every((v)=>{
        let fn = v;
        if(typeof v == "string"){
            fn = FormRule[v];
            fn(column);
            //
            if(column._type){// error
                error[column.name] = column._label;
            }else{
                delete error[column.name];
                delete column._label;
            }
        }else{
            fn(column,error);// error 为了可以设置所有错误信息
        }
        return !column._type;
    })
    return column;
}

@withStyles(selectStyles,checkedStyles)
class Form extends React.PureComponent{

    componentWillMount(){
        const { classes,id,handle,data,size,...props } = this.props;
        this.formProps = _.extend({fullWidth:true},props);
        this.size = size || 4;
        this.prefix = (id || "Form-simple")+'-';
        this.handle = handle || function(){};
        this.state.form = data;
    }

    state = {
        form:[],
        map:{},
        error:{}
    }

    getError = (all,length)=>{
        let { form,error } = this.state;
        if(all){
            if(Object.keys(error).length<1){
                form.map((v)=>{
                    FormValid(v,error)
                })
                this.forceUpdate();
            }
        }
        //
        if(length){
            return Object.keys(error).length
        }else{
            return error;
        }
    }

    getData = ()=>{
        return this.state.map;
    }

    setForm = (form)=>{
        this.setState({form:form})
    }

    setData = (data)=>{// 毫无用处
        let form = this.state.form;
        let $form = this.refs.$form;
        let oriData = _.extend(this.state.map,data);
        this.state.map = oriData;
        form.map((v)=>{
            if(v.name && oriData[v.name] !== void 0){
                $form.querySelector(`[name="${v.name}"]`).value = oriData[v.name];
            }
        })
    }

    changeInput(column){
        const sc = this;
        return (e)=>{
            sc.change(column,e.target.value)
        }
    }

    changeChecked(column){
        const sc = this;
        return (e)=>{
            sc.change(column,e.target.checked)
        }
    }

    change = (column,value)=>{
        const sc = this;
        let { map,error } = this.state;
        column.value = value;
        map[column.name] = column.value;
        FormValid(column,error);
        sc.forceUpdate();
    }

    template(column){
        let fn = this['html_'+(column.type||'input')];
        return fn && fn(column);
    }

    html_input = (column)=>{
        const { error } = this.state;
        let msg = error[column.name];
        let inputProps = _.extend({
            value:column.value||'',
            name:column.name||'',
            onChange:this.changeInput(column)
        },column.inputProps)
        //
        return (
            <>
                <CustomInput
                    error={msg}
                    labelText={column.label}
                    formControlProps={this.formProps}
                    inputProps={inputProps}
                />
            </>
        )
    }

    html_select = (column)=>{// { options:[{key,text},'']}
        const { classes,className } = this.props;
        const { error } = this.state;
        let msg = error[column.name];
        let options = column.options || [];
        let id = this.prefix + column.name;
        let inputProps = _.extend({
            name:column.name||'',
            onChange:this.changeInput(column)
        },column.inputProps)
        //
        return (
            <>
                <FormControl className={clsx(classes.selectFormControl,className)} {...this.formProps} error={Boolean(msg)} disabled={inputProps.disabled}>
                    <InputLabel
                        htmlFor="multiple-select"
                        className={classes.selectLabel}
                    >
                        {column.label}
                    </InputLabel>
                    <Select
                        value={column.value||''}
                        MenuProps={{
                          className: classes.selectMenu,
                          classes: { paper: classes.selectPaper }
                        }}
                        classes={{ select: classes.select}}
                        className={{top24:!column.label}}
                        inputProps={inputProps}
                        onChange={this.changeInput(column)}
                    >
                        <ListSubheader>{column.ListSubheader}</ListSubheader>
                        {
                            options.map((v)=>{
                                let key = v,text = v;
                                if(typeof v == 'object'){
                                    key = v.key;
                                    text = v.text
                                }
                                return (
                                    <MenuItem
                                        classes={{root: classes.selectMenuItem,selected: classes.selectMenuItemSelectedMultiple}}
                                        value={key}
                                        disabled={v.disabled}
                                    >
                                        {text}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                    <FormHelperText>{msg}</FormHelperText>
                </FormControl>
            </>
        )
    }

    html_textarea = (column)=>{
        const { error } = this.state;
        let msg = error[column.name];
        let { props } = this.props;
        props || (props = {rows:6});
        //
        return (
            <TextField variant="outlined" multiline fullWidth
                       label={column.label}
                       {...props}
                       value={column.value||''}
                       error={Boolean(msg)}
                       helperText={msg}
                       onChange={this.changeInput(column)}
            />
        )
    }

    html_checked = (column)=>{
        const { classes,className } = this.props;
        //
        return (
            <FormControlLabel
                control={
                    <Switch
                      checked={Boolean(column.value)}
                      onChange={this.changeChecked(column)}
                      value={column.name}
                      classes={{
                        switchBase: classes.switchBase,
                        checked: classes.switchChecked,
                        thumb: classes.switchIcon,
                        track: classes.switchBar
                      }}
                    />
                }
                style={{paddingTop:'16px'}}
                label={column.label}
            />
        )
    }

    render = ()=>{
        const sc = this;
        let map = this.state.map;
        // props { className:'small' }
        return (
            <div ref="$form">
                <GridContainer>
                    {
                        sc.state.form.map((v,i)=>{
                            map[v.name] = v.value;
                            return (
                                <GridItem className={v.className||''} xs={12} sm={v.size || sc.size} key={i}>
                                    {sc.template(v)}
                                </GridItem>
                            )
                        })
                    }
                </GridContainer>
            </div>
        )
    }
}

export default {
    AutoInput,
    EditLabel,
    EditLabel1,
    Form
}
