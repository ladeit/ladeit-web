import React from 'react';
import clsx from 'clsx';
import {
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExistIcon,
} from '@material-ui/icons'
import {
    withStyles,IconButton,Button,
    AppBar,Tabs,Tab,TabContainer
} from '@material-ui/core'
import Icons from "../../components/Icons/icons.jsx"
import Inputs from "../../components/Form/inputs.jsx"
import TerminalFullTemp from "./terminal_full.jsx"
import AuthFilter from '@/AuthFilter'
let IS_TARGET = false;

const styles = theme => ({
    root: {
        height:"100%",
        position:"relative",
        "&.active":{
            width:"100%",
            position:'fixed',
        },
        "& .root-header":{
            backgroundColor:"#fafafa"
        },
        "& .root-box":{
            backgroundColor:"#212121",
            position:"relative"
        },
        "& .button-box":{
            padding:"2px 8px 0"
        },
        "& .root-terminal":{
            width:"100%",
            height:"100%",
            position:"absolute",
            left:0,
            top:0
        }
    },
    drag:{
        width: "100%",
        height: "8px",
        position: "absolute",
        top:"0",
        cursor:"row-resize",
        "& .dragIcon":{
            width:"28px",
            height:"3px",
            margin:"3px auto 0",
            backgroundColor:"#ddd"
        },
        "&:hover":{
            borderTop:"1px solid blue"
        },
        "&:hover .dragIcon":{
            backgroundColor:"blue"
        }
    },
    panel:{
        height:"100%"
    },
    tab:{
        display:"inline-block",
        marginTop:"1px",
        "& .tab":{
            height:"30px",
            padding:"2px 8px",
            boxSizing:"border-box",
            cursor:"pointer",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
        },
        "& .tab.selected":{
            color: "blue",
            borderBottom:"2px solid blue"
        },
        "& span":{
            padding:"2px 2px 2px 8px",
            display:"inline-block"
        },
        "& .icon":{
            lineHeight:"inherit",
            marginTop:"3px",
            "& svg":{
                width:"1rem"
            }
        }
    }
});

