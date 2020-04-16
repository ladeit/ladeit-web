import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import {Provider,observer,inject} from "mobx-react"
import {
    withStyles,Typography,Divider,Button,IconButton,Paper,
    TextField
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import DL from '@/static/store/CLUSTER_ADD.js'

const style = theme => ({
    paper:{
        padding:'16px 24px'
    },
    box:{
        width:"180px",
        lineHeight:'30px',
        '& .label':{
            width:'80px',
            lineHeight:'28px',
            padding:'8px 0'
        },
        '& .MuiTextField-root':{
            margin:0
        }
    },
    textField:{
        '& input':{
            textAlign:'right'
        }
    }
})

let flowValue = 0;

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        let { renderStep } = this.props;
        renderStep({type:'active'},'-');
        //
        flowValue = 0;
        this.config = DL.config();
    }

    state = {
        protocol:[
            {key:1,text:'http',memo:''},
            {key:2,text:'tcp',memo:''},
            {key:3,text:'tls',memo:''}
        ],
        flow:[
            {key:1,text:'流量分配',memo:''},
            {key:2,text:'匹配规则',memo:''}
        ],
    }

    clickListItem(name,v){
        const sc = this;
        let { renderStep } = this.props;
        let config = this.config.createStrategy;
        return ()=>{
            config[name] = v.key;
            sc.renderNextStep();
            sc.forceUpdate();
        }
    }

    renderNextStep = ()=>{
        let { renderStep } = this.props;
        let config = this.config.createStrategy;
        if(config.protocol && config.flow && (flowValue!==config.flow)){
            flowValue = config.flow;
            if(flowValue == 1){
                renderStep(false);
            }else{
                renderStep(false,"CreateStrategyRule");
            }
        }
    }

    render(){
        const { protocol,flow } = this.state;
        let { classes,serviceData } = this.props;
        let config = this.config.createStrategy;
        //
        return (
            <div className={classes.content} >
                <Typography variant="h5" className="split">协议</Typography>
                <br/>
                {
                    protocol.map((v) =>{
                        let active = v.key == config.protocol;
                        return <Icons.ItemT title={v.text} content={v.memo} active={active} onClick={this.clickListItem('protocol',v)}/>
                    })
                }
                <br/><br/>
                <Typography variant="h5" className="split">分流方式</Typography>
                <br/>
                {
                    flow.map((v) =>{
                        let active = v.key == config.flow;
                        return <Icons.ItemT title={v.text} content={v.memo} active={active} onClick={this.clickListItem('flow',v)}/>
                    })
                }
            </div>
        )
    }
}

export default Index;
