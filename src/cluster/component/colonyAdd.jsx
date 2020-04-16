import React from 'react'
import clsx from 'clsx'
import {
    withStyles,Typography,Divider,
    TextField,
    Button,TextareaAutosize,Grid
} from '@material-ui/core'
import Inputs from 'components/Form/inputs.jsx'
import Service from '../Service'
import AuthFilter from '@/AuthFilter.jsx'
import intl from 'react-intl-universal'

const styles = {
    root: {
        width:'360px',
        padding:'24px 36px',
        '& .row_name':{
            padding:'16px 0 8px'
        },
        '& .submitbutton':{
            padding:'32px 0'
        }
    },
    button:{
        '& button':{
            marginRight:'16px'
        }
    }
}

@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        this.loadData();
    }

    loadData(){
        const { data } = this.props;
        let form = this.state.form;
        if(data){
            form.map(function (one) {
                one.value = data[one.name];
            })
            this.state.disabled = false;
            this.id = data.id;
        }
    }

    state = {
        form:[
            {name:'k8sName',label:'k8sName',valid:['require','name']},
            {name:'k8sKubeconfig',label:'Kubeconfig',type:'textarea',props:{rows:10},valid:['require']}
        ],
        disabled:true
    }

    clickSave(){
        const sc = this;
        const { onOk,data } = this.props;
        return ()=>{
            let form = this.refs.$form;
            if(form.getError('all',true)){
                return;
            }
            //
            let param = form.getData();
            if(data){
                param.id = data.id;
            }
            Service.clusterUpdate(param,()=>{
                onOk(param.k8sName);
            })
        }
    }

    htmlButton(){
        const { classes,cancelButton } = this.props;
        const { disabled } = this.state;
        return (
            <div className={classes.button}>
                <Button size="small" variant="outlined" onClick={cancelButton} >{intl.get('cancel')}</Button>
                <Button size="small" variant="contained" color="primary" onClick={this.clickSave()} >{intl.get('access')}</Button>
            </div>
        )
    }

    htmlDrawerButton(){
        let saveText = this.id ? intl.get('update') : intl.get('access');
        return (
            <Button fullWidth variant="contained" color="primary" onClick={this.clickSave()} >{saveText}</Button>
        )
    }

    render() {
        const { classes,cancelButton,data } = this.props;
        const { form } = this.state;
        const auth = this.getClusterAuth(data);
        const tempButton = (!this.id || auth('W')) ? (cancelButton ? this.htmlButton() : this.htmlDrawerButton()) : '';
        return (
            <div className={clsx(classes.root,'colonyAdd')}>
                <div className={classes.content}>
                    <Inputs.Form data={form} size={16} ref="$form"/>
                    <div className="submitbutton">
                        {tempButton}
                    </div>
                </div>
            </div>
        )
    }
}

export default Index;
