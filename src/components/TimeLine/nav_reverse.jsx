import React from 'react';
import ReactDOM from 'react-dom';
import {
    withStyles,Typography,Button,
    Stepper,StepContent,Step,StepLabel
} from '@material-ui/core';

import Icons from 'components/Icons/icons.jsx'

const style = theme => ({
    timeline:{
        position:'relative',
        padding:'16px',
        '& .timeline_step':{
            display:'flex',
            alignItems:'center',
            flexDirection: 'row-reverse',
            position: 'relative',
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
                marginRight:'32px',
                textAlign:'right'
            }
        },
        '& .timeline_connector':{
            minHeight: '30px',
            textAlign: 'right',
            padding: '8px 60px 8px 0',
            wordBreak: 'break-all'
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

@withStyles(style)
class Index extends React.Component {

    showStep = (item)=>{
        return _.debounce(()=>{
            location.hash = `#steps_${item.id}`;
            location.hash = '#steps_'
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
                        let icon = v.icon || getIcon(v.type, v.id, v.active);
                        let content = v.content || '';
                        //
                        return (
                            <div key={i}>
                                <div className="timeline_step" >
                                    <div className="text_icon" {...iconProps}><a id={`steps_nav_${v.id}`} onClick={this.showStep(v)}>{icon}</a></div>
                                    <div className="text">
                                        <Typography variant="h5">{title}</Typography>
                                        <Typography variant="body2">{subtitle}</Typography>
                                    </div>
                                </div>
                                <div className="timeline_connector" >
                                    {content}
                                </div>
                            </div>
                        )
                    })
                }
                <div className="timeline_line"></div>
            </div>
            </>
        )
    }
}

function getIcon(type,value,active){
    let icon = <Icons.BadgeOkIcon />;
    switch (type){
        case 'text':
            icon = <Icons.BadgeIcon count={value} active={active}/>
            break;
        case 'load':
            icon = <Icons.BadgeLoadIcon />
            break;
    }
    return icon;
}

export default Index;
