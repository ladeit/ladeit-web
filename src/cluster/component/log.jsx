import React from 'react';
import clsx from 'clsx';
import {
    Close as CloseIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExistIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from '@material-ui/icons'
import {
    withStyles,makeStyles,IconButton,Button,Tooltip,
    AppBar,Tabs,Tab,TabContainer
} from '@material-ui/core'
//
import Icons from "../../components/Icons/icons.jsx"
import Inputs from "../../components/Form/inputs.jsx"
import TerminalFullCom from "./log_full.jsx"
import SelectTerminalCom from "./terminal_mutiple_list"


const useStyles = makeStyles(theme => ({
    root:{
        height:"100%",
        position:"relative",
        "&.active":{
            width:"100%",
            position:'fixed',
        },
        "& .root-header":{
            paddingTop:'3px',
            backgroundColor:"#fafafa"
        },
        "& .root-box":{
            //backgroundColor:"#212121",
            position:"relative",
            padding:'16px 8px',
            overflow:'auto'
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
    showScroll:{
        '& .scroll_box':{
            position:'relative',
            overflow:'hidden'
        },
        '& .scroll_body':{
            whiteSpace:'nowrap',
            position:'absolute',
            transition:'transform 1.2s'
        },
        '& .icon_button':{
            padding:'0 6px',
            display:'none',
            cursor:'pointer',
            '& svg:hover':{
                transform:'scale(1.3)'
            }
        },
        '&.show .icon_button':{
            display:'inherit',
        },
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
    tab:{
        display:'inline-block',
        '& .tab':{
            height:'30px',
            padding:'0 8px',
            cursor:'pointer',
            borderBottom: "2px solid white",
            '& span':{padding:'5px'}
        },
        '& .tab.selected':{
            color: "blue",
            borderBottom: "2px solid blue",
        },
        '& .closeIcon':{
            width:"1rem",
            lineHeight:"inherit",
            marginLeft:"8px"
        }
    }
}))

let config = {
    tabs:[],
    scrollPos:0
}

function Panel(props){
    //const list = props.list; // {deploy:'buzzy-git-ms-5662',pod:'buzzy-git-ms-5662-75c9f677c9-g5wgp',container:'buzzy-git-ms'}
    config.tabs = getTabList(props.list);
    config.tabs[0].active = true;
    config.scrollPos = 0;
    const serviceData = props.serviceData;
    const classes = useStyles();
    const [fullscreen, setFullscreen] = React.useState(false);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [tabs, setTabs] = React.useState(config.tabs);// {action}
    let height = 280;

    React.useEffect(()=>{
        scrollFunc('init')();
        // TODO 回车日志换行功能待定吧
        // document.body.onkeydown = function (e) {
        //     if(tabs && (tabIndex || tabIndex===0)){
        //         let one = tabs[tabIndex];
        //         if(one.$ref){
        //             one.$ref.onEnter(e);
        //         }
        //     }
        // }
    })

    function rootProps(){
        let opt = {};
        opt.style = {height:`${height}px`};
        return opt;
    }

    function getTabList(list){
        let tabList = [];
        list.forEach(function (deploy) {
            if(!deploy.children){return;}
            //
            deploy.children.forEach(function (pod) {
                if(!pod.children){return;}
                //
                pod.children.forEach(function (container) {
                    tabList.push({deploy:deploy.name,pod:pod.name,container:container.name,action:container.name})
                })
            })
        })
        //
        tabList.length = 1;// 业务改：只展示1个+菜单栏
        return tabList;
    }

    function dragEvent(ev){
        let oh = height;
        let dom = document.getElementById("terminal-box");
        let max = document.documentElement.offsetHeight;
        let resizeTerminal = _.debounce(()=>{
            tabs.map((v)=>{
                v.$ref && v.$ref.onResize();
            })
        },300)
        //
        _.drag(ev,function(x,y){
            y = oh - y;
            y > max && (y = max - 1);
            y < 100 && (y = 100);
            dom.style.height = y + "px";// TODO
            height = y;
            //
            resizeTerminal()
        })
    }

    function closeTabEvent(index){
        return ()=>{
            let tabList = tabs;
            if(tabList.length<2){
                props.onClose();
                return;
            }
            //
            if(tabIndex>index){
                setTabIndex(tabIndex-1);
            }else if(tabIndex == index){
                if(index==0){
                    tabList[1].active = true;
                    setTabIndex(0);
                }else{
                    tabList[index-1].active = true;
                    setTabIndex(index-1);
                }
            }else{
                //
            }
            tabList.splice(index,1);
            setTabs([...tabList]);
        }
    }

    function selectTabEvent(index){
        return ()=>{
            tabs[index].active = true;
            setTabIndex(index)
        }
    }

    function fullscreenEvent(){
        return ()=>{
            let statusFull = !fullscreen;
            _.fullscreen(statusFull);
            setFullscreen(statusFull);
            //
            setTimeout(function(){
                tabs.map((v)=>{
                    v.$ref && v.$ref.onResize();
                })
            },120)
        }
    }

    function scrollFunc(direct){
        const offset = 160;
        return ()=>{
            const boxEl = document.getElementsByClassName('scroll_box')[0];
            const el = document.getElementsByClassName('scroll_body')[0];
            if(!el){return};
            //
            let len = el.offsetWidth - boxEl.offsetWidth + 80;
            if(len < 0){
                config.scrollPos = 0;
                el.style.transform = `translateX(-${config.scrollPos}px)`;
                // 直接不展示
                let box = document.getElementsByClassName('root-header')[0];
                box.classList.remove('show');
            }else{
                if(direct=='l'){
                    config.scrollPos -= offset;
                }else if(direct=='r'){
                    config.scrollPos += offset;
                }
                config.scrollPos < 0 && (config.scrollPos = 0);
                config.scrollPos > len && (config.scrollPos = len);
                el.style.transform = `translateX(-${config.scrollPos}px)`
            }
        }
    }

    const htmlTab = function(){
        return tabs.map(function(v,i){
            return (
                <div className={clsx('clearfix',classes.tab)} key={i+'_'+v.action}>
                    <Tooltip title={<div><div>{v.deploy}</div><div>{v.pod}</div><div>{v.container}</div></div>}>
                        <div className={clsx('tab','flex-middle',i==tabIndex?"selected":"")} >
                            <span onClick={selectTabEvent(i)}>{v.action}</span>
                            <CloseIcon className="closeIcon" onClick={closeTabEvent(i)} />
                        </div>
                    </Tooltip>
                </div>
            )
        })
    }

    const htmlTabContent = function(){//<TerminalFullCom onRef={(ref)=>{v.$ref = ref;}}/>
        return tabs.map(function(v,i){
            if(v.active){
                return (
                    <div className={clsx(classes.panel,i==tabIndex?"":"hidden")} key={v.action}>
                        <TerminalFullCom data={{serviceId:serviceData.id,name:v.pod,container:v.container}} onRef={(ref)=>{v.$ref = ref;}}/>
                    </div>
                )
            }
        })
    }
    const addConsole = (data)=>{
        let index = _.findIndex(tabs,data);
        if(index>-1){
            setTabIndex(index);
        }else{
            data.action = data.container;
            data.active = true;
            tabs.push(data)
            setTabs([...tabs]);
            setTabIndex(tabs.length-1);
        }
    }
    //
    return (
        <div id="terminal-box" className={clsx('flex-c',classes.root)} {...(rootProps())}>
            <div className={classes.drag} onMouseDown={dragEvent}>
                <p className="dragIcon"></p>
            </div>
            <div className={clsx("flex-one root-header show",classes.showScroll)} >
                <div className="flex-r">
                    <div className="flex-one"></div>
                    <div className="flex-one flex-middle icon_button"><ChevronLeftIcon onClick={scrollFunc('l')}/></div>
                    <div className="flex-box scroll_box">
                        <div className="scroll_body">
                            {htmlTab()}
                            <SelectTerminalCom data={props.list} onChange={addConsole}/>
                        </div>
                    </div>
                    <div className="flex-one flex-middle icon_button"><ChevronRightIcon onClick={scrollFunc('r')}/></div>
                    <div className="flex-one button-box">
                        <IconButton variant="contained icon_button" size="small" onClick={props.onClose}><CloseIcon /></IconButton>
                    </div>
                </div>
            </div>
            <div className="flex-box root-box">
                {htmlTabContent()}
            </div>
        </div>
    )
}

export default Panel;


//[
//             {
//                 name:'buzzy-git-ms-5662',
//                 children:[
//                     {
//                         name:'buzzy-git-ms-5662-75c9f677c9-g5wgp',
//                         children:[
//                             {name:'buzzy-git-ms'},
//                             {name:'istio-proxy'}
//                         ]
//                     }
//                 ]
//           }
//]