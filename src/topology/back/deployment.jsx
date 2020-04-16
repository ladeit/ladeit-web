import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import {
    CheckCircle as CheckCircleIcon,
    Edit as EditIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Badge,Divider,Button,
    Paper,
    Grid
} from '@material-ui/core';
import Inputs from 'components/Form/inputs.jsx'
import Icons from 'components/Icons/icons.jsx'
import Timeline from 'components/TimeLine/nav.jsx'

const style = theme => ({
    root:{
        '& .left_info':{
            width:'300px'
        },
        '& .left_info>div':{
            width:'300px',
            position:'fixed',
            top:'50px',
            left:0
        }
    },
    area:{
        padding:'0 80px',
        '& .title':{
            padding:'16px'
        },
        '& .footer':{
            lineHeight:'80px'
        }
    }
})

@withStyles(style)
class Index extends React.PureComponent {

    componentDidMount(){
        //_.scrollList.push(this.scrollAnchor(this.state.data))
    }

    componentWillUnMount(){

    }

    state = {
        active:0,
        data:[{
            id:'1',
            title:"Import Files1",
            type:'text'
        },{
            id:'2',
            title:"Import Files2",
            subtitle:"Brower and upload",
            type:'text'
        },{
            id:'3',
            title:"Import Files3",
            subtitle:"Brower and upload",
            type:'text'
        },{
            id:'4',
            title:"Import Files4",
            type:'text'
        }]
    }

    scrollAnchor(data){
        const sc = this;
        let anchorArr = [];
        let pre = -1, pos = null;
        data.map((v,i)=>{
            if(i==0){
                //
            }else{
                pos = document.getElementById(`steps_${v.id}`).offsetTop - 30;
                anchorArr.push([pre,pos])
                pre = pos;
            }
        })
        anchorArr.push([pre,100000])
        //
        return (e)=>{
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            let index = _.findIndex(anchorArr,function(o){return o[0]<scrollTop && o[1]>scrollTop});
            if(index>-1){
                //sc.renderData(index)
            }
        }
    }

    renderData = (index)=>{
        const sc = this;
        let data = this.state.data;
        let selIndex = -1;
        data.map((v,i)=>{
            v.active = false;
            if(i>index){// 带操作
                v.type = 'text'
            }else if(i==index){// 当前
                selIndex = i;
                v.type = 'text'
                v.active = true
            }else{// 已完成
                v.type = ''
            }
        })
        if(selIndex>-1){
            sc.state.active = selIndex;
            setTimeout(()=>{
                let item = data[selIndex];
                location.hash = `#steps_${item.id}`;
            },300)
        }
        sc.setState({data: [...data]});

    }

    render = ()=>{
        const { classes,iconProps } = this.props;
        let steps = this.state.data;
        let active = this.state.active;
        let height = document.documentElement.offsetHeight;
        window.sc = this;
        //
        const form = [
            {name:'name',label:'姓名1',valid:['require'], inputProps:{placeholder:'用户名',endAdornment: <EditIcon />}},
            {name:'name1',label:'姓名1',valid:['require'],type:'select',options:[{key:'',text:'NONE'},'select1','select2','select3']},
            {name:'name3',label:'姓名2',inputProps:{disabled:true}},
            {name:'name',valid:['require'], inputProps:{placeholder:'用户名',endAdornment: <EditIcon />}},
            {name:'name1',label:'姓名1',valid:['require'],type:'select',options:[{key:'',text:'NONE'},'select1','select2','select3']},
            {name:'name3',label:'姓名2',inputProps:{disabled:true}},
        ]
        //
        return (
            <Paper className={clsx(classes.root,'flex-r')}>
                <div className="flex-one left_info">
                    <Timeline data={steps} iconProps={{style:{backgroundColor:'white'}}}/>
                </div>
                <div className="flex-box">
                    {
                        steps.map((v,i) =>{
                            if(i>active){return ''}
                            return (
                                <div className={clsx(classes.area,'flex-c')} style={{height:height+"px"}} >
                                    <Typography variant="h3" className={clsx('title','flex-one')} id={`steps_${v.id}`}>{v.title} #</Typography>
                                    <div className="flex-box">
                                        <Paper style={{margin:'16px',padding:'16px'}}>
                                            <Inputs.Form data={form} />
                                        </Paper>
                                    </div>
                                    <div className={clsx('footer','flex-one','flex-right')}>
                                        {i==0 || <Button onClick={()=>{this.renderData(i-1)}}>pre</Button>}
                                        {i==steps.length-1 || <Button onClick={()=>{this.renderData(i+1)}}>next</Button>}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Paper>
        )
    }
}

export default Index;
