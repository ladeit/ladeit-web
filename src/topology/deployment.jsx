import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,observer,inject} from "mobx-react"
import clsx from 'clsx'
import {
    CheckCircle as CheckCircleIcon,
    Edit as EditIcon,
    Close as CloseIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Badge,Divider,Button,IconButton,
    Paper,Grid
} from '@material-ui/core';
import Inputs from 'components/Form/inputs.jsx'
import Icons from 'components/Icons/icons.jsx'
import Timeline from 'components/TimeLine/nav.jsx'
import DL from '@/static/store/CLUSTER_ADD.js'
// template
import CreateVersionT from '../projects/components/create_version.jsx'
import CreateTypeT from '../projects/components/create_type.jsx'
import CreateFirstT from '../projects/components/create_first.jsx'
import CreateServiceT from '../projects/components/create_first_service.jsx'
import CreateService1T from '../projects/components/create_service_1.jsx'
import CreateService2T from '../projects/components/create_service_2.jsx'
import CreateService4T from '../projects/components/create_service_4.jsx'
import CreateCompleteT from '../projects/components/create_complete.jsx'
import CreateTopologyT from '../projects/components/create_topology.jsx'
import CreateConfigurationNewT from '../projects/components/create_configuration_select'
import CreateConfigurationT from '../projects/components/create_configuration'

const style = theme => ({
    root:{
        width:'100%',
        overflow:'auto',
        '& .closeIcon':{
            position: 'absolute',
            right: '8px'
        }
    },
    area:{
        width: '912px',
        margin: '0 auto'
    }
})

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        const { serviceData,handleClose } = this.props;
        DL.addFlow({
            id:'Complete',
            title:"Complete",
            isLast:true,
            type:'text'
        })
        DL.addFlow({
            id: 'CreateVersion',
            nextId:serviceData.status!=-1?'CreateType':'CreateFirst',
            title: "Select Version",
            type: 'active',
            content:<CreateVersionT serviceData={serviceData} renderStep={this.nextStep('CreateVersion')} />
        })
        DL.addFlow({
            id:'CreateType',
            nextId:'CreateService',
            title:"Deployment type",
            content:<CreateTypeT serviceData={serviceData} renderStep={this.nextStep('CreateType')} />
        })
        DL.addFlow({
            id:'CreateFirst',
            nextId:'CreateService',
            title:"Deployment type",
            content:<CreateFirstT serviceData={serviceData} renderStep={this.nextStep('CreateFirst')} />
        })
        // service
        DL.addFlow({
            id:'CreateService',
            nextId:serviceData.status!=-1?'CreateTopology':'CreateComplete',
            title:"Config type",
            content:<CreateServiceT serviceData={serviceData} renderStep={this.nextStep('CreateService')} />
        })
        DL.addFlow({
            id:'CreateService_1',
            nextId:'CreateComplete',
            title:"Config type",
            content:<CreateService1T serviceData={serviceData} renderStep={this.nextStep('CreateService_1')} />
        })
        DL.addFlow({
            id:'CreateService_2',
            nextId:'CreateComplete',
            title:"Config type",
            content:<CreateService2T serviceData={serviceData} renderStep={this.nextStep('CreateService_2')} />
        })
        DL.addFlow({
            id:'CreateService_4',
            nextId:'CreateComplete',
            title:"Config type",
            content:<CreateService4T serviceData={serviceData} renderStep={this.nextStep('CreateService_4')} />
        })
        //
        DL.addFlow({
            id:'CreateTopology',
            nextId:'CreateComplete',
            title:"Topology",
            content:<CreateTopologyT serviceData={serviceData} renderStep={this.nextStep('CreateTopology')} />
        })
        DL.addFlow({
            id:'CreateConfigurationNew',
            nextId:'CreateConfiguration',
            title:"Modify Configuration",
            content:<CreateConfigurationNewT serviceData={serviceData} renderStep={this.nextStep('CreateConfigurationNew')} />
        })
        DL.addFlow({
            id:'CreateConfiguration',
            nextId:'CreateComplete',
            title:"Configuration",
            content:<CreateConfigurationT serviceData={serviceData} renderStep={this.nextStep('CreateConfiguration')} />
        })

        DL.addFlow({
            id:'CreateComplete',
            title:"Submit All ? ",
            isLast:true,
            content:<CreateCompleteT serviceData={serviceData} renderStep={this.nextStep('CreateComplete')}  handleClose={handleClose}/>
        })
        //
        DL.clear();
        this.state.data = DL.getData(true);
    }

    state = {
        data:[]
    }

    nextStep(nowName){
        const sc = this;
        return (opt,NEXT_NAME)=>{
            let lastFlow = DL.getFlow(nowName);
            let nextId = NEXT_NAME || lastFlow.nextId || '-';
            if(nextId != '-'){
                DL.getFlow(nowName,{type:'ok'})
                lastFlow = DL.getFlow(nextId,opt)
                DL.clear([nextId]);
                DL.updateData([nowName,nextId])
            }else{
                lastFlow = DL.getFlow(nowName,opt)
                DL.updateData([nowName])
            }
            sc.setState({data: DL.getData()})
            //
            // 滚动到指定锚点
            setTimeout(function(){
                if(lastFlow.type=='active'){
                    location.hash = `#tl_${lastFlow.id}`;
                }else if(lastFlow.type=='load'){
                    lastFlow.type = 'loaded';
                    sc.setState({data: DL.getData()})
                }
            },360)
        }
    }

    render = ()=>{
        const { classes,serviceData,handleClose } = this.props;
        const { data } = this.state;
        let height = document.documentElement.offsetHeight;
        //
        return (
            <Paper className={clsx(classes.root,'flex-r')} style={{minHeight:height+'px'}}>
                <IconButton className="closeIcon" onClick={()=>{handleClose(false)}} ><CloseIcon /></IconButton>
                <div className={classes.area} >
                    <Timeline data={data} />
                    <div className="split1"></div>
                </div>
            </Paper>
        )
    }
}

export default Index;
