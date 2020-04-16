import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import {observer,inject} from "mobx-react"
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Close as CloseIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Divider,Button,IconButton,Tooltip,
    Paper,Grid
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import DL from '@/static/store/CLUSTER_ADD.js'

import YamlEditor from '@/cluster/component/yamlEdit.jsx'
import ColonyAdd from '@/cluster/component/colonyAdd.jsx'
import CreateFirstConfigT from './service/create_first_config.jsx'
import CreateFirstServiceT from './service/create_first_service.jsx'

import ClusterService from '@/cluster/Service'

const style = theme => ({
    paper:{
        minHeight:'128px',
        padding:'16px 24px',
        marginBottom:'16px'
    },
    hidden:{
        display:'none !important'
    },
    row:{
        padding:'16px 0'
    },
    form:{
        position:'relative'
    },
    cluster_add:{
        position:"absolute",
        top: '20px',
        left: '210px',
    },
    colonyAddPaper:{
        '& .colonyAdd':{
            width:'auto'
        },
        '& textarea':{
            height:'80px !important'
        }
    }
})

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        let { renderStep } = this.props;
        this.config = DL.config();
        this.config.createService.render = this.renderTab;
        renderStep({type:'active'},'-');
    }

    state = {
    }


    renderTab = ()=>{
        const sc = this;
        let { renderStep } = this.props;
        let config = this.config.createService;
        if(config.type == 1){
            renderStep({type:'active'},'CreateComplete');
        }else{
            renderStep({type:'active'},'CreateTopology');
        }
        sc.forceUpdate();
    }

    render(){
        const { form,form_loaded,reEdit,colonyAddVisible } = this.state;
        let { classes,serviceData } = this.props;
        let config = this.config.createService;
        let tempService = config.cluster && config.namespace && !colonyAddVisible ? <div className={classes.row}><CreateFirstServiceT  data={serviceData} ref="$service" /></div> : '';
        //
        return (
            <div className={classes.content} >
                2
                <CreateFirstConfigT  data={serviceData} />
            </div>
        )
    }
}

export default Index;
