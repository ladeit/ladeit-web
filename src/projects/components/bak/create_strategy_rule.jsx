import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import {Provider,observer,inject} from "mobx-react"
import {
    Close as CloseIcon,
    Add as AddIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Divider,Button,IconButton,Paper,
    Popover
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'


const style = theme => ({
    paper:{
        padding:'16px 24px'
    },
    box:{
        lineHeight:'30px',
        '& .label':{
            width:'80px',
            lineHeight:'28px',
            padding:'8px 0'
        },
        '& .MuiTextField-root':{
            margin:0
        },
        '& b':{
            marginRight:'8px'
        }
    },
    textField:{
        '& input':{
            textAlign:'right'
        }
    }
})

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        let { renderStep} = this.props;
        renderStep(true,"-");
    }

    state = {
        popover:NULL,
        item:null,
        itemIndex:-1,
        flow:[
            {name:'V3.0.1',value:[[{select:'uri',prefix:'prefix',value:'xx'},{select:'uri',prefix:'prefix',value:'22'}]]},
            {name:'V3.1.1',value:[[{select:'uri',prefix:'prefix',value:'11'}]]}
        ],
        form:[
            {name:'select',label:'类型',type:'select',value:'uri',options:['uri','method','headers','port','query params']},
            {name:'prefix',label:'表达式',type:'select',value:'=',options:['=','prefix','regex']},
            {name:'value',label:'值'},
        ]
    }

    clickListItem(name,v){
        const sc = this;
        //let { renderStep,deploymentStore:{createStrategy} } = this.props;
        let { renderStep} = this.props;
        let config = this.config.createStrategy;
        return ()=>{
            config[name] = v.key;
            sc.forceUpdate();
        }
    }

    delItemValue(parent,index){
        const sc = this;
        return (e)=>{
            parent.splice(index,1);
            sc.setState({flow: [...sc.state.flow]})
        }
    }

    modItemValue(item){
        const sc = this;
        const form = this.state.form;
        return (e)=>{
            form[0].value = item.select;
            form[1].value = item.prefix;
            form[2].value = item.value;
            sc.setState({popover: e.currentTarget,item:item,itemIndex:-1,form: [...form]})
        }
    }

    addItemValue(parent,index){
        const sc = this;
        const form = this.state.form;
        return (e)=>{
            form[0].value = 'uri';
            form[1].value = '=';
            form[2].value = '';
            sc.setState({popover: e.currentTarget,item:parent,itemIndex:index,form: [...form]})
        }
    }

    addItem(parent){
        const sc = this;
        const form = this.state.form;
        return (e)=>{
            form[0].value = 'uri';
            form[1].value = '=';
            form[2].value = '';
            sc.setState({popover: e.currentTarget,item:parent,itemIndex:-1,form: [...form]})
        }
    }

    saveItem(){
        const sc = this;
        const { item,itemIndex } = this.state;
        return ()=>{
            let data = _.extend({},sc.refs.$form.getData())
            if(item.select){//  修改项
                _.extend(item,data);
            }else if(itemIndex==-1){// 同级组+项
                item.push([data])
            }else{// 组内项
                item.splice(itemIndex,0,data);
            }
            sc.setState({popover:NULL,flow: [...sc.state.flow]})
        }
    }

    htmlItem(item,parent,index){
        const sc = this;
        let text = `${item.select} : ${item.prefix} - ${item.value}`
        return (
            <Icons.TagT title={
                    <span onClick={sc.modItemValue(item)} >{text}</span>
                } icons={
                <>
                    <CloseIcon onClick={sc.delItemValue(parent,index)}/>
                </>
            }/>
        )
    }

    htmlRow(item){
        let sc = this;
        let res = [];
        let value = item.value;
        value.map((one,index)=>{
            if(one instanceof Array){
                if(one.length){
                    res.push(<b>(</b>)
                    one.map((v,i)=>{
                        res.push(sc.htmlItem(v,one,i))
                        if(i<one.length-1){
                            res.push(<b>and</b>)
                        }
                    })
                    res.push(<IconButton onClick={sc.addItemValue(one,one.length)} aria-describedby="create_strategy_rule_popover" ><AddIcon /></IconButton>)
                    res.push(<b>)</b>)
                    if(index<value.length-1){
                        res.push(<b>or</b>)
                    }
                }
            }else{
                res.push(sc.htmlItem(one,value,index))
                if(index<value.length-1){
                    res.push(<b>or</b>)
                }
            }
        })
        res.push(<IconButton onClick={sc.addItem(value)} aria-describedby="create_strategy_rule_popover" ><AddIcon /></IconButton>)
        return res;
    }

    htmlTypeFlow(){
        const { classes } = this.props;
        const { flow } = this.state;
        return flow.map((v) => {
            return (
                <div className="flex-r">
                    <div className="flex-one overflow-text">
                        <Typography variant="h5" className="label">{v.name}</Typography>
                    </div>
                    <div className={clsx("flex-box")}>
                        {
                            this.htmlRow(v)
                        }
                    </div>
                </div>
            )
        })
    }

    render(){
        const { flow,popover,form } = this.state;
        let { classes,serviceData } = this.props;
        //
        return (
            <div className={classes.content} >
                <div className={classes.box} >
                    {this.htmlTypeFlow()}
                </div>
                <Popover
                    id="create_strategy_rule_popover"
                    open={Boolean(popover)}
                    anchorEl={popover}
                    onClose={()=>{this.setState({popover:NULL})}}
                    anchorOrigin={{vertical: 'bottom',horizontal: 'center'}}
                    transformOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <div style={{width:'360px',padding:'8px 16px'}}>
                        {popover &&  <Inputs.Form  data={form} size={4} ref="$form"/>}
                        <Button fullWidth color="primary" variant="contained" onClick={this.saveItem()}>保存</Button>
                    </div>
                </Popover>
            </div>
        )
    }
}

export default Index;
