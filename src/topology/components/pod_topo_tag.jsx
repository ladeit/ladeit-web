import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import {
    withStyles,Typography,Button,IconButton,Popover
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'

const TYPE_OPTIONS = ['uri','method','headers','authority','scheme']; //['uri','method','headers','port','query params'];
const EXPRESSION_OPTONS = {exact:'=',prefix:'prefix',regex:'regex'};
const getForm = (view)=>{
    let defaultform = [
        {name:'type',label:'类型',type:'select',value:'uri',options:TYPE_OPTIONS,valid:[_.debounce(view.changeSelectType('default'))]},
        {name:'expression',label:'表达式',type:'select',value:'exact',options:[{key:'exact',text:"="},{key:'prefix',text:"prefix"},{key:'regex',text:"regex"}]},
        {name:'value',label:'值',value:''},
    ];
    defaultform.type = "default";
    let headerForm = [
        {name:'type',label:'类型',type:'select',value:'uri',options:TYPE_OPTIONS,valid:[_.debounce(view.changeSelectType('headers'))]},
        {name:'key',label:'键',value:''},
        {name:'value',label:'值',value:''},
    ]
    headerForm.type = "headers";
    return (data)=>{
        let form = data.type == 'headers' ? headerForm : defaultform;
        form.map((one)=>{
            let value = data[one.name];
            if(value=="" || value){
                one.value = value;
            }
        })
        return form;
    }
}

class Index extends React.PureComponent {
    componentWillMount(){
        this.handle = this.props.handle || function(){};
        this.state.data = this.props.data;
        this.getForm = getForm(this);
        this.state.form = this.getForm({type:'uri',expression:'exact',value:''});
    }

    componentDidMount(){}

    state = {
        popover:NULL,
        data:{_value:[]},
        form:[],
        formType:''
    }

    changeSelectType(flag){
        const sc = this;
        return (column)=>{
            let data = sc.refs.$form.getData();
            let array = sc.getForm(data);
            if(array.type != flag){
                sc.setState({form:array,formType:array.type})
            }
        }
    }

    delItemValue(parent,index){
        const sc = this;
        return (e)=>{
            parent.splice(index,1);
            sc.setState({flow:{...sc.state.flow}})
        }
    }

    modItemValue(item){
        const sc = this;
        return (e)=>{
            let arr = sc.getForm(item);
            sc.setState({popover: e.currentTarget,item:item,itemIndex:-1,form:arr,formType:arr.type})
        }
    }

    addItemValue(parent,index){
        const sc = this;
        return (e)=>{
            let form = sc.getForm({type:'uri',expression:'exact',value:''});
            sc.setState({popover: e.currentTarget,item:parent,itemIndex:index,form:form,formType:form.type})
        }
    }

    addItem(parent){
        const sc = this;
        return (e)=>{
            let form = sc.getForm({type:'uri',expression:'exact',value:''});
            sc.setState({popover: e.currentTarget,item:parent,itemIndex:-1,form:form,formType:form.type})
        }
    }

    saveItem(){
        const sc = this;
        const { item,itemIndex } = this.state;
        return ()=>{
            let data = _.extend({expression:'exact'},sc.refs.$form.getData())
            if(item.type){//  修改项
                _.extend(item,data);
            }else if(itemIndex==-1){// 同级组+项
                item.push([data])
            }else{// 组内项
                item.splice(itemIndex,0,data);
            }
            sc.setState({popover:NULL});
            sc.handle();
        }
    }

    htmlItem(item,parent,index){
        const sc = this;
        let text = `${item.type} ${EXPRESSION_OPTONS[item.expression]}  ${item.value}`
        if(['headers'].indexOf(item.type)>-1){
            text = `${item.type} : ${item.key} = ${item.value}`
        }
        return (
            <div className="react-tagsinput marginLeft">
                <span className="react-tagsinput-tag info" >
                    <span onClick={sc.modItemValue(item)}>{text}</span>
                    <a onClick={sc.delItemValue(parent,index)}></a>
                </span>
            </div>
        )
    }

    htmlItem_back(item,parent,index){
        const sc = this;
        let text = `${item.type} ${EXPRESSION_OPTONS[item.expression]}  ${item.value}`
        if(['headers'].indexOf(item.type)>-1){
            text = `${item.type} : ${item.key} = ${item.value}`
        }
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
        let value = item._value;
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
                    res.push(<IconButton size="small" onClick={sc.addItemValue(one,one.length)} aria-describedby="create_strategy_rule_popover" ><AddIcon style={{color:"rgb(0,0,0,.3)"}}/></IconButton>)
                    res.push(<b>)</b>)
                    if(index<value.length-1){
                        res.push(<b>&nbsp;&nbsp;or&nbsp;&nbsp;</b>)
                    }
                }
            }else{
                res.push(sc.htmlItem(one,value,index))
                if(index<value.length-1){
                    res.push(<b>&nbsp;&nbsp;or&nbsp;&nbsp;</b>)
                }
            }
        })
        res.push(<IconButton size="small" onClick={sc.addItem(value)} aria-describedby="create_strategy_rule_popover" ><AddIcon style={{color:"rgb(0,0,0,.3)"}}/></IconButton>)
        return res;
    }

    htmlShowItem(item,parent,index){
        const sc = this;
        let text = `${item.type} ${EXPRESSION_OPTONS[item.expression]}  ${item.value}`
        if(['headers'].indexOf(item.type)>-1){
            text = `${item.type} : ${item.key} = ${item.value}`
        }
        return (
            <div className="react-tagsinput marginLeft">
                <span className="react-tagsinput-tag readonly" >
                    <span >{text}</span>
                </span>
            </div>
        )
    }

    htmlShow(value){
        let sc = this;
        let res = [];
        value.map((one,index)=>{
            if(one instanceof Array){
                if(one.length){
                    res.push(<b>(</b>)
                    one.map((v,i)=>{
                        res.push(sc.htmlShowItem(v,one,i))
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
                res.push(sc.htmlShowItem(one,value,index))
                if(index<value.length-1){
                    res.push(<b>&nbsp;&nbsp;or&nbsp;&nbsp;</b>)
                }
            }
        })
        return res;
    }

    render(){
        const { disabled } = this.props;
        const { popover,data,form,formType } = this.state;
        let html = disabled ? this.htmlShow(data) : this.htmlRow(data);
        return (
            <>
                <span style={{color:'rgb(0,0,0,.8)'}} >{html}</span>
                <Popover
                    id="create_strategy_rule_popover"
                    open={Boolean(popover)}
                    anchorEl={popover}
                    onClose={()=>{this.setState({popover:NULL})}}
                    anchorOrigin={{vertical: 'bottom',horizontal: 'center'}}
                    transformOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <div style={{width:'360px',padding:'8px 16px'}}>
                        { formType=='default' && <Inputs.Form  data={form} size={4} ref="$form" /> }
                        { formType!='default' && <Inputs.Form  data={form} size={4} ref="$form" /> }
                        <Button fullWidth color="primary" variant="contained" onClick={this.saveItem()}>保存</Button>
                    </div>
                </Popover>
            </>
        )
    }
}

export default Index;
