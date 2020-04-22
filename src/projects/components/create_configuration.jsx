import React from 'react';
import clsx from 'clsx'
import EditIcon from '@material-ui/icons/Edit';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import {
    withStyles,Typography,Paper,IconButton,Button,Grid,Input,TextField,InputAdornment,FormControl,InputLabel,Select,MenuItem
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import TagsInput from "react-tagsinput"
import Autocomplete from '@material-ui/lab/Autocomplete'
import Inputs from 'components/Form/inputs.jsx'
import intl from 'react-intl-universal'
import Services from '@/projects/Service'

import DL from '@/static/store/CLUSTER_ADD.js'

const style = theme => ({
    form:{
        '&>div':{
            minHeight:'40px',
            justifyContent:'center',
            marginBottom:'6px'
        },
        '&>div.label':{
            minHeight:'48px',
            '&>label':{
                marginTop:'8px'
            },
            '& .action':{
                marginTop:'8px'
            }
        },

        '& label.key':{
            width:'80px'
        },
        '& .action':{
            display:'flex',
            alginItems: "center"
        },
        '& .must_tag':{
            marginRight:'3px',
            color:'red'
        },
        '& .must_tag.info':{
            color:'#3f51b5'
        }
    }
})

const configuration = {
    "host":['*'],
    "type":"deployment",// deployment/statefulset/replicationcontrolller
    "replicas":1,// 数量
    "ports":[{name:'',containerPort:'',servicePort:''}], // name,containerPort,servicePort
    "envs":[{key:'',value:''}],// {key,value}
    "command":"",
    "args":[],
    "volumes":[{name:'',path:'',type:''}],// {name,path,type}
    // "livenessProbe":{
    //     "protocol":"TCP",// 协议
    //     "path":"",// 路径
    //     "port":'',// 端口
    //     "initialDelaySeconds":0,// 延迟
    //     "periodSeconds":0,// 频率
    //     "timeoutSeconds":'',// 超时
    //     "successThreshold":0,// 健康阀值
    //     "failureThreshold":0,// 不健康阀值
    //     "command":"",
    //     "heads":[],
    //     "type":""
    // }
    resourceQuota:false,
    cpuLimit:'',
    cpuLimitUnit:'',
    memLimit:'',
    memLimitUnit:'',
    cpuRequest:'',
    cpuRequestUnit:'',
    memRequest:'',
    memRequestUnit:''
}
const form_quota = [
    {name:'cpuLimit',label:'LimitCPU',size:4,value:"",valid:['numberOrNull']},
    {name:'cpuLimitUnit',label:'',size:2,value:'m',type:'select',options:['m','core']},
    {name:'memLimit',label:'LimitMemory',size:4,value:"",valid:['numberOrNull']},
    {name:'memLimitUnit',label:'',size:2,value:'m',type:'select',options:['m','Mi','Gi']},
    {name:'cpuRequest',label:'RequestCPU',size:4,value:"",valid:['numberOrNull']},
    {name:'cpuRequestUnit',label:'',size:2,value:'m',type:'select',options:['m','core']},
    {name:'memRequest',label:'RequestMemory',size:4,value:"",valid:['numberOrNull']},
    {name:'memRequestUnit',label:'',size:2,value:'m',type:'select',options:['m','Mi','Gi']},
];
let envForm = [];

function reset(obj,name){
    name && (obj[name] = [...obj[name]]);
}

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        envForm = [
            {name:'resourceQuota',label:intl.get('namespace.formResourceQuota'),size:12,value:false,type:'checked',valid:[]},
        ]
        //
        let { renderStep } = this.props;
        this.config = DL.config();
        this.state.sData = _.cloneDeep(configuration);
        renderStep({type:'active'},'-');
    }

    componentDidMount(){
        envForm[0].valid[0] = this.changeResourceQuota;
        this.loadData();
    }

    state = {
        sData:'',
        form:[]
    }

    loadData = ()=>{
        const sc = this;
        const createType = this.config.createType;
        const { serviceData } = this.props;
        if([4,8].indexOf(createType.type)>-1){
            Services.serviceConfiguration(serviceData.id,function(res){
                if(res){
                    for(let key in configuration){
                        if(!res[key]){
                            res[key] = configuration[key];
                        }
                    }
                    delete res.livenessProbe;
                    envForm.map(function (v) {v.value = res[v.name];})
                    form_quota.map(function (v) {v.value = res[v.name];})
                    form_quota[1].value || (form_quota[1].value = 'm');
                    form_quota[3].value || (form_quota[3].value = 'm');
                    form_quota[5].value || (form_quota[5].value = 'm');
                    form_quota[7].value || (form_quota[7].value = 'm');
                    sc.setState({sData:res});
                    sc.refs.$envForm.setForm([...envForm]);
                    sc.changeResourceQuota(envForm[0]);
                }
            })
        }
    }

    changeAutoInput(name,item){
        const sc = this;
        return (e,value,opr)=>{
            if(opr=="reset"){
                //item[name] = value;
                //sc.forceUpdate();
            }else{
                item[name] = value;
                sc.forceUpdate();
            }
        }
    }

    changeInput = (name,value)=>{
        let data = this.state.sData;
        data[name] = value;
        this.forceUpdate();
    }

    changeArrayInput(name,item){
        const sc = this;
        return (e)=>{
            item[name] = e.target.value;
            sc.forceUpdate();
        }
    }

    arrayDelete(index,list){
        const sc = this;
        return ()=>{
            list.splice(index,1)
            sc.forceUpdate();
        }
    }

    arrayAdd(index,list){
        const sc = this;
        return ()=>{
            list.splice(index,0,{id:_.udid()})
            sc.forceUpdate();
        }
    }

    changeResourceQuota = (column)=>{
        let form = envForm;
        form.length = 1;
        if(!column.value){
            //this.forceUpdate();
        }else{
            Array.prototype.push.apply(form,form_quota)
        }
        this.refs.$envForm.setForm([...form]);
    }

    clickSubmit = ()=>{
        let config = this.config;
        let { renderStep } = this.props;
        let sData = this.state.sData;
        if(sData.host.length<1){
            window.Store.notice.add({text:intl.get('services.createCfg.tipsMustHost'),type:'warning'})
            return;
        }
        if(sData.replicas<1){
            window.Store.notice.add({text:intl.get('services.createCfg.tipsMustReplicas'),type:'warning'})
            return;
        }
        let hasPorts = sData.ports.filter(function(v){return v.name && v.containerPort && v.servicePort;})
        if(hasPorts.length<1){
            window.Store.notice.add({text:intl.get('services.createCfg.tipsMustPorts'),type:'warning'})
            return;
        }
        //
        let envMap = this.refs.$envForm.getData();
        config.createConfiguration = _.extend(sData,envMap);
        if(config.createService.type=='8'){
            renderStep({type:'active'},'CreateComplete');
        }else if(config.createService.type=='4'){
            renderStep({type:'active'},'CreateTopology');
        }else{
            renderStep(false);
        }
    }

    renderStorageHtml = (item)=>{
        const sc = this;
        return (
            <Grid container spacing={1}>
                <Grid item xs={2} className="flex-bottom">{intl.get('services.createCfg.protocol')}</Grid><Grid item xs={4}>
                    <Select fullWidth
                        value={item.protocol}
                        onChange={sc.changeArrayInput('protocol',item)}
                    >
                        <MenuItem value="TCP">TCP</MenuItem><MenuItem value="UDP">UDP</MenuItem>
                    </Select>
                </Grid><Grid item xs={6}></Grid>
                <Grid item xs={2} className="flex-bottom">{intl.get('services.createCfg.path')}</Grid><Grid item xs={4}>
                    <Input fullWidth
                       value={item.path}
                       onChange={sc.changeArrayInput('path',item)}
                    />
                </Grid><Grid item xs={6}></Grid>
                <Grid item xs={2} className="flex-bottom">{intl.get('services.createCfg.port')}</Grid><Grid item xs={4}>
                    <Input fullWidth
                       value={item.port}
                       onChange={sc.changeArrayInput('port',item)}
                    />
                </Grid><Grid item xs={6}></Grid>
                <Grid item xs={2} className="flex-bottom">{intl.get('services.createCfg.initialDelaySeconds')}</Grid><Grid item xs={4}>
                    <Input fullWidth type="number" endAdornment={<InputAdornment position="end">s</InputAdornment>}
                           value={item.initialDelaySeconds}
                           onChange={sc.changeArrayInput('initialDelaySeconds',item)}
                    />
                </Grid><Grid item xs={6}></Grid>
                <Grid item xs={2} className="flex-bottom">{intl.get('services.createCfg.periodSeconds')}</Grid><Grid item xs={4}>
                    <Input fullWidth type="number" endAdornment={<InputAdornment position="end">s</InputAdornment>}
                           value={item.periodSeconds}
                           onChange={sc.changeArrayInput('periodSeconds',item)}
                    />
                </Grid><Grid item xs={6}></Grid>
                <Grid item xs={2} className="flex-bottom">{intl.get('services.createCfg.timeoutSeconds')}</Grid><Grid item xs={4}>
                    <Input fullWidth type="number" endAdornment={<InputAdornment position="end">s</InputAdornment>}
                           value={item.timeoutSeconds}
                           onChange={sc.changeArrayInput('timeoutSeconds',item)}
                    />
                </Grid><Grid item xs={6}></Grid>
                <Grid item xs={2} className="flex-bottom">{intl.get('services.createCfg.successThreshold')}</Grid><Grid item xs={4}>
                    <Input fullWidth type="number"
                           value={item.successThreshold}
                           onChange={sc.changeArrayInput('successThreshold',item)}
                    />
                </Grid><Grid item xs={6}></Grid>
                <Grid item xs={2} className="flex-bottom">{intl.get('services.createCfg.failureThreshold')}</Grid><Grid item xs={4}>
                    <Input fullWidth type="number"
                           value={item.failureThreshold}
                           onChange={sc.changeArrayInput('failureThreshold',item)}
                    />
                </Grid><Grid item xs={6}></Grid>
            </Grid>
        )
    }

    render = ()=>{
        const sc = this;
        const {classes} = this.props;
        const {form,sData} = this.state;
        //
        return (
            <div style={{"width":"680px",margin:'16px',padding:'16px'}} className={classes.form}>
                <div className="flex-r" >
                    <label className="key flex-one overflow-text flex-middle" ><b className={clsx('must_tag',sData.host.length>0 && 'info')}>*</b>HOST：</label>
                    <div className="flex-box">
                        <TagsInput
                            addOnBlur={true}
                            tagProps={{ className: "react-tagsinput-tag info" }}
                            value={sData.host}
                            onChange={(value)=>{this.changeInput('host',value)}}
                            inputProps={{placeholder:intl.get('services.createCfg.inputAddress')}}
                        />
                    </div>
                </div>
                <div className="flex-r" >
                    <label className="key flex-one overflow-text flex-middle" ><b className={clsx('must_tag',sData.replicas>0 && 'info')}>*</b>{intl.get('services.createCfg.replicas')}：</label>
                    <div className="flex-box">
                        <Input
                            type="number"
                            value={sData.replicas}
                            onChange={(e)=>{sc.changeInput('replicas',e.target.value)}}
                        />
                    </div>
                </div>
                <div className="flex-r" >
                    <label className="key flex-one overflow-text flex-middle" >{intl.get('services.createCfg.type')}：</label>
                    <div className="flex-box">
                        <Select
                            labelId="demo-simple-select-label"
                            value={sData.type}
                            onChange={(e)=>{this.changeInput('type',e.target.value)}}
                            style={{width:'146px'}}
                        >
                            <MenuItem value="Deployment">Deployment</MenuItem>
                            <MenuItem value="Statefulset">Statefulset</MenuItem>
                            <MenuItem value="Replicationcontrolller">Replicationcontrolller</MenuItem>
                        </Select>
                    </div>
                </div>
                <div className="flex-r" >
                    <label className="key flex-one overflow-text flex-middle" >{intl.get('services.createCfg.port')}：</label>
                    <div className="flex-box">
                        {
                            sData.ports.map(function (one,index) {
                                one.id || (one.id = index);
                                return (
                                    <Grid container spacing={3} key={one.id}>
                                        <Grid item xs={4}>
                                            <Input fullWidth placeholder={intl.get('services.createCfg.name')}
                                                   value={one.name||""}
                                                   onChange={sc.changeArrayInput('name',one)}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Input fullWidth placeholder={intl.get('services.createCfg.containerPort')}
                                                   value={one.containerPort||""}
                                                   onChange={sc.changeArrayInput('containerPort',one)}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Input fullWidth placeholder={intl.get('services.createCfg.servicePort')}
                                                   value={one.servicePort||""}
                                                   onChange={sc.changeArrayInput('servicePort',one)}
                                            />
                                        </Grid>
                                        <Grid item xs={2} className="action">
                                            {sData.ports.length>1 && <IconButton size={'small'} color="primary" onClick={sc.arrayDelete(index,sData.ports)}><RemoveCircleIcon /></IconButton>}
                                            <IconButton size={'small'} color="primary" onClick={sc.arrayAdd(index+1,sData.ports)}><AddCircleIcon /></IconButton>
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex-r" >
                    <label className="key flex-one overflow-text flex-middle" >{intl.get('services.createCfg.env')}：</label>
                    <div className="flex-box">
                        {
                            sData.envs.map(function (one,index) {
                                one.id || (one.id = index);
                                return (
                                    <Grid container spacing={3} key={one.id}>
                                        <Grid item xs={3}>
                                            <Input fullWidth
                                                   value={one.key||""}
                                                   onChange={sc.changeArrayInput('key',one)}
                                            />
                                        </Grid>
                                        <b style={{marginTop:'24px'}}>:</b>
                                        <Grid item xs={3}>
                                            <Input fullWidth
                                                   value={one.value||""}
                                                   onChange={sc.changeArrayInput('value',one)}
                                            />
                                        </Grid>
                                        <Grid item xs={3} className="action">
                                            {sData.envs.length>1 && <IconButton size={'small'} color="primary" onClick={sc.arrayDelete(index,sData.envs)}><RemoveCircleIcon /></IconButton>}
                                            <IconButton size={'small'} color="primary" onClick={sc.arrayAdd(index+1,sData.envs)}><AddCircleIcon /></IconButton>
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex-r" >
                    <label className="key flex-one overflow-text flex-middle" >{intl.get('services.createCfg.command')}：</label>
                    <div className="flex-box">
                        <Input
                            value={sData.command}
                            onChange={(e)=>{sc.changeInput('command',e.target.value)}}
                        />
                    </div>
                </div>
                <div className="flex-r" >
                    <label className="key flex-one overflow-text flex-middle" >{intl.get('services.createCfg.args')}：</label>
                    <div className="flex-box">
                        <TagsInput
                            addOnBlur={true}
                            tagProps={{ className: "react-tagsinput-tag info" }}
                            value={sData.args}
                            onChange={(value)=>{sc.changeInput('args',value)}}
                            inputProps={{placeholder:intl.get('services.createCfg.inputArgs')}}
                        />
                    </div>
                </div>
                <div className="flex-r">
                    <label className="key flex-one overflow-text flex-middle" >{intl.get('services.createCfg.store')}：</label>
                    <div className="flex-box">
                        {
                            sData.volumes.map(function (one,index) {
                                one.id || (one.id = index)
                                return (
                                    <Grid container spacing={3} key={one.id}>
                                        <Grid item xs={3}>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                fullWidth
                                                inputProps={{placeholder:intl.get('services.createCfg.type')}}
                                                value={one.type||""}
                                                onChange={sc.changeArrayInput('type',one,"volumes")}
                                            >
                                                <MenuItem value="PVC">PVC</MenuItem>
                                                <MenuItem value="Storageclass">Storageclass</MenuItem>
                                            </Select>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Input size={'small'}  fullWidth placeholder={intl.get('services.createCfg.inputPath')}
                                               value={one.path||""}
                                               onChange={sc.changeArrayInput('path',one,"volumes")}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Autocomplete
                                                size={'small'}
                                                autoSelect={true}
                                                freeSolo
                                                options={['zzss']}
                                                value={one.name}
                                                onChange={sc.changeAutoInput('name',one,'volumes')}
                                                onInputChange={sc.changeAutoInput('name',one,'volumes')}
                                                renderInput={ params => {
                                                    params.inputProps.placeholder = "输入pvc";
                                                    return <TextField {...params} style={{margin:'0'}} margin="normal" fullWidth />
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={3} className="action">
                                            { sData.volumes.length>1 && <IconButton size={'small'} color="primary" onClick={sc.arrayDelete(index,sData.volumes)} ><RemoveCircleIcon /></IconButton>}
                                            <IconButton size={'small'} color="primary"  onClick={sc.arrayAdd(index+1,sData.volumes)}><AddCircleIcon /></IconButton>
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                    </div>
                </div>
                <Inputs.Form data={envForm} size={6} className="small" ref="$envForm" />
                <div className={clsx(classes.row)}>
                    <Button color="primary" variant="contained" size="small" onClick={this.clickSubmit}>{intl.get('nextStep')}</Button>
                </div>
            </div>
        )
    }
}

/* 注释：存活检查
    <div className="flex-r"  style={{height:'inherit',padding:'24px 0'}}>
    <label className="flex-one overflow-text" style={{paddingTop:'8px'}}>存活检查：</label>
    <div className="flex-box" >
        {this.renderStorageHtml(sData.livenessProbe)}
    </div>
    </div>
*/



export default Index;
