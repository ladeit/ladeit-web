import React from 'react'
import {
    withStyles,Typography,IconButton,Button
} from '@material-ui/core'
import {Terminal} from 'xterm';
import * as attach from 'xterm/lib/addons/attach/attach';
import 'xterm/dist/xterm.css'

import Icons from '@/components/Icons/icons.jsx'
import hljs from 'highlight.js/lib/core';
import hljs_log from 'highlight.js/lib/languages/accesslog';
import 'highlight.js/styles/default.css';

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
        this.renderCode = _.debounce(this.renderCode,600,{maxWait:800});
        this.onEnter = _.debounce(this.onEnter,300);
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

    html = [];
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
        //
        _.delay(function(){
            if(user.token){
                let socket = new WebSocket(`ws://${host}/api/v1/log/${data.serviceId}/${data.name}/${data.container}`,[])
                sc.socket = socket;
                socket.onopen = function(event){
                    // TODO terminal - 异常处理
                    sc.setState({error:{text:'',loaded:true}})
                    // attach.attach(term, socket);
                }
                socket.onmessage = function (evt) {
                    var msg = evt.data;
                    if(!/^[\n\r]&/.test(msg)){
                        sc.html.push(msg);
                        sc.renderCode();
                    }
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

    onEnter = (e)=>{
        if(e.keyCode === 13){
            this.html.push('\n\r');
            this.renderCode();
        }
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

    renderCode = () => {
        let sc = this;
        let dom = sc.refs.$dom;
        if(sc.html.length > 500){
            sc.html.splice(0,sc.html.length - 500);
        }
        // separately require languages
        hljs.registerLanguage('log', hljs_log);
        dom.classList.add("log_pointer");
        dom.innerHTML = hljs.highlight('log', sc.html.join('')).value;
        //
        var parent = dom.closest(".root-box");
        parent.scrollTop = 1000000;
    }

    render = ()=> {
        const {classes} = this.props;
        const { error } = this.state;
        //
        return (
            <div className={classes.terminalBox}>
                <pre>
                    <code className="language-html" ref="$dom"></code>
                </pre>
                <div className={classes.info}>
                    { (error.loaded && error.text)  && <div className="message"><span>{error.text}，</span><span className="link1" onClick={()=>{this.initTerminal()}}>重连</span></div>}
                    { (!error.loaded && !error.text) && <Icons.Loading /> }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Index);
