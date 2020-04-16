import React from 'react';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {
    withStyles,Typography,Paper,Button,IconButton,Grid,
    Dialog,DialogTitle,DialogContent,DialogActions,Input,InputAdornment,TextField,Switch
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import TagsInput from "react-tagsinput";
import RuleTagsT from '../components/pod_topo_tag'
import RedirectTagsT from '../components/pod_topo_redirect_tag'

const tabs = [
    {name:'rule',text:"匹配规则"},
    {name:'default',text:"高级"}
]
let ruleTabs = [
    {name:'redirect',text:'重定向'},
    {name:'try',text:'重试'},
    {name:'rewrite',text:'重写'},
    {name:'cos',text:'跨域'},
    {name:'header',text:'Header'}
]
const style = theme => ({
    root:{
        overflow:"auto",
        width:'680px',
        minHeight:'280px'
    },
    paper:{
        padding:'16px 24px'
    },
    box:{
        lineHeight:'30px',
        '& .label':{
            width:'80px',
            lineHeight:'28px',
            padding:'8px 0'
        },
        '& .MuiTextField-root':{
            margin:0
        },
        '& b':{
            //marginRight:'8px'
        }
    },
    textField:{
        '& input':{
            textAlign:'right'
        }
    },
    tab:{
        width:'90px',
        display:'inline-block',
        fontSize:'1.1rem',
        fontWeight:'400',
        transition:'all .5s',
        cursor:'pointer',
        overflow:'auto',

        '&.active':{
            // fontSize:'1.2rem',
            fontWeight:'600'
        }
    },
    row:{
        padding:'8px 0',
        display:'flex',
        alignItems:'center',
        '&>.label':{
            width:'124px',
            fontSize:'.8rem',
            color:'#546e7a',
            display: 'inline-block'
        },
        "& .closeIcon":{
            color:'rgba(0, 0, 0, 0.54)',
            fontSize:'1rem',
            cursor:'pointer'
        },
        "& .addIcon":{
            margin:'0 8px'
        }
    },
    subrow:{
        padding:'4px 0 4px 24px',
        '&>.label':{
            width:'100px',
            fontSize:'.8rem',
            color:'#546e7a',
            display: 'inline-block'
        },
        "& input":{
            padding:'4px 0'
        }
    },
    subcontent:{
        padding:'16px 24px',
        margin:'2px',
        position:'relative',
        '& .closeIcon':{
            position:'absolute',
            top:'10px',
            right:'10px'
        }
    }
})

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        this.onOk = this.props.onOk;
    }

    state = {
        open:false,
        tabValue:'rule',
        // [[{type:'uri',expression:'prefix',value:'xx'},{type:'uri',expression:'prefix',value:'22'}]]}
        hasServerLink:false,
        hasHeaders:false,
        hasCorsPolicy:false,
        flow:{
            rule:[],
            redirect:'',// 重定向
            rewrite:'',// 重写
            retries:'', // 重试
            headers:[],// header
            error:[],// 失败注入
            _value:[],
        }
    }

    onOpen = ({data,...options})=>{
        //
        let flow = _.cloneDeep(data);
        flow._value = [];
        flow.rule.map(function (v) {
            let arr = [];
            v.stringMatch.map(function (vv) {
                arr.push(vv)
            })
            flow._value.push(arr)
        });
        this.state.hasHeaders = Boolean(flow.headers);
        this.state.hasCorsPolicy = Boolean(flow.corsPolicy);
        flow.corsPolicy = _.extend({'allowOrigin':[],"allowMethods":[],"allowHeaders":[],"exposeHeaders":[],"maxAge":"","allowCredentials":false},flow.corsPolicy);
        flow.headers = _.extend({set:[],add:[],remove:[]},flow.headers); // flow.headers || (flow.headers = []);
        flow.error || (flow.error = []);// flow.error || (flow.error = []);
        this.state.open = true;
        this.state.hasServerLink = options.hasServerLink;
        this.state.flow = flow;
        this.forceUpdate();
    }

    onCancel = ()=>{
        this.setState({open:false})
    }

    changeInput(name,pos){
        const sc = this;
        return (e)=>{
            let data = sc.state.flow;
            if(pos){
                data = data[pos];
            }
            data[name] = e.target.value;
            sc.forceUpdate();
        }
    }

    changeTags(name){
        const sc = this;
        return (regularTags)=>{
            let flow = sc.state.flow;
            flow[name] = regularTags || null;
            sc.forceUpdate();
        }
    }

    changeHeadersTags(name){
        const sc = this;
        return (regularTags)=>{
            let flow = sc.state.flow;
            if(regularTags.length && ['remove'].indexOf(name)==-1){
                let str = regularTags[regularTags.length-1];
                if(str.indexOf(':')==-1){
                    window.Store.notice.add({text:'键 / 值用冒号分割. ',type:'warning'})
                    return;
                }
            }
            flow.headers[name] = regularTags;
            sc.forceUpdate();
        }
    }

    changeCosTags(pos,name){
        const sc = this;
        return (tags)=>{
            let data = sc.state.flow[pos];
            if(tags.length<1){
                //
            }else if(["allowHeaders","exposeHeaders"].indexOf(name)>-1){
                let str = tags[tags.length-1];
                if(str.indexOf(':')==-1){
                    window.Store.notice.add({text:'键 / 值用冒号分割. ',type:'warning'})
                    return;
                }
            }else if(["allowMethods"].indexOf(name)>-1){
                tags = tags.map(function (v) {return v.toLocaleUpperCase()})
            }
            data[name] = tags;
            sc.forceUpdate();
        }
    }

    changeChecked(name){
        const sc = this;
        return (e)=>{
            let data = sc.state.flow;
            data.corsPolicy[name] = e.target.checked;
            sc.forceUpdate();
        }
    }

    clearInput(name){
        const sc = this;
        return (e)=>{
            let flow = sc.state.flow;
            flow[name] = "";
            sc.forceUpdate();
        }
    }

    clickSave(){
        const sc = this;
        return ()=>{
            //
            let { hasHeaders,hasCorsPolicy } = sc.state;
            let {_value,_rule,...flow} = sc.state.flow;
            let rule = [];
            _value.map(function (arr) {
                let one = {name:'',stringMatch:[]}
                arr.map(function (v) {
                    one.stringMatch.push(v)
                })
                rule.push(one)
            })
            flow.rule = rule;
            if(!hasHeaders){
                flow.headers = null;
            }
            if(!hasCorsPolicy){
                flow.corsPolicy = null;
            }
            //flow.
            sc.onOk(flow);
        }
    }

    tabChange(name){
        const sc = this;
        return ()=>{
            sc.setState({tabValue: name});
        }
    }

    subMenuChange(name){
        const sc = this;
        return ()=>{
            sc.state[name] = !sc.state[name];
            sc.forceUpdate();
        }
    }

    clickListItem(name,v){
        const sc = this;
        //let { renderStep,deploymentStore:{createStrategy} } = this.props;
        let { renderStep} = this.props;
        let config = this.config.createStrategy;
        return ()=>{
            config[name] = v.key;
            sc.forceUpdate();
        }
    }

    htmlTypeFlow(){
        const { classes } = this.props;
        const { flow,tabValue } = this.state;
        // <div className="">继承规则：<RuleTagsT data={flow._rule} disabled={true}/> {flow._rule.length>0||'无'}</div><br/>
        return (
            <div>
                <div className={classes.ruleContent} >
                    匹配规则：<RuleTagsT data={flow} />
                </div>
            </div>
        )
    }

    htmlRuleFlow(){
        const sc = this;
        const { classes } = this.props;
        const { flow,hasServerLink,hasHeaders,hasCorsPolicy } = this.state;
        const disabled_redirect =  (hasServerLink && '已有流量分配，不可以设置重定向.') || (flow.rewrite && "重写 / 重定向 互斥 ，不能同时设置.");
        const disabled_rewrite =  (hasServerLink && '已有流量分配，不可以设置重写.') || (flow.redirect && "重定向 / 重写互斥 ，不能同时设置.");
        /*<Input placeholder="" endAdornment={<CloseIcon className="closeIcon" />} value={flow.redirect}/>*/
        /*<IconButton size="small" color="primary" className="addIcon"><AddCircleIcon /></IconButton>*/
        return (
            <>
                <div className={classes.row}>
                    <div className="label" >重定向</div>
                    <RedirectTagsT data={flow.redirect} handle={this.changeTags('redirect')} disabled={disabled_redirect}/>
                </div>
                <div className={classes.row}>
                    <div className="label" >重写</div>
                    <RedirectTagsT data={flow.rewrite} handle={this.changeTags('rewrite')} type="rewrite" disabled={disabled_rewrite}/>
                </div>
                <div className={classes.row}>
                    <div className="label" >重试</div>
                    <RedirectTagsT data={flow.retries} handle={this.changeTags('retries')} type="retries"/>
                </div>
                <div className={classes.row}>
                    <div className="label" >RequestHeader</div>
                    { hasHeaders || <IconButton size="small" onClick={sc.subMenuChange('hasHeaders')}><AddCircleIcon /></IconButton> }
                </div>
                {
                    hasHeaders && (
                        <Paper className={classes.subcontent}>
                            <IconButton className="closeIcon" size="small" onClick={sc.subMenuChange('hasHeaders')}><CloseIcon /></IconButton>
                            <div className={classes.subrow}>
                                <div className="label" >set</div><TagsInput addOnBlur={true} value={flow.headers.set} onChange={this.changeHeadersTags('set')}  tagProps={{ className: "react-tagsinput-tag info" }} inputProps={{placeholder:'输入\'key:value\'回车'}}/>
                            </div>
                            <div className={classes.subrow}>
                                <div className="label" >add</div><TagsInput addOnBlur={true} value={flow.headers.add} onChange={this.changeHeadersTags('add')}  tagProps={{ className: "react-tagsinput-tag info" }} inputProps={{placeholder:'输入\'key:value\'回车'}}/>
                            </div>
                            <div className={classes.subrow}>
                                <div className="label" >remove</div><TagsInput addOnBlur={true} value={flow.headers.remove} onChange={this.changeHeadersTags('remove')}  tagProps={{ className: "react-tagsinput-tag info" }} inputProps={{placeholder:'输入key'}}/>
                            </div>
                        </Paper>
                    )
                }

                <div className={classes.row}>
                    <div className="label" >跨域</div>
                    { hasCorsPolicy || <IconButton size="small" onClick={sc.subMenuChange('hasCorsPolicy')} ><AddCircleIcon /></IconButton> }
                </div>
                {
                    hasCorsPolicy && (
                        <Paper className={classes.subcontent}>
                            <IconButton className="closeIcon" size="small" onClick={sc.subMenuChange('hasCorsPolicy')}><CloseIcon /></IconButton>
                            <div className={classes.subrow}>
                                <div className="label" >allowOrigin</div><TagsInput addOnBlur={true} value={flow.corsPolicy['allowOrigin']||[]} onChange={this.changeCosTags("corsPolicy",'allowOrigin')}  tagProps={{ className: "react-tagsinput-tag info" }} inputProps={{placeholder:'输入域名'}}/>
                            </div>
                            <div className={classes.subrow}>
                                <div className="label" >allowMethods</div><TagsInput addOnBlur={true} value={flow.corsPolicy['allowMethods']||[]} onChange={this.changeCosTags("corsPolicy",'allowMethods')}  tagProps={{ className: "react-tagsinput-tag info" }} inputProps={{placeholder:'输入请求方法'}}/>
                            </div>
                            <div className={classes.subrow}>
                                <div className="label" >allowHeaders</div><TagsInput addOnBlur={true} value={flow.corsPolicy['allowHeaders']||[]} onChange={this.changeCosTags("corsPolicy",'allowHeaders')}  tagProps={{ className: "react-tagsinput-tag info" }} inputProps={{placeholder:'输入\'key:value\'回车'}}/>
                            </div>
                            <div className={classes.subrow}>
                                <div className="label" >exposeHeaders</div><TagsInput addOnBlur={true} value={flow.corsPolicy['exposeHeaders']||[]} onChange={this.changeCosTags("corsPolicy",'exposeHeaders')}  tagProps={{ className: "react-tagsinput-tag info" }} inputProps={{placeholder:'输入\'key:value\'回车'}}/>
                            </div>
                            <div className={classes.subrow}>
                                <div className="label" >maxAge</div><Input placeholder="输入过期时间" value={flow.corsPolicy.maxAge} onChange={this.changeInput('maxAge',"corsPolicy")} type="number" endAdornment={<InputAdornment position="end">s</InputAdornment>}/>
                            </div>
                            <div className={classes.subrow}>
                                <div className="label" >allowCredentials</div><Switch size="small" checked={Boolean(flow.corsPolicy.allowCredentials)} onClick={this.changeChecked('allowCredentials')} />
                            </div>
                        </Paper>
                    )
                }

                <div className={classes.row}>
                    <div className="label" >失败注入</div>
                    <TagsInput addOnBlur={true} value={flow.error} onChange={this.changeTags('error')}  tagProps={{ className: "react-tagsinput-tag info" }} inputProps={{placeholder:'输入注入失败信息'}}/>
                </div>
            </>
        )
    }

    render = ()=>{
        const sc = this;
        const { classes } = this.props;
        const { open,flow,tabValue } = this.state;
        //window.sc = this;
        return (
            <Dialog open={Boolean(open)} onClose={()=>{this.onOk(false)}} >
                <DialogTitle >
                    {
                        tabs.map(function (one,i) {
                            return <span className={clsx(classes.tab,tabValue!=one.name||'active')} onClick={sc.tabChange(one.name)} key={i}>{one.text}</span>
                        })
                    }
                </DialogTitle>
                <DialogContent>
                    <div className={classes.root} >
                        {tabValue!="rule" || this.htmlTypeFlow()}
                        {tabValue!="default" || this.htmlRuleFlow()}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{this.onOk(false)}} color="primary">取消</Button>
                    <Button onClick={this.clickSave()} color="primary" autoFocus>确认</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default Index;
