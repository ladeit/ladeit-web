import React from 'react';
import {
    withStyles,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Checkbox,
    ListSubheader
} from '@material-ui/core'

import Inputs from 'components/Form/inputs.jsx'
import Icons from 'components/Icons/icons.jsx'
import Service from '@/cluster/Service.js'
import intl from 'react-intl-universal'

const style = theme => ({
    root:{
        width:'320px',
        margin:'16px',
        padding:'0 24px'
    }
})

@withStyles(style)
class Index extends React.Component {
    componentWillMount(){
        this.loadCluster();
    }

    loadCluster = ()=>{
        const sc = this;
        let form = this.state.form;
        Service.clusterList((res)=>{
            form[1].options = res.map((v)=>{return {key: v.id,text: v.k8sName,disabled:v.disable}})
            sc.setState({form: [...form]})
        })
    }

    loadEnv = (id)=>{
        const sc = this;
        let form = this.state.form;
        Service.envList({id:id},(res)=>{
            form[2].options = res.map((v)=>{return {key: v.id,text: v.namespace,disabled:v.disable}})
            sc.setState({form: [...form]})
        })
    }

    state = {
        form:[
            {name:'name',label:intl.get('services.addDialog.name'),valid:['require']},
            {name:'clusterId',label:intl.get('services.addDialog.cluster'),className:'margin8',type:'select',ListSubheader:clusterHeader.call(this),valid:['require',this.changeCluster()],options:[]},
            {name:'envId',label:intl.get('services.addDialog.namespace'),className:'margin8',type:'select',ListSubheader:clusterHeader.call(this),valid:['require'],options:[]}
        ]
    }

    onOpen = ()=>{
        this.setState({open:true})
    }

    onClose = ()=>{
        this.setState({open:false})
    }

    changeCluster(){
        const sc = this;
        return (column)=>{
            sc.loadEnv(column.value)
        }
    }

    clickSave(){
        const sc = this;
        const onOk = this.props.onOk;
        return ()=>{
            if(sc.refs.$form.getError(true,true)<1){
                onOk(sc.refs.$form.getData());
            }
        }
    }

    render() {
        const sc = this;
        const { classes } = this.props;
        const { form } = this.state;
        //
        return (
            <div className={classes.root}>
                <Inputs.Form
                    data={form}
                    size={12}
                    className="small"
                    ref="$form"
                />
                <br/>
                <Icons.ButtonT variant="contained" fullWidth color="primary" onClick={this.clickSave()} title={intl.get('services.servicesAdd')}/>
            </div>
        )
    }
}

export default Index;


function clusterHeader(){
    const sc = this;
    return (
        <Button size="small" fullWidth style={{border:'1px dashed rgb(193, 193, 193)',color:'rgb(105, 104, 104)'}} onClick={()=>{History.push('/cluster')}}>{intl.get('add')}</Button>
    )
}