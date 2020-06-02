import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import {
    Menu as MenuIcon,
    Edit as EditIcon
} from '@material-ui/icons'
import {
    withStyles,Paper,Button
} from '@material-ui/core'
import Inputs from 'components/Form/inputs.jsx'
import Icons from 'components/Icons/icons.jsx'
import Service from '../Service'
import AuthFilter from '@/AuthFilter.jsx'
import intl from 'react-intl-universal'
import Label from 'components/Label/Label';

const style = theme => ({
    root:{
        width:'320px',
        margin:'16px',
        padding:'0 24px'
    }
})
let form_quota = []

@withStyles(style)
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        const sc = this;
        const columnOption = this.props.options;
        form_quota = [
            {name:'cpuLimit',label:intl.get('namespace.formLimitCPU'),size:8,value:"",valid:['numberOrNull']},
            {name:'cpuLimitUnit',label:'',size:4,value:'m',type:'select',options:['m','core']},
            {name:'memLimit',label:intl.get('namespace.formLimitMemory'),size:8,value:"",valid:['numberOrNull']},
            {name:'memLimitUnit',label:'',size:4,value:'m',type:'select',options:['m','Mi','Gi']},
            {name:'cpuRequest',label:intl.get('namespace.formRequestCPU'),size:8,value:"",valid:['numberOrNull']},
            {name:'cpuRequestUnit',label:'',size:4,value:'m',type:'select',options:['m','core']},
            {name:'memRequest',label:intl.get('namespace.formRequestMemory'),size:8,value:"",valid:['numberOrNull']},
            {name:'memRequestUnit',label:'',size:4,value:'m',type:'select',options:['m','Mi','Gi']}
        ]
        sc.state.form =  [
            {name:'namespace',label:<span style={{color:'rgb(105,128,138)'}}>{intl.get('namespace.formNamespce')}</span>,valid:['require'],type:'input',options:[]},
            // {name:'envTag',label:intl.get('namespace.formEnv'),value:'DEV',valid:['require'],type:'select',options:['DEV','TEST','STAGING','PROD']},
            {name:'resourceQuota',label:intl.get('namespace.formResourceQuota'),size:12,value:false,type:'checked',valid:[sc.changeRourceQuota]}
        ]
        // columnOption
        if(columnOption){
            form_quota.map(function (v) {
                if(columnOption[v.name]){_.extend(v,columnOption[v.name])}
            })
            sc.state.form.map(function (v) {
                if(columnOption[v.name]){_.extend(v,columnOption[v.name])}
            })
        }
        //
        sc.loadData();
    }

    componentDidMount(){
        this.loadNamespace();
    }

    loadData(){
        const { data } = this.props;
        let form = this.state.form;
        form.length = 2;
        if(data){
            if(data.resourceQuota){
                Array.prototype.push.apply(form,form_quota)
            }
            //
            form.map((v)=>{
                v.value = data[v.name];
            })

            this.id = data.id;
        }
    }

    loadNamespace(){
        const sc = this;
        const { form } = this.state;
        const { clusterData } = this.props;
        Service.namespaceList(clusterData,(res)=>{
            form[0].options = res;
            sc.setState({form: [...form]});
        })
    }

    state = {
        submit_loaded:false,
        form:[]
    }

    changeRourceQuota = (column)=>{
        let form = this.state.form;
        form.length = 2;
        if(!column.value){
            //this.forceUpdate();
        }else{
            Array.prototype.push.apply(form,form_quota)
        }
        this.refs.$form.setForm([...form])
    }

    clickSubmit = ()=>{
        const sc = this;
        const { clusterData,onOk } = this.props;
        let $form = this.refs.$form;
        if($form.getError('all',true)){
            return;
        }
        let data = _.extend({},$form.getData());
        data.clusterId = clusterData.id;
        data.id = sc.id;
        sc.setState({submit_loaded:true})
        Service.envUpdate(data,(res)=>{
            sc.setState({submit_loaded:false})
            //if(res){ // 后台没返回值了
                onOk();
            //}
        })
    }

    render = ()=>{
        const { classes,data,formProps } = this.props;
        const { form,submit_loaded } = this.state;
        const auth = this.getClusterAuth(data);
        let saveText = this.id ? intl.get('update') : intl.get('create');
        window.sc = this;
        //
        return (
            <div className={clsx(classes.root,'envAdd')} >
                <Inputs.Form data={form} size={12} className="small" ref="$form" {...formProps}/>
                <br/>
                { (!this.id || auth('W')) ? <Icons.ButtonT variant="contained" fullWidth color="primary" disabled={submit_loaded} onClick={this.clickSubmit} title={saveText}/> : ''}
            </div>
        )
    }
}

export default Index;
