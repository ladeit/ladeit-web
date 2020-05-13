import React from 'react'
import {
    withStyles,Typography,IconButton,Button
} from '@material-ui/core'
import {Terminal} from 'xterm';
import * as attach from 'xterm/lib/addons/attach/attach';
import 'xterm/dist/xterm.css'

import Icons from '@/components/Icons/icons.jsx'

const styles = theme => ({
    root: {
        height: "100%",
        backgroundColor: "#000 !IMPORTANT",
        "& .xterm":{
            padding:"8px",
            boxSizing: "border-box"
        }
    },
    terminalBox:{
        position:'relative',
        height:'100%'
    },
    info:{
        width: "100%",
        textAlign: 'center',
        position: 'absolute',
        top: 0,
        zIndex:1000,
        "& .message":{
            color: 'rgba(0,0,0,.8)',
            width: '120px',
            margin: '16px auto',
            background: '#d6d6d6',
            padding: '8px',
        }
    }
});

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        const onRef = this.props.onRef;
        onRef && onRef(this);
        this.state.error = {loaded:false};
    }

    componentDidMount(){
        const sc = this;
        setTimeout(function(){
            sc.initTerminal()
            sc.onResize()
        },100)
    }

    componentWillUnmount(){
        // 销毁资源
        this.term && this.term.destroy()
        this.socket && this.socket.close()
    }

    state = {
        error: {loaded:false} // {text:''}
    }

    initData(){
        this.socket && this.socket.close();
        this.term && this.term.destroy();
        this.setState({error:'',loaded:false});
    }

    initTerminal(){
        const sc = this;
        const {data} = this.props;
        sc.initData();
        let dom = sc.refs.$dom;
        let host = window.WSIP;
        let user = _.local("user");
        let term = this.term = new Terminal({});
        term.open(dom);
        //
        _.delay(function(){
            if(user.token){
                let socket = new WebSocket(`ws://${host}/api/v1/log/${data.serviceId}/${data.name}/${data.container}`,[])
                sc.socket = socket;
                socket.onopen = function(event){
                    // TODO terminal - 异常处理
                    sc.setState({error:{text:'',loaded:true}})
                    attach.attach(term, socket);
                }
                socket.onerror = function(){
                    sc.setState({error:{text:'连接失败',loaded:true}})
                }
                socket.onclose = function(){
                    sc.setState({error:{text:'连接已关闭',loaded:true}})
                }
            }
        },100)
    }

    onResize(){// 17 * 18
        const sc = this;
        const dom = document.getElementById("terminal-box");
        if(sc.term){
            let w = Math.floor((dom.offsetWidth - 16)/9);
            let h = Math.floor((dom.offsetHeight - 44)/17);
            sc.term.resize(w,h);
        }
    }

    render = ()=> {
        const {classes} = this.props;
        const { error } = this.state;
        //
        return (
            <div className={classes.terminalBox}>
                <div className={classes.root} ref="$dom" ></div>
                <div className={classes.info}>
                    { (error.loaded && error.text)  && <div className="message"><span>{error.text}，</span><span className="link1" onClick={()=>{this.initTerminal()}}>重连</span></div>}
                    { (!error.loaded && !error.text) && <Icons.Loading /> }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Index);
