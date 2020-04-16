import React from 'react';
import {
    withStyles,Typography,Badge
} from '@material-ui/core';

const styles = theme => ({
    box:{
        "& .row_text_notification":{
            width: '100%',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            position:'relative',
            zIndex:1
        }
    }
})


@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        const { data,options } = this.props;
        this.row = data;
        this.height = options.height || 28;
    }

    componentDidMount(){
        //WS.addTask(this.row.id,_.throttle(this.renderNew,1000))
    }

    renderNew = (row)=>{
        let sc = this;
        this.beforeRow = this.row;
        this.row = row;
        if(sc.beforeRow){
            this.forceUpdate();
            _.delay(function(){sc.scrollStart()},300)
            _.delay(function(){sc.scrollEnd()},1000)
        }
    }

    scrollStart = ()=>{
        let el = this.refs.$box;
        el && (el.style = `transition:transform .6s;transform:translate(0,-${this.height}px);`);
    }

    scrollEnd = ()=>{
        let el = this.refs.$box;
        if(el){
            this.beforeRow = '';
            this.forceUpdate();
            this.refs.$box.style = "transition:'';transform:'';";
        }
    }

    htmlRow(item){//
        return <div className="row_text_notification" style={{height:this.height+'px'}} >{item}</div>;
    }

    render(){
        const { classes } = this.props;
        let beforeRow = this.beforeRow;
        let row = this.row;
        return (
            <div className={classes.box} ref="$box">
                { beforeRow  && this.htmlRow(beforeRow)}
                { row && this.htmlRow(row)}
            </div>
        )
    }
}

export default Index;
