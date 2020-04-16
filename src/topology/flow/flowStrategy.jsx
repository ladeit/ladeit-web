import React from 'react';
import ReactDOM from 'react-dom';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons'
import {
    withStyles,Typography,Button,IconButton,Divider,
    Dialog,DialogTitle,DialogContent,DialogActions,
    FormControlLabel,TextField,Checkbox
} from '@material-ui/core';

import Icons from '@/components/Icons/icons.jsx'
//import Icons from ''
import CodeMirror from '@/assets/lib/codemirror'

const style = theme => ({
    root:{
        overflow:"auto"
    },
    row:{
        padding:'8px 0 8px',
        alignItems:'flex-end',

        '& .input':{
            width:'100px',
            padding:'0 16px',

            '&>div':{
                margin:0
            },
            '& input':{
                padding:'2px 0'
            }
        },

        '& .percent':{
            width:'60px',
        }
    },
    node_panel:{
        minWidth:'310px',
        padding:'8px 0',
        bottom:'10px',

        '& .title':{
            padding:'8px',
            color:'rgba(255,255,255,.9)'
        },
    }
})

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        this.onOk = this.props.onOk;
    }

    componentDidMount(){}

    bindKeydown = ()=>{
        const sc = this;
        setTimeout(function(){
            let dom = document.getElementById("form_flow_stragegy")
            if(dom){
                dom.onkeydown = function(e){
                    if(e.keyCode==13){
                        sc.clickSave();
                    }
                    e.stopPropagation();
                }
            }
        },1000)
    }

    state = {
        open:false,
        autoSet:true,
        selLink:{source:{text:' 一 '}},
        selNodeLink:[],
        selNodeLinkWeight:0
    }

    onOpen = (data,yaml)=>{
        const sc = this;
        sc.setState({
            open:true,
            selLink:data.selLink,
            selNodeLink:data.selNodeLink,
            selNodeLinkWeight:data.selNodeLinkWeight
        })
        sc.bindKeydown();
    }

    onCancel = ()=>{
        this.setState({open:false})
    }

    clickSave = ()=>{
        const sc = this;
        let value = 0;
        sc.state.selNodeLink.map(function(one){
            if(one.weight_text){
                value += one.weight_text;
            }
        })
        if(value==0 || value==100){
            sc.onOk(true);
        }else{
            window.Store.notice.add({text:'总权值必须等于100',type:'warning'})
        }
    }

    clickAutoSet(){
        const sc = this;
        return ()=>{
            sc.setState({autoSet: !sc.state.autoSet})
        }
    }

    changeInput = (row,index)=>{// {weight_text:'',source:{},target:{}}
        const sc = this;
        const selNodeLink = this.state.selNodeLink;
        const autoFn = _.throttle(function (val) {
            if(selNodeLink.length>1){
                autoSetValue(selNodeLink,index)(100 - val)
                sc.state.selNodeLinkWeight = 100;
                sc.forceUpdate();
            }else{
                row.weight_text = 100;
                sc.state.selNodeLinkWeight = 100;
                sc.forceUpdate();
            }
        },2000);
        //
        return (e)=>{
            let autoSet = sc.state.autoSet;
            let val = parseInt(e.target.value-0);
            (val > 100) && (val = 100);
            if(val){
                sc.state.selNodeLinkWeight += val - row.weight_text;
                row.weight_text = val;
            } else {
                sc.state.selNodeLinkWeight -= row.weight_text;
                row.weight_text = 0;
            }
            if(autoSet){
                autoFn(val);
                sc.forceUpdate();
            }else{
                sc.forceUpdate();
            }
        }
    }

    render = ()=>{
        const { classes } = this.props;
        const { open,autoSet,selLink,selNodeLink,selNodeLinkWeight } = this.state;
        let selNode = selLink.source;
        //window.ss = this;
        return (
            <Dialog open={Boolean(open)} onClose={()=>{this.onOk(false)}}>
                <DialogTitle >
                    <Typography variant="h5" component="div">流量策略</Typography>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.node_panel} id="form_flow_stragegy" >
                        {
                            selNodeLink.map((one,index)=>{
                                let text = one.weight_text || '';
                                return (
                                    <div className={"flex-r gray "+classes.row} key={index} >
                                        <div className="flex-box flex-middle">{one.target.text} 权重值 {one.active?<span className="status_success">&nbsp;✔&nbsp;️</span>:''} : </div>
                                        <div className="flex-one input"><TextField margin={'dense'} inputProps={{autoFocus:one.active}} value={text} onChange={this.changeInput(one,index)} /></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Typography variant="body2" component="span" style={{padding:'0 16px',flex:'auto'}}>
                        <FormControlLabel
                            control={<Checkbox checked={autoSet} onChange={this.clickAutoSet()} />}
                            label="自动平分流量值"
                        />
                    </Typography>
                    <Button onClick={()=>{this.onOk(false)}} color="primary">取消</Button>
                    <Button onClick={this.clickSave} color="primary" autoFocus>确认</Button>
                </DialogActions>
            </Dialog>
        )
    }
}


function getPercentage(val,all){
    return `${parseInt(val/(all||1) * 10000) / 100}%`;
}

let selNodeIndex = -1;
function autoSetValue(selNodeLink,index){
    // autoSetValue.index autoSetValue.map
    if(selNodeIndex != index){// 比例缓存
        selNodeIndex = index;
        let max = 0;// 计算当前集合权值总和
        //
        selNodeLink.forEach(function (v,i) {
            if(i!==index){
                max += v.weight_text - 0;
            }
        });
        selNodeLink.forEach(function (v,i) {
            if(i!==index){
                if(max){
                    v.weight_text_ratio = v.weight_text/max;
                }else{
                    v.weight_text_ratio = 1/(selNodeLink.length - 1);
                }
            }
        });
    }
    //
    return (size)=>{
        let sizeMax = 0;// 已经计算：和值
        let sizeIndex = 0;// 已经计算：个数
        (size > 100 || size < 0) && (size = 0);
        //
        selNodeLink.forEach(function (v,i) {
            let length = selNodeLink.length-1;
            let val = 0;
            //
            if(i!==index){
                sizeIndex++;//
                if(sizeIndex==length){// 最后一位取差值
                    val = size - (sizeMax||0);
                    v.weight_text = val;
                }else{
                    val = Math.floor(v.weight_text_ratio * size);
                }
                sizeMax += val;
                v.weight_text = val;
            }
        })
    }
}

export default Index;
