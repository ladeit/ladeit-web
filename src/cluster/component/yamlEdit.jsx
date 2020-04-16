import React from 'react';
import ReactDOM from 'react-dom';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons'
import {
    withStyles,Typography,Button,IconButton,Divider,
    Dialog,DialogTitle,DialogContent,DialogActions
} from '@material-ui/core';

import Icons from '@/components/Icons/icons.jsx'
//import Icons from ''
import CodeMirror from '@/assets/lib/codemirror'
import Service from '../Service'
import intl from 'react-intl-universal'

const style = theme => ({
    root:{
        overflow:"auto"
    },
    moveIcon:{
        position:'absolute',
        bottom:0,
        left:0
    },
    window:{
        position: 'absolute',
        right: '16px',
        top: '16px',
        '& svg':{
            marginLeft:'4px'
        }
    }
})
let width = 700;
let height = 300;

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        this.state.title = this.props.title || intl.get('setting');
    }

    state = {
        title:"",
        open:false
    }

    onOpen = (params,yaml)=>{
        const sc = this;
        sc.setState({open:true,name:params.name,type:params.type})
        setTimeout(function(){
            sc.$editor = CodeMirror.fromTextArea(document.getElementById("code"), {lineNumbers: true});
            sc.$editor.setSize(width,height)
            if(yaml){// 编辑当前yaml
                sc.$editor.setValue(yaml)
            }else if(params.name){// 编辑请求yaml
                Service.namespaceYamlMap(params,(res)=>{
                    sc.$editor.setValue(res)
                })
            }else{// 无yaml且为新增
                sc.$editor.setValue('')
            }
            //
            // sc.bindMove();
        },120)
    }

    onCancel = (params)=>{
        this.setState({open:false})
    }

    bindMove(){// 废弃可拖动边框
        const sc = this;
        let el = document.getElementById("yamlEditMove");
        el.onkeydown = function(e){
            let px,py;
            _.drag(el,function(x,y){
                width = x - px;
                height = y - py;
                sc.forceUpdate();
            },function(x,y){
                px = x;
                py = y;
            })
        }
    }

    resizeWindow(w,h){
        const sc = this;
        return ()=>{
            width = w;
            height = h;
            sc.forceUpdate();
            sc.$editor.setSize(w,h)
        }
    }

    render = ()=>{
        const { classes,onOk,onOk_text } = this.props;
        const { open,title } = this.state;
        //<div className={classes.moveIcon} id="yamlEditMove"><ArrowBackIcon /></div>
        return (
            <Dialog open={Boolean(open)} onClose={this.onCancel} >
                <DialogTitle >
                    <Typography >{title}</Typography>
                    <div className={classes.window} >
                        <Icons.WindowIcon style={{width:'18px',fill:width==700?'#0027ff':'inherit'}} onClick={this.resizeWindow(700,300)}/>
                        <Icons.WindowIcon style={{width:'24px',fill:width==900?'#0027ff':'inherit'}} onClick={this.resizeWindow(900,500)} />
                        <Icons.WindowIcon style={{width:'30px',fill:width==1200?'#0027ff':'inherit'}} onClick={this.resizeWindow(1200,700)} />
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.root} style={{width:width+'px',height:height+"px"}} >
                        <textarea id="code" name="code" style={{borderColor:'rgba(255,255,255,0)'}}></textarea>
                    </div>
                </DialogContent>
                {
                    onOk && (
                        <DialogActions>
                            <Button onClick={this.onCancel} color="primary">{intl.get('close')}</Button>
                            <Button onClick={onOk} color="primary" autoFocus>{onOk_text||intl.get('save')}</Button>
                        </DialogActions>
                    )
                }
            </Dialog>
        )
    }
}

export default Index;
