import React from 'react';
import {
    withStyles,Typography,Badge
} from '@material-ui/core';
import Moment from 'moment';

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
        this.rows = data;
        this.height = options.height || 28;
    }

    componentDidMount(){
        const sc = this;
        let len = sc.rows.length - 1;
        if(len>0){
            setInterval(function () {
                let index = sc.state.index;
                index > len && (index = 0);
                sc.scrollStart(index);
                sc.state.index = ++index;
            },3000)
        }
    }

    state = {
        index:0
    }

    toUrl = (url)=>{
        return ()=>{
            History.push(url);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }
    }

    scrollStart = (index)=>{
        let el = this.refs.$box;
        el && (el.style = `transition:transform .6s;transform:translate(0,-${this.height*index}px);`);
    }

    htmlRow(item){//
        return (
            <div className="row_text_notification" style={{height:this.height+'px'}} >
                <Typography variant="body2">{ Moment(item.createAt).format('MM.DD HH:mm:ss') }</Typography>
                <span className="link2" onClick={this.toUrl(`/notification/info/${item.id}`)}>{ item.title }</span>
            </div>
        )
    }

    render(){
        const sc = this;
        const { classes } = this.props;
        let rows = this.rows;
        console.log('tips-render')
        return (
            <div className={classes.box} ref="$box">
                {
                    rows.map(function (v) {
                        return sc.htmlRow(v)
                    })
                }
            </div>
        )
    }
}

export default Index;
