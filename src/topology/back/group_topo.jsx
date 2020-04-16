import React from 'react';
import {
    withStyles,Typography,Paper,IconButton,Divider,
} from '@material-ui/core';


import Graph from './flow'
import Icons from '@/components/Icons/icons.jsx'

const styles = theme => ({
    info:{
        width:'200px',
        margin:'8px',
        padding:'15px 20px 10px',
        color:"#ddd",
        borderRadius:'4px',
        backgroundColor:"rgba(37,42,47,.6)",
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
        }
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
        this.setState({
            info:name
        })
    }

    htmlPod(){
        const { classes } = this.props;
        return (
            <div className={"diagram_info "+classes.info}>
                <b>服务详情</b>
                <p>版本<span className="overflow-text text">V 3.0.1</span></p>
                <p>部署时间<span className="overflow-text text">2019.02.12</span></p>
                <p>操作人<span className="overflow-text text">Mr Ladeit</span></p>
                <p>pod数<span className="overflow-text text">4</span></p>
                <p>规则<span className="overflow-text text">yaml</span></p>
            </div>
        )
    }

    htmlVersion(){
        const { classes } = this.props;
        return (
            <div className={"diagram_info "+classes.info}>
                <b>V 3.0.1</b>
                <p><Icons.BranchIcon />&nbsp;master&nbsp;&nbsp;<Icons.CommitIcon />&nbsp;8x7d6c5w</p>
                <Divider style={{backgroundColor:'#888'}}/>
                <p>V 2.0.1<a className="link2 button">选择替换</a></p>
                <p>V 1.0.1<a className="link2 button">滚动替换</a></p>
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
            <div className="diagram">
                <div id="flow-diagram" style={{width:'100%', height:'100%', backgroundColor: 'inherit'}} ></div>
            </div>
        )
    }
}

export default Index;


