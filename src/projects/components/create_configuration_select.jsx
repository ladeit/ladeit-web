import React from 'react';
import clsx from 'clsx'
import EditIcon from '@material-ui/icons/Edit';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import {
    withStyles,Typography,Paper,IconButton,Button,Grid,Input,TextField,InputAdornment,FormControl,InputLabel,Select,MenuItem
} from '@material-ui/core'
import Inputs from 'components/Form/inputs.jsx'
import intl from 'react-intl-universal'

import Icons from 'components/Icons/icons.jsx'
import TagsInput from "react-tagsinput"
import Autocomplete from '@material-ui/lab/Autocomplete'
import Services from '@/projects/Service'

import DL from '@/static/store/CLUSTER_ADD.js'

const style = theme => ({
    form:{
    }
})

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        this.config = DL.config();
        this.state.form = [
            {name:'newYaml',label:intl.get('services.createCfg.configOld'),size:12,value:false,type:'checked',valid:[this.changeResourceQuota]},
        ]
        //
        let { renderStep } = this.props;
        renderStep({type:'active'},'-');
        renderStep({type:'active'},'CreateComplete');
    }

    componentDidMount(){
        //
    }

    state = {
        form:[]
    }

    changeResourceQuota = (column)=>{
        let form = this.state.form;
        let config = this.config.createConfigurationNew;
        let { renderStep } = this.props;
        config.newYaml = column.value;
        if(!column.value){
            //this.forceUpdate();
            renderStep({type:'active'},'CreateComplete');
        }else{
            renderStep(false);
        }
    }

    render = ()=>{
        const sc = this;
        const {classes} = this.props;
        const {form} = this.state;
        //
        return (
            <div style={{"width":"680px",margin:'16px',padding:'16px'}} className={classes.form}>
                <Inputs.Form data={form} size={6} className="small" ref="$envForm" />
            </div>
        )
    }
}

export default Index;
