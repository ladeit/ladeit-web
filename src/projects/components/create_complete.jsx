import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,observer,inject} from "mobx-react"
import { withStyles } from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import DL from '@/static/store/CLUSTER_ADD.js'

import Service from '../Service'
import intl from 'react-intl-universal'

class Index extends React.PureComponent {
    componentWillMount(){
        let { renderStep } = this.props;
        renderStep({type:'active'},'-');
        //
        this.config = DL.config();
    }

    state = {
        submit_loaded:false
    }

    clickSubmit(v){
        const sc = this;
        const store = window.Store;
        let { serviceData,handleClose } = this.props;
        let createVersion = this.config.createVersion;
        let createConfiguration = this.config.createConfiguration;
        let createType = this.config.createType;
        let createService = this.config.createService;
        return ()=>{
            if(createType.type==-1){// 默认配置
                if(createService.type == 1){
                    let name = createVersion.prefix + createVersion.version;
                    sc.setState({submit_loaded:true})
                    Service.releaseAdd({
                        name:name,
                        isDefault:'true',
                        configuration:_.getNotNull(createConfiguration),
                        service:{name:serviceData.name,id:serviceData.id,clusterId:createService.cluster,envId:serviceData.envId},
                        candidate:{imageId:createVersion.id,name:'ladeit',podCount:'2'}
                    },(res)=>{
                        sc.setState({submit_loaded:false})
                        if(res){
                            store.notice.add({text:intl.get('tipsSave')})
                            handleClose(true);
                        }else{
                            handleClose(false);
                        }
                    })
                }else if(createService.type == 2){
                    Service.releaseAdd(firstData(this.config,serviceData),(res)=>{
                        sc.setState({submit_loaded:false})
                        if(res){
                            store.notice.add({text:intl.get('tipsSave')})
                            handleClose(true);
                        }else{
                            handleClose(false);
                        }
                    })
                }
            }else if([1,2,4].indexOf(createType.type)>-1){
                Service.releaseUpdate(type4Data(this.config,serviceData),(res)=>{
                    sc.setState({submit_loaded:false})
                    if(res){
                        store.notice.add({text:intl.get('tipsSave')})
                        handleClose(true);
                    }else{
                        handleClose(false);
                    }
                })
            }else if(createType.type==8){
                Service.releaseUpdate(type8Data(this.config,serviceData),(res)=>{
                    sc.setState({submit_loaded:false})
                    if(res){
                        store.notice.add({text:intl.get('tipsSave')})
                        handleClose(true);
                    }else{
                        handleClose(false);
                    }
                })
            }
        }
    }

    render = ()=>{
        let { submit_loaded } = this.state;
        window.sc = this;
        //
        return (
            <div>
                <Icons.ButtonT fullWidth color="primary" variant="contained" disabled={submit_loaded} onClick={this.clickSubmit()} title={intl.get('complete')}/>
            </div>
        )
    }
}


function firstData(config,serviceData){
    let createVersion = config.createVersion;
    let createService = config.createService;// {editYaml:{}}
    // ["xx:xx"]
    let res = {};
    let resourceAO = {};
    createService.editViews.map(function(v){
        let arr = v.split(':');
        if(arr.length>1){// ao => {service:[{name:'',namespace:'',yaml:''}]}
            let ao = resourceAO[arr[0]] || (resourceAO[arr[0]] = []);
            let name = arr[0]+':'+arr[1];
            let yaml = createService.editYaml[name];
            ao.push({name:arr[1],namespace:arr[2]||'',yaml:yaml})
        }else{// 新建
            let ao = resourceAO['manualYaml'] || (resourceAO['manualYaml'] = []);
            let name = arr[0];
            ao.push({yaml:createService.editYaml[name]})
        }
    })
    res.name = createVersion.prefix + createVersion.version;
    res.isDefault = 'false';
    res.resourceAO = resourceAO;
    res.service = {name:serviceData.name,id:serviceData.id,envId:serviceData.envId};
    res.candidate = {imageId:createVersion.id,name:'ladeit',podCount:2}
    return res;
}


function type8Data(config,serviceData){// 滚动发布
    let createVersion = config.createVersion;
    let name = createVersion.prefix + createVersion.version;
    return {
        name:name,
        type:8,
        service:{name:serviceData.name,id:serviceData.id,envId:serviceData.envId},
        candidate:{imageId:createVersion.id,name:'ladeit',podCount:'2'},
        newYaml:config.createConfigurationNew.newYaml,
        configuration:config.createConfigurationNew.newYaml ?_.getNotNull(config.createConfiguration):null,
    }
}

function type4Data(config,serviceData){// ABTEST发布
    let createVersion = config.createVersion;
    let name = createVersion.prefix + createVersion.version;
    return {
        name:name,
        type:config.createType.type,
        topologyAO:config.createStrategy.flow,
        service:{name:serviceData.name,id:serviceData.id,envId:serviceData.envId},
        candidate:{imageId:createVersion.id,name:'ladeit',podCount:'2'},
        newYaml:config.createConfigurationNew.newYaml,
        configuration:config.createConfigurationNew.newYaml ? _.getNotNull(config.createConfiguration):null,
    }
}

export default Index;
