import React from 'react';
import {
    withStyles,Typography,Badge
} from '@material-ui/core';
import WS from '@static/ws_group'
import intl from 'react-intl-universal'

const styles = theme => ({
    box:{
        "& .text_notification":{
            width: '150px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            backgroundColor:'white',
            position:'relative',
            zIndex:1
        }
    }
})


@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        this.row = this.props.data;
    }

    componentDidMount(){
        WS.addTask(this.row.id,_.throttle(this.renderNew,1000))
    }

    renderNew = (row)=>{
        let sc = this;
        this.beforeRow = this.row;
        this.row = row;
        if(sc.beforeRow){
            this.forceUpdate();
            _.delay(function(){sc.scrollStart()},300)
            _.delay(function(){sc.scrollEnd()},900)
        }
    }

    scrollStart = ()=>{
        let el = this.refs.$box;
        el && (el.style = "transition:transform .6s;transform:translate3d(0,-28px,0);");
    }

    scrollEnd = ()=>{
        let el = this.refs.$box;
        if(el){
            this.beforeRow = '';
            this.forceUpdate();
            this.refs.$box.style = "transition:'';transform:'';";
        }
    }

    htmlGroupStatus(item){// TODO  消息推送持续滚动展示  . 待定: 正常运行
        let status = item.status - 0;
        switch (status){
            case -1:
                return <div className="row_text_notification"><Badge className="status_undefined badge" variant="dot" />{intl.get('services.status.-1')}</div>
            case 0:
                return <div className="row_text_notification"><Badge className="status_success badge" variant="dot" /><Typography variant="body2" component="span">{intl.get('services.status.0')}</Typography></div>
            case 1:
            case 2:
            case 3:
            case 4:
                return <div className="row_text_notification"><Badge className="status_running badge" variant="dot" /><Typography variant="body2" component="span">{intl.get('services.status.4')}</Typography></div>
            default:
                break;
        }
    }

    render(){
        const { classes } = this.props;
        let beforeRow = this.beforeRow;
        let row = this.row;
        return (
            <div className={classes.box} ref="$box">
                { beforeRow  && this.htmlGroupStatus(beforeRow)}
                { row && this.htmlGroupStatus(row)}
            </div>
        )
    }
}

export default Index;