@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        this.loadParams();
        this.onClose = this.props.onClose;
    }

    loadParams(){
        this.initParams();
        //
        let pm = this.params;
        IS_TARGET = Boolean(pm.serviceId);
        if(!IS_TARGET){
            _.extend(pm,this.props.data)
        }
        //
        this.state.tabActive = pm.container;
        this.state.tabList = [{action:pm.container,text:pm.container}];
    }

    state = {
        fullscreen:false,
        height:360,
        tabActive:'',
        tabList:[]
    }

    onDrag(ev){
        const sc = this;
        const { height,tabList } = sc.state;
        let oh = height;
        let dom = document.getElementById("terminal-box");
        let max = document.documentElement.offsetHeight;
        let resize = _.debounce(()=>{
            tabList.map((v)=>{
                v.$ref && v.$ref.onResize();
            })
        },300)
        //
        window._.drag(ev,function(x,y){
            y = oh - y
            y > max && (y = max - 1)
            y < 100 && (y = 100)
            sc.state.height = y;
            dom.style.height = y + "px";
            //
            resize()
        })
    }

    clickFullscreen(){
        const sc = this;
        let tabList = sc.state.tabList;
        let elem;
        // 点击进入全屏 方法、
        let fullscreen=function(){
            elem=document.body;
            if(elem.webkitRequestFullScreen){
                elem.webkitRequestFullScreen();
            }else if(elem.mozRequestFullScreen){
                elem.mozRequestFullScreen();
            }else if(elem.requestFullScreen){
                elem.requestFullscreen();
            }else{
                //浏览器不支持全屏API或已被禁用
            }
        }
        // 点击退出全屏 方法
        let exitFullscreen=function(){
            var elem=document;
            if(elem.webkitCancelFullScreen){
                elem.webkitCancelFullScreen();
            }else if(elem.mozCancelFullScreen){
                elem.mozCancelFullScreen();
            }else if(elem.cancelFullScreen){
                elem.cancelFullScreen();
            }else if(elem.exitFullscreen){
                elem.exitFullscreen();
            }else{
                //浏览器不支持全屏API或已被禁用
            }
        }
        return (e)=>{
            var flag = (sc.state.fullscreen = !sc.state.fullscreen);
            flag ? fullscreen() : exitFullscreen();
            //
            sc.forceUpdate();
            //
            setTimeout(function(){
                tabList.map((v)=>{
                    v.$ref && v.$ref.onResize();
                })
            },120)
        }
    }

    clickClose(){
        const sc = this;
        return ()=>{
            if(IS_TARGET){
                window.close();
            }else{
                sc.onClose();
            }
        }
    }

    clickTargetLink(){
        const sc = this;
        const params = this.params;
        return ()=>{
            sc.onClose();
            window.open("http://"+ window.location.host + "/terminal?serviceId="+params.serviceId+"&name="+params.name+"&container="+params.container,"_blank");
            window.parent = null;
        }
    }

    clickTabClose(index) {
        let sc = this;
        let onClose = sc.clickClose();
        let { tabList,tabActive } = this.state;
        return (e)=> {
            let one = tabList[index];
            tabList.splice(index,1);
            //
            if (tabList.length < 1) {
                onClose();
            } else {
                if (one.action == tabActive) {
                    sc.state.selected = tabList[0].action;
                }
                sc.setState({tabList: tabList});
            }
        }
    }

    changeTab(value){
        const sc = this;
        return (e)=>{
            sc.setState({tabActive:value})
        }
    }

    htmlTab(){
        const scope = this;
        const {classes} = scope.props;
        const { tabActive,tabList } = this.state;
        return tabList.map(function(v,i){
            return (
                <div className={classes.tab} key={v.action}>
                    <div className={`tab ${v.action==tabActive?"selected":""}`} >
                        <span onClick={scope.changeTab(v.action)}>{v.text}</span>
                        <span className="icon"><CloseIcon onClick={scope.clickTabClose(v.action)} /></span>
                    </div>
                </div>
            )
        })
    }

    htmlTabContent(){
        const {classes} = this.props;
        const { tabActive,tabList } = this.state;
        const params = this.params;
        return tabList.map(function(v,i){
            return (
                <div className={`${classes.panel} ${v.action==tabActive?"":"hidden"}`} key={v.action}>
                    <TerminalFullTemp data={params} onRef={(ref)=>{v.$ref = ref;}}/>
                </div>
            )
        })
    }

    htmlButton(){
        let fullscreen = this.state.fullscreen;
        if(IS_TARGET){
            return (
                <div className="flex-one button-box" style={{position:"relative"}}>
                    <IconButton variant="contained" size="small" onClick={this.clickFullscreen()} >
                        {fullscreen?<FullscreenExistIcon />:<FullscreenIcon />}
                    </IconButton>
                </div>
            )
        }else{
            return (
                <>
                    <div className="flex-one button-box">
                        <IconButton variant="contained" size="small" style={{height:"28px"}} onClick={this.clickTargetLink()}><Icons.TargetLinkIcon /></IconButton>
                    </div>
                </>
            )
        }
    }

    render(){
        const {classes} = this.props;
        const { height } = this.state;
        let h = IS_TARGET ? '' : (height+'px');
        return (
            <div id="terminal-box" className={clsx('flex-c',classes.root,!h && 'active')} style={{height:h}}>
                <div className={classes.drag+" "+(IS_TARGET?"hidden":"")} onMouseDown={(e)=>{this.onDrag(e)}}>
                    <p className="dragIcon"></p>
                </div>
                <div className="flex-one root-header">
                    <div className="flex-r">
                        <div className="flex-one"></div>
                        <div className="flex-one">
                            {this.htmlTab()}
                        </div>
                        <div className="flex-box" style={{height:"30px"}}>
                        </div>
                        {this.htmlButton()}
                        <div className="flex-one button-box">
                            <IconButton variant="contained" size="small" onClick={this.clickClose()}><CloseIcon /></IconButton>
                        </div>
                    </div>
                </div>
                <div className="flex-box root-box">
                    {this.htmlTabContent()}
                </div>
            </div>
        )
    }
}

export default Index;
