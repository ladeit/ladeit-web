import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import {
    withStyles,Typography,Tooltip
} from '@material-ui/core'

const EXPRESSION_OPTONS = {exact:'=',prefix:'prefix',regex:'regex'};
const styles = theme => ({
    tip:{
        maxWidth:'360px',
        '&>div':{
            maxWidth:'inherit'
        }
    }
})

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        this.showAll = this.props.showAll;
        this.state.data = this.props.data || [[]];
    }

    componentDidMount(){}

    state = {
        data:NULL
    }

    render(){
        const { classes } = this.props;
        const { data } = this.state;// [[{}],[]]
        let htmlAll = htmlShow(data);
        let html = '';
        if(data.length>0){
            html = getGroupStr(data[0][0]);
            if(data.length>1 || data[0].length>1 || html.length>30){
                html = html.substring(0,27) + ' ...';
            }
        }
        //
        if(html){
            return (
                <Tooltip title={htmlAll} interactive={true} classes={{popper:classes.tip}} >
                    <span >{html}</span>
                </Tooltip>
            )
        }else{
            return <span > 一 </span>;
        }
    }
}

function getGroupStr(item){
    let text = ''
    if(!item){
        //
    }else if(['headers'].indexOf(item.type)>-1){
        text = `${item.type} : ${item.key} = ${item.value}`
    }else{
        text = `${item.type} ${EXPRESSION_OPTONS[item.expression]}  ${item.value}`
    }
    return text;
}

function htmlShow(value){
    function htmlShowItem(item){
        const sc = this;
        let text = getGroupStr(item)
        return (
            <div className="react-tagsinput marginLeft">
                <span className="react-tagsinput-tag readonly" >
                    <span >{text}</span>
                </span>
            </div>
        )
    }

    function htmlShow(value){
        let res = [];
        value.map((one,index)=>{
            if(one instanceof Array){
                if(one.length){
                    res.push(<b>(</b>)
                    one.map((v,i)=>{
                        res.push(htmlShowItem(v,one,i))
                        if(i<one.length-1){
                            res.push(<b>and</b>)
                        }
                    })
                    res.push(<b>)</b>)
                    if(index<value.length-1){
                        res.push(<b>&nbsp;&nbsp;or&nbsp;&nbsp;</b>)
                    }
                }
            }else{
                res.push(htmlShowItem(one,value,index))
                if(index<value.length-1){
                    res.push(<b>&nbsp;&nbsp;or&nbsp;&nbsp;</b>)
                }
            }
        })
        return res;
    }

    return htmlShow(value)
}

export default Index;
