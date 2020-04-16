import React from 'react';
import clsx from 'clsx';
import {
    withStyles,Typography,Paper,IconButton,Divider,
} from '@material-ui/core';


import Graph from './flow'
import Icons from '@/components/Icons/icons.jsx'
import Drawer from '@/components/Dialog/Drawer.jsx'

const styles = theme => ({
    info:{
        width:'200px',
        margin:'8px',
        padding:'15px 20px 10px',
        color:"#ddd",
        borderRadius:'4px',
        backgroundColor:"rgba(37,42,47,.6)",
        '& .divider':{
            backgroundColor:'#888'
        },
        '& .text':{
            maxWidth:'65px',
            float:'right',
            color:'#ddd',
            fontWeight:600
        },
        '& .button':{
            float:'right',
            color:'#ddd',
            fontWeight:600
        },
        '& .toolbar':{
            height:'30px'
        },
        '& .link1':{
            color:'#ddd',
            padding:'0 3px',
            transition: 'transform .3s',
            fontWeight:600,
            display: 'inline-block'
        },
        '& .link1:hover':{
            transform:"translate3d(0, 1px, 0)"
        }
    },
    pod:{
        width:'280px',
        '& .label':{
            width:'55px'
        },
        '& .label-text':{
            width:'55px',
            color:'#ddd'
        }
    },
    drawer:{
        width:'360px',
        fontSize:'1rem',
        backgroundColor:"inherit"
    }
});

@withStyles(styles)
class Index extends React.PureComponent{
    state = {
        info:''
    }

    componentDidMount(){
        //this.
        this.clickGraph = _.debounce(this.clickGraph,200);
        this.renderGraph();
    }

    clickGraph = (name,e)=>{
        //console.log(name,e.event.tag)
        if(name=='pod_save'){
            //
            console.log("pod_save")
        }else{
            this.setState({
                info:name
            })
        }
    }

    clickDataVersion = ()=>{
        this.$version.onOpen({open:true})
    }

    clickItem = (item) =>{
        //History.push('/topology/deployment')
        this.refs.$create.onOpen({open:true,anchor:'bottom'}, <DeploymentT serviceData={item} handleClose={this.clickCreateClose} />)
    }

    clickItemClose = ()=>{
        this.refs.$create.onOpen({open:false});
    }

    htmlDiagram(){
        const { classes } = this.props;
        //<p>部署时间<span className="overflow-text text">2019.02.12</span></p>
        return (
            <div className={"diagram_info "+classes.info}>
                <b>服务详情</b>
                <p>版本<span className="overflow-text text">V 3.0.1</span></p>
                <p>操作人<span className="overflow-text text">Mr Ladeit</span></p>
                <p>pod数<span className="overflow-text text">4</span></p>
                <p>规则<span className="overflow-text text">yaml</span></p>
            </div>
        )
    }

    htmlVersion(){
        const { classes } = this.props;
        return (
            <div className={clsx("diagram_info",classes.info,classes.drawer)}>
                <Typography component="b" varint="h5">V 3.0.1</Typography>
                <p><Icons.BranchIcon />&nbsp;master&nbsp;&nbsp;&nbsp;&nbsp;<Icons.CommitIcon />&nbsp;8x7d6c5w</p>
                <Divider style={{backgroundColor:'#888'}}/>
                <p>V 2.0.1<a className="link1 button">选择替换</a></p>
                <p>V 1.0.1<a className="link1 button">滚动替换</a></p>
            </div>
        )
    }

    htmlPod(){
        const { classes } = this.props;
        return (
            <div className={clsx("diagram_info",classes.info,classes.pod)}>
                <div className="toolbar flex-r">
                    <div className="flex-box flex-center">-</div>
                    <Divider orientation="vertical" className="divider"/>
                    <div className="flex-box flex-center">-</div>
                    <Divider orientation="vertical" className="divider"/>
                    <div className="flex-box flex-center">-</div>
                </div>
                <Divider className="divider"/>
                <p><b className="link1" onClick={this.clickDataVersion} >V 3.0.1</b></p>
                <p>
                    <span className="label overflow-text">运行时长</span>: <span className="label-text overflow-text">1day</span>
                    <span className="label overflow-text">运行状态</span>: <span className="label-text overflow-text">正常</span>
                </p>
                <p>
                    <span className="label overflow-text">pod数</span>: <span className="label-text overflow-text">1/1</span>
                </p>
                <Divider className="divider"/>
                <p>
                    若测试成功, 你可 :<br/>
                    <span style={{paddingLeft:'2em',display:'inline-block'}}>
                        <span className="link1">滚动升级</span> 此版本至正式环境<br/>
                        部署此版本<span className="link1"> 绿色环境 </span>进行<span className="link1"> 蓝色发布 </span>通过<span className="link1"> ABTEST </span>进行更深度的用户试用.
                    </span>
                    若测试失败, 你可 :<br/>
                    <span style={{paddingLeft:'2em',display:'inline-block'}}>
                        <span className="link1"> 删除 </span> 此节点.
                    </span>
                </p>
            </div>
        )
    }

    renderGraph(){
        const { nodes,links } = this.props;
        this.dg = Graph(this);
        this.dg.loadModel(nodes,links)
    }

    render(){
        const { info } = this.state;
        return (
            <>
                <div className="diagram">
                    <div id="flow-diagram" style={{width:'100%', height:'100%', backgroundColor: 'inherit'}} ></div>
                    {info=='diagram'?this.htmlDiagram():''}
                    {info=='pod'?this.htmlPod():''}

                </div>
                <Drawer html={this.htmlVersion()} onRef={(ref)=>{this.$version = ref;}} elevation={0}/>
            </>
        )
    }
}

export default Index;


