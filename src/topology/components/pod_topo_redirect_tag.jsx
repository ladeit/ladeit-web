import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import {
    withStyles,Typography,Button,IconButton,Popover
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'

const getForm = (view)=>{
    let map = {
        redirect:[
            {name:'uri',label:'uri',value:''},
            {name:'redirectCode',label:'redirectCode',value:''},
            {name:'authority',label:'authority',value:''},
        ],
        rewrite:[// uri,authority
            {name:'uri',label:'uri',value:''},
            {name:'authority',label:'authority',value:''},
        ],
        retries:[// attempts,perTryTimeout,retryOn
            {name:'attempts',label:'attempts',value:''},
            {name:'perTryTimeout',label:'perTryTimeout',value:''},
            {name:'retryOn',label:'retryOn',value:''},
        ],
        corsPolicy:[// allowOrigin,allowMethods,allowHeaders,exposeHeaders,maxAge,allowCredentials
            {name:'allowOrigin',label:'allowOrigin',value:''},
            {name:'allowMethods',label:'allowMethods',value:''},
            {name:'allowHeaders',label:'allowHeaders',value:''},
            {name:'exposeHeaders',label:'exposeHeaders',value:''},
            {name:'maxAge',label:'maxAge',value:''},
            {name:'allowCredentials',label:'allowCredentials',type:'checked',value:false},
        ]
    }
    return (data)=>{
        let form = map[view.state.type];
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
        this.state.type = this.props.type || 'redirect';
        this.getForm = getForm(this);
        this.state.form = this.getForm({uri:'',redirectCode:'',authority:''});
    }

    componentDidMount(){}

    state = {
        popover:NULL,
        type:'',
        data:{},
        form:[]
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

    addItem(){
        const sc = this;
        const {disabled} = sc.props;
        const map = {
            redirect:{uri:'',redirectCode:'',authority:''},
            rewrite:{uri:'',authority:''},
            retries:{attempts:'',perTryTimeout:'',retryOn:''}
        }
        const nullObj = map[sc.state.type];
        return (e)=>{
            if(disabled){
                window.Store.notice.add({text:disabled,type:'warning'})
            }else{
                let form = sc.getForm(nullObj);
                sc.setState({popover: e.currentTarget,form:form})
            }
        }
    }

    modItem(){
        const sc = this;
        return (e)=>{
            let form = sc.getForm(sc.state.data);
            sc.setState({popover: e.currentTarget,form:form})
        }
    }

    delItem(){
        const sc = this;
        return (e)=>{
            sc.setState({data:''})
            sc.handle('');
        }
    }

    saveItem(){
        const sc = this;
        const { data } = this.state;
        return ()=>{
            let obj = _.extend({},data,sc.refs.$form.getData());
            sc.setState({popover:NULL,data:obj});
            sc.handle(obj);
        }
    }

    htmlItem(item){
        const sc = this;
        const type = sc.state.type;
        let text = `uri:${item.uri||''}; redirectCode:${item.redirectCode||''}; authority:${item.authority||''}`;
        if(type == "rewrite"){
            text = `uri:${item.uri||''}; authority:${item.authority||''}`;
        }else if(type == "retries"){
            text = `attempts:${item.attempts||''}; perTryTimeout:${item.perTryTimeout||''}; retryOn:${item.retryOn||''}`;
        }
        return (
            <div className="react-tagsinput first">
                <span className="react-tagsinput-tag info" >
                    <span onClick={sc.modItem(item)}>{text}</span>
                    <a onClick={sc.delItem()}></a>
                </span>
            </div>
        )
    }

    render(){
        const { disabled } = this.props;
        const { popover,data,form } = this.state;
        let html = data ? this.htmlItem(data) : <IconButton size="small" onClick={this.addItem()}><AddIcon /></IconButton>
        return (
            <>
                {html}
                <Popover
                    id="create_strategy_rule_popover"
                    open={Boolean(popover)}
                    anchorEl={popover}
                    onClose={()=>{this.setState({popover:NULL})}}
                    anchorOrigin={{vertical: 'bottom',horizontal: 'center'}}
                    transformOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <div style={{width:'260px',padding:'16px 32px'}}>
                        <Inputs.Form  data={form} size={12} ref="$form" className="small" />
                        <Button fullWidth color="primary" variant="contained" onClick={this.saveItem()}>保存</Button>
                    </div>
                </Popover>
            </>
        )
    }
}

export default Index;
