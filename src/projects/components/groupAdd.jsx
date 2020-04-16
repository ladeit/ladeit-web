import React from 'react'
import {
    withStyles,Typography,Divider,
    TextField,
    Button,TextareaAutosize
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import intl from 'react-intl-universal'
//
import Service from '@/cluster/Service'
import ProjectService from '@/projects/Service'

const styles = {
    root: {
        width:'320px',
        margin:'16px',
        padding:'0 24px',
        '& .row_name':{
            padding:'32px 0 8px'
        },
        '& textarea':{
            resize:'none',
            padding: '8px',
            border: '1px solid rgb(221, 221, 221)',
            borderRadius: '4px'
        }
    },
}

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        //this.loadCluster();
    }

    state = {
        submit_loaded:false,
        form_loaded:false,
        form:[
            {name:'name',label:intl.get('group.groupName'),valid:['require','name'],inputProps:{autocomplete:false}},
            // {name:'clusterId',label:'集群',type:'select',valid:['require',this.changeCluster()],options:[]},
            // {name:'envId',label:'命名空间',type:'select',valid:['require'],options:[]}
        ]
    }

    loadCluster(){
        const sc = this;
        let form = this.state.form;
        sc.setState({form_loaded:false})
        Service.clusterList((res)=>{
            form[1].options = res.map((v)=>{return {key: v.id,text: v.k8sName}})
            sc.setState({form: [...form],form_loaded:true})
        })
    }

    loadEnv = (id)=>{
        const sc = this;
        let form = this.state.form;
        sc.setState({form_loaded:false})
        Service.envList({id:id},(res)=>{
            form[2].options = res.map((v)=>{return {key: v.id,text: v.namespace}})
            sc.setState({form: [...form],form_loaded:true})
        })
    }

    changeCluster(){
        const sc = this;
        return (column)=>{
            sc.loadEnv(column.value)
        }
    }

    clickSave(){
        const sc = this;
        const { onOk } = this.props;
        return ()=>{
            let $form = sc.refs.$form;
            if(!$form.getError('all',true)){
                let data = $form.getData();
                sc.setState({submit_loaded:true})
                ProjectService.groupAdd(data,(res)=>{
                    sc.setState({submit_loaded:false})
                    if(res){
                        onOk(res)
                    }
                })
            }
        }
    }

    render() {
        const {classes} = this.props;
        const { form ,form_loaded,submit_loaded } = this.state;

        return (
            <div className={classes.root}>
                <Inputs.Form data={form} ref="$form" size={12}/>
                <br/>
                <Icons.ButtonT variant="contained" fullWidth color="primary" disabled={submit_loaded} onClick={this.clickSave()} title={intl.get('create')}/>
            </div>
        )
    }
}

export default Index;
