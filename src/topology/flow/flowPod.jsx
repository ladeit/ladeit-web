import React from 'react';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import {
    withStyles,Typography,Button,IconButton,Divider,Paper,
    Dialog,DialogTitle,DialogContent,DialogActions,Input,Switch
} from '@material-ui/core'
import TagsInput from "react-tagsinput";

const tabs = [
    {name:'info',text:"发布信息"},
    {name:'setting',text:"节点设置"}
]
const style = theme => ({
    root:{
        overflow:"auto",
        width:'480px',

        "& .react-tagsinput":{
            minWidth:'146px',
            //borderBottom:"1px solid #d2d2d2",
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
    info:{
        '& .divider':{
            backgroundColor:'#e8e8e8'
        },
        '& .text':{
            maxWidth:'65px',
            float:'right',
            fontWeight:600
        },
        '& .label-text':{
            width:'80px'
        },
        '& .label':{
            width:'80px'
        },
        '& .button':{
            float:'right',
            fontWeight:600
        },
        '& .toolbar':{
            height:'50px',
            textAlign:'center'
        },
        '& .link1':{
            padding:'0 3px',
            transition: 'transform .3s',
            fontWeight:600,
            display: 'inline-block'
        },
        '& .link1:hover':{
            transform:"translate3d(0, 1px, 0)"
        }
    },
    row:{
        padding:'8px 0',
        '& label':{
            width:'100px',
            fontSize:'.8rem',
            color:'#546e7a',
            display: 'inline-block'
        },
        "& .closeIcon":{
            color:'rgba(0, 0, 0, 0.54)',
            fontSize:'1rem',
            cursor:'pointer'
        },
        '& .react-tagsinput:first-child':{
            marginLeft:'0'
        }
    },
    subrow:{
        padding:'4px 0 4px 24px',
        '&>label':{
            width:'100px',
            fontSize:'.8rem',
            color:'#546e7a',
            display: 'inline-block'
        },
        "& input":{
            padding:'4px 0'
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
        tabValue:'info',
        data:{text:' 一 ',headers:''}
    }

    onOpen = (options)=>{
        options = _.cloneDeep(options);
        options.open = true;
        options.data.headers || (options.data.headers = {set:[],add:[],remove:[]})
        _.extend(this.state,options);
        this.forceUpdate();
    }

    onCancel = ()=>{
        this.setState({open:false})
    }

    changeTags(name){
        const sc = this;
        return (regularTags)=>{
            let data = sc.state.data;
            data[name] = regularTags;
            sc.forceUpdate();
        }
    }

    changeHeadersTags(pos,name){
        const sc = this;
        return (tags)=>{
            let data = sc.state.data[pos];
            if(tags.length && ['allowOrigin',"allowMethods"].indexOf(name)==-1){
                let str = tags[tags.length-1];
                if(str.indexOf(':')==-1){
                    window.Store.notice.add({text:'键/值用冒号分割. ',type:'warning'})
                    return;
                }
            }
            data[name] = tags;
            sc.forceUpdate();
        }
    }

    clearInput(name){
        const sc = this;
        return (e)=>{
            let data = sc.state.data;
            data[name] = "";
            sc.forceUpdate();
        }
    }

    tabChange(name){
        const sc = this;
        return ()=>{
            sc.setState({tabValue: name});
        }
    }

    clickSave(){
        const sc = this;
        return ()=>{
            sc.onOk(sc.state.data)
        }
    }

    htmlDeployment(){
        const { classes } = this.props;
        return (
            <div className={clsx("diagram_info",classes.info,classes.pod)}>
                <p>
                    <span className="label overflow-text">运行时长</span>: <span className="label-text overflow-text">1day</span>
                    <span className="label overflow-text">运行状态</span>: <span className="label-text overflow-text">正常</span>
                </p>
                <p>
                    <span className="label overflow-text">pod数</span>: <span className="label-text overflow-text">1/1</span>
                </p>
                <Divider className="divider"/>
                <div style={{lineHeight:'1.5rem'}} >
                    <p>若测试成功, 你可 :</p>
                    <span style={{paddingLeft:'2em',display:'inline-block'}}>
                        <span className="link1">滚动升级</span> 此版本至正式环境<br/>
                        部署此版本<span className="link1"> 绿色环境 </span>进行<span className="link1"> 蓝色发布 </span>&nbsp;
                        <br/>
                        或通过<span className="link1"> ABTEST </span>进行更深度的用户试用.
                    </span>
                    <p>若测试失败, 你可 :</p>
                    <span style={{paddingLeft:'2em',display:'inline-block'}}>
                        <span className="link1" onClick={()=>{this.onOk('delete')}}> 删除 </span> 此节点.
                    </span>
                </div>
            </div>
        )
    }


    htmlSetting(){
        const sc = this;
        const { classes } = this.props;
        const { data } = this.state;
        const cosArr = ['allowOrigin',"allowMethods","allowHeaders","exposeHeaders"]//"maxAge","allowCredentials"
        const headersArr = ['set','add','remove']
        return (
            <>
                <div className={classes.row}><label>RequestHeader</label></div>
                {
                    headersArr.map(function (name,i) {
                        return (
                            <div className={classes.subrow} key={i}>
                                <label>{name}</label><TagsInput addOnBlur={true} value={data.headers[name]||[]} onChange={sc.changeHeadersTags("headers",name)}  tagProps={{ className: "react-tagsinput-tag info" }} inputProps={{placeholder:'输入\'key:value\'回车'}}/>
                            </div>
                        )
                    })
                }
            </>
        )
    }



    render = ()=>{
        const sc = this;
        const { classes } = this.props;
        const { open,data,tabValue } = this.state;
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
                        {tabValue!="info" || this.htmlDeployment()}
                        {tabValue!="setting" || this.htmlSetting()}
                    </div>
                </DialogContent>
                <DialogActions>
                    {tabValue!="setting" || (
                        <>
                            <Button color="primary" onClick={()=>{this.onOk(false)}}>取消</Button>
                            <Button color="primary" onClick={this.clickSave()}>确认</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        )
    }
}

export default Index;
