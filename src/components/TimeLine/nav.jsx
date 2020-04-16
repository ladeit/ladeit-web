import React from 'react';
import clsx from 'clsx'
import ReactDOM from 'react-dom';
import {
    withStyles,Typography,Button,
    Stepper,StepContent,Step,StepLabel
} from '@material-ui/core';

import Icons from 'components/Icons/icons.jsx'

const style = theme => ({
    timeline:{
        position:'relative',
        padding:'16px 16px 120px',
        '& .timeline_step':{
            display:'flex',
            alignItems:'center',
            position: 'relative',
            '&.disabled':{
                '& .MuiBadge-badge':{
                    backgroundColor:'white',
                    border: '1px solid #ddd',
                    color: '#ddd'
                },
                '& .text>b':{
                    color:"#a0a0a0"
                }
            },
            '&.active':{
                '& .MuiBadge-badge': {
                    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)'
                }
            },
            '& .text_icon':{
                width: "32px",
                height: '32px',
                marginTop:'-3px',
                display:'flex',
                alignItems:'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1
            },
            '& .text':{
                marginLeft:'16px',
                textAlign:'right'
            }
        },
        '& .timeline_connector':{
            minHeight: '30px',
            margin: '8px 8px 8px 15px',
            wordBreak: 'break-all',
            borderLeft: '2px solid #ddd',
            '&>div':{
                padding:'8px 32px 32px'
            }
        },
        '& .timeline_connector.no-line':{
            borderLeft: 'none'
        },
        '& .timeline_line':{
            width:'2px',
            height:'100%',
            backgroundColor:'#ddd',
            position:'absolute',
            right:'31px',
            top:0
        }
    }
})

//const data = [{
//    title:"Import Files",
//    subtitle:"Brower and upload",
//    icon:<CheckCircleIcon className="icon"/>
//}]
//

//showStep = (item)=>{
//    return ()=>{
//        let id = `steps_${item.id}`;
//        let dom = document.getElementById(id);
//        if(dom){
//            dom.closest(".MuiDrawer-paper").scrollTop = dom.offsetTop;
//            //document.documentElement.scrollTop = dom.offsetTop;
//            //document.body.scrollTop = dom.offsetTop;
//        }
//    }
//}

const TYPE_STYLE = {'text':'disabled',active:'active',ok:'',load:'',loaded:''}

@withStyles(style)
class Index extends React.Component {

    showStep = (item)=>{
        return _.debounce(()=>{
            location.hash = `#steps_${item.id}`;
        },100)
    }

    render(){
        const { classes,data,iconProps } = this.props;
        return (
            <>
            <div className={classes.timeline}>
                {
                    data.map((v,i)=>{
                        let title = v.title;
                        let subtitle = v.subtitle;
                        let icon = v.icon || getIcon(v.type, v.id);
                        let isLast = v.isLast ? 'no-line' : '';
                        let disabled = TYPE_STYLE[v.type];
                        let content = <div className={clsx('timeline_connector',isLast)} >{v.content}</div>;
                        //
                        if(v.type=='load'){
                            content = <div className={clsx('timeline_connector',isLast)} ></div>;
                        }else if(v.type=='loaded'){
                            content = <div className={clsx('timeline_connector',isLast,'hidden')} >{v.content}</div>;
                        }
                        //
                        return (
                            <div key={i}>
                                <div className={`timeline_step ${disabled}`} >
                                    <div className="text_icon" {...iconProps}><a id={`tl_${v.id}`}>{icon}</a></div>
                                    <div className="text">
                                        <Typography variant="h5" component="b" >{title}</Typography>
                                        <Typography variant="body2">{subtitle}</Typography>
                                    </div>
                                </div>
                                {content}
                            </div>
                        )
                    })
                }
            </div>
            </>
        )
    }
}

function getIcon(type,value){
    let icon = <Icons.BadgeOkIcon />;
    switch (type){
        case 'text':
            icon = <Icons.BadgeIcon count={value} active={false}/>
            break;
        case 'active':
            icon = <Icons.BadgeIcon count={value} active={true}/>
            break;
        case 'load':
            icon = <Icons.BadgeLoadIcon />
            break;
        case 'loaded':
            icon = <Icons.BadgeLoadIcon />
            break;
    }
    return icon;
}

export default Index;
