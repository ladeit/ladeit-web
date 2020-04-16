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
    Paper,Grid,TextField
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import TagsInput from "react-tagsinput"
import Autocomplete from '@material-ui/lab/Autocomplete'
import DL from '@/static/store/CLUSTER_ADD.js'

import YamlEditor from '@/cluster/component/yamlEdit.jsx'
import ColonyAdd from '@/cluster/component/colonyAdd.jsx'
import CreateFirstConfigT from './service/create_first_config.jsx'
import CreateFirstServiceT from './service/create_first_service.jsx'

import ClusterService from '@/cluster/Service'
import intl from 'react-intl-universal'

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
    },
    content:{
        '& label':{
            lineHeight:'30px'
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

    componentDidMount(){
        this.loadCluster();
    }

    loadCluster(){
        const sc = this;
        let form = this.state.form;
        sc.setState({form_loaded:false})
        ClusterService.clusterList((res)=>{
            form[0].options = res.map((v)=>{return {key: v.id,text: v.k8sName}})
            sc.setState({form: [...form],form_loaded:true})
        })
    }

    loadNamespace(id){
        const sc = this;
        let form = this.state.form;
        sc.setState({form_loaded:false})
        ClusterService.namespaceList({id:id},(res)=>{
            form[1].value = '';
            form[1].options = res;
            form[1].search = '';
            sc.setState({form: [...form],form_loaded:true})
        })
    }

    state = {
        reEdit:false,
        reNext:false,
        colonyAddVisible:false,
        form_loaded:false,
        form:[
            {name:'cluster',label:intl.get('cluster.cluster'),valid:[this.changeSelect()],type:'select',options:[]},
            {name:'namespace',label:intl.get('namespace.namespace'),valid:[this.changeSelect()],type:'select',options:[]},
            {name:'search',label:intl.get('services.createCfg.searchByNameAndLabel'),valid:[this.changeSearch()]},
        ]
    }

    clickClusterAdd(flag){
        //this.refs.$colony.setState({open:true})
        const sc = this;
        return ()=>{
            if(flag){
                sc.setState({colonyAddVisible:true})
            }else{
                sc.setState({colonyAddVisible:false})
            }
        }
    }

    clickClusterAdd_success = (name)=>{
        let form = this.state.form;
        form[0].options.push(name);
        this.setState({form: [...form],colonyAddVisible:false})
        //this.refs.$colony.setState({open:false})
    }

    toggleSelItem = (name)=>{
        let { renderStep } = this.props;
        let config = this.config.createService;
        let editViews = config.editViews;
        let index = editViews.indexOf(name);
        if(index>-1){
            editViews.splice(index,1)
        }else{
            editViews.push(name)
        }
        config.editViews = editViews;
        this.forceUpdate();
        this.refs.$service.forceUpdate();
        //
        if(editViews.length<1){
            renderStep({type:'active'},'-');
        }
    }

    clickPodsYaml(str){
        const sc = this;
        let config = this.config.createService;
        let strArr = str.split(':')
        let name = strArr[1]
        let type = strArr[0]
        return ()=>{
            let editYaml = config.editYaml;
            if(name){// 编辑
                let yaml = editYaml[`${type}:${name}`];
                sc.refs.$yaml.onOpen({clusterId:config.cluster,namespace:config.namespace,type:type,name:name},yaml)
            }else{// 新增
                let yaml = editYaml[type];
                sc.refs.$yaml.onOpen({type:type,name:""},yaml)
            }
        }
    }

    clickNewYaml(){
        const sc = this;
        return ()=>{
            sc.refs.$yaml.onOpen({type:`new_${_.udid()}`,name:""},'')
        }
    }

    clickPodsYaml_save(){
        const sc = this;
        let config = this.config.createService;
        let refs = this.refs;
        return ()=>{
            const $y = refs.$yaml;
            const {type,name} = $y.state;
            if(name){// 编辑
                config.editYaml[`${type}:${name}`] = $y.$editor.getValue();
            }else{// 新增
                config.editYaml[type] = $y.$editor.getValue();
                if(config.editViews.indexOf(type)<0){
                    config.editViews.push(type)
                }
                sc.forceUpdate();
            }
            $y.onCancel();
        }
    }

    clickSubmit = ()=>{
        let config = this.config.createService;
        let { renderStep } = this.props;
        let notice = window.Store.notice;
        if(config.editViews.length<1){
            notice.add({text:intl.get('services.createCfg.settingImport'),type:'warning'})
            return;
        }
        renderStep(false);
        //
        this.setState({reEdit:true,reNext:true})
    }

    changeSelect(){
        const sc = this;
        const fn = _.debounce(function(column){
            let config = sc.config.createService;
            sc.state.colonyAddVisible = false;
            if (column.name == 'cluster') {
                config.cluster = column.value;
                config.namespace = '';
                sc.loadNamespace(column.value)
            } else {
                config.namespace = column.value;
                config.search = ''
                //
                let form = sc.state.form;
                form[2].value = ''
                sc.setState({form: [...form],form_loaded:false})
                sc.refs.$service.loadService();
            }
        },300)
        //
        return fn;
    }

    changeSearch(){
        const sc = this;
        const fn = _.debounce(function(column){
            let config = sc.config.createService;
            config.search = column.value;
            sc.refs.$service.loadService();
        },1000)
        //
        return fn;
    }

    clickReEdit = ()=>{
        let { renderStep } = this.props;
        renderStep({type:'active'},'-');
        //
        this.setState({reEdit:false,reNext:false})
    }

    handleTags(name) {
        let sc = this;
        let config = this.config.createService;
        return (regularTags) => {
            config[name] = regularTags;
            sc.forceUpdate();
        }
    }

    renderTab = ()=>{
        const sc = this;
        let { renderStep } = this.props;
        let config = this.config.createService;
        if(config.type == 1){
            renderStep({type:'active'},'CreateConfiguration');
        }else{
            //sc.state.reNext = false;
            if(sc.state.reEdit){
                renderStep({type:'active'},'CreateComplete');
            }else{
                renderStep({type:'active'},'-');
            }
        }
        sc.forceUpdate();
    }

    render(){
        const { form,tags,reEdit,reNext,colonyAddVisible } = this.state;
        let { classes,serviceData } = this.props;
        let config = this.config.createService;
        let tempService = config.cluster && config.namespace && !colonyAddVisible ? <div className={classes.row}><CreateFirstServiceT  data={serviceData} ref="$service" /></div> : '';

        //
        return (
            <div className={classes.content} >
                <CreateFirstConfigT  data={serviceData} />
                {
                    config.type==2 && (
                        <>
                            <Paper className={classes.paper}>
                                <Typography variant="body2" component="b">{intl.get('services.createCfg.setting')}</Typography>
                                <Tooltip title={intl.get('services.createCfg.settingHandle')} >
                                    <IconButton size="small" onClick={this.clickNewYaml()}><AddIcon /></IconButton>
                                </Tooltip>
                                <div className="split">
                                    {
                                        config.editViews.map((v)=>{
                                            let shortText = v.length > 28 ? `${v.substring(0,25)}...` : v;
                                            return (
                                                <Tooltip title={v} >
                                                    <Icons.TagT title={<b className="item" onClick={this.clickPodsYaml(v)} >{shortText}</b>} icons={<CloseIcon onClick={()=>{this.toggleSelItem(v)}} />}/>
                                                </Tooltip>
                                            )
                                        })
                                    }
                                </div>
                            </Paper>
                            <Button size="small" variant="contained" className={reEdit?'':classes.hidden} onClick={this.clickReEdit}>{intl.get('services.createCfg.resetSelect')}</Button>
                            <div className={reEdit?classes.hidden:''}>
                                <div>
                                    <Typography variant="body1" component="b">{intl.get('services.createCfg.settingImport')} :  &nbsp;&nbsp;</Typography>
                                </div>
                                <div className={classes.form} >
                                    <Inputs.Form data={form} size={4} style={{width:'210px'}}/>
                                    <Tooltip title={intl.get('access')} >
                                        <IconButton className={classes.cluster_add} onClick={this.clickClusterAdd(true)}><AddIcon /></IconButton>
                                    </Tooltip>
                                </div>
                                {
                                    colonyAddVisible ? (
                                        <Paper className={classes.colonyAddPaper}>
                                            <ColonyAdd onOk={this.clickClusterAdd_success} cancelButton={this.clickClusterAdd(false)}/>
                                        </Paper>
                                    ) : ''
                                }
                                { tempService }
                            </div>
                            <div className={clsx(classes.row,reNext?'hidden':'')}>
                                <Button color="primary" variant="contained" size="small" onClick={this.clickSubmit}>{intl.get('nextStep')}</Button>
                            </div>
                        </>
                    )
                }
                <YamlEditor ref="$yaml" onOk={this.clickPodsYaml_save()}/>
            </div>
        )
    }
}

export default Index;
