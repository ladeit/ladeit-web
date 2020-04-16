import { observable, action, computed } from 'mobx';
import Service from '@/projects/Service'

const headerTabList = [
    //{ key: 'strategy', text: '发布策略'},
    { key: 'service', text: '服务状态'},
    { key: 'releases', text: '镜像'},
    { key: 'deployments', text: '发布记录'},
    { key: 'setting', text: '设置'},
    //{ key: 'info', text: '发布信息'}
]
const item = {
    name:"buzzy-k8s-ms",
    _tabValue:'dev',
    _tab:[
        {key: 'dev', text: 'DEV'},
        {key: 'test', text: 'TEST'},
        {key: 'staging', text: 'STAGING'},
        {key: 'prod', text: 'PROD'}
    ]
}

// 资源项
class Store {
    headerTabList = headerTabList;
    item = item;

    @observable
    serviceData = {};
    @observable
    yamlMap = {loaded:false,groupName:'',serviceName:'',ServiceGroupId:'',ServiceId:'',pageNum:1,pageSize:20,records:[]};
    @observable
    topoOpt = {isChange:false,event:[],loaded:false,data:{}};
    @observable
    settingOpt = {menuActive:'common'};

    @action
    updateService(data){
        _.extend(this.serviceData,data);
    }

    @action
    ajaxYaml(opt){
        let map = this.yamlMap;
        map.records = [];
        loadYaml.call(this,_.extend({pageNum:1,pageSize:map.pageSize},opt))
    }

    @action
    ajaxYamlMore(){
        let map = this.yamlMap;
        loadYaml.call(this,{
            groupName:map.groupName,
            serviceName:map.serviceName,
            pageNum:++map.pageNum,
            pageSize:map.pageSize
        })
    }

    // setting
    @action
    ajaxSetting(params){
        const sc = this;
        Service.serviceMap({ServiceId:'',ServiceGroup:params._group,ServiceName:params._name},function (serviceData) {
            sc.serviceData = serviceData;
            sc.settingOpt.menuActive = params._memo;
        })
    }

    // topology
    @action
    updateTopoOpt(options){
        _.extend(this.topoOpt,options)
    }

    @action
    ajaxTopo(params){
        const sc = this;
        sc.topoOpt.event = [];
        sc.topoOpt.loaded = false;
        Service.serviceMap({ServiceId:'',ServiceGroup:params._group,ServiceName:params._name},function (serviceData) {
            //serviceData.status = 4;
            if(serviceData.status==-1){
                sc.serviceData = serviceData;
                sc.topoOpt.data = {host:[],match:[],route:[],map:[]};
                sc.topoOpt.loaded = true;
            }else if(serviceData.status==0){
                Service.serviceTopo(serviceData.id,function (result) {
                    sc.serviceData = serviceData;
                    if(result){
                        result.host || (result.host = []);
                        //
                        sc.topoOpt.data = result;
                        sc.topoOpt.loaded = true;
                    }
                })
            }else if(serviceData.status>0){
                Service.serviceTopo(serviceData.id,function (result) {
                    sc.serviceData = serviceData;
                    if(result) {
                        result.host || (result.host = []);
                        //
                        sc.topoOpt.data = result;
                        sc.topoOpt.loaded = true;
                    }
                })
                //
                serviceLoading({ServiceId:serviceData.id,ServiceGroup:params._group,ServiceName:params._name},function(serviceData){
                    //
                },function (event) {
                    sc.topoOpt.event = event;
                })
            }
        })
    }

    @action
    ajaxTopoStop(){
        clearTimeout(serviceLoading.timer);
    }
}


function loadYaml(params){
    const sc = this;
    sc.yamlMap.loaded = false;
    Service.serviceMap({ServiceId:'',ServiceGroup:params.groupName,ServiceName:params.serviceName},function (serviceData) {
        params.ServiceGroupId = serviceData.serviceGroupId;
        params.ServiceId = serviceData.id;
        params.currentPage = params.pageNum;
        Service.serviceYamlHistory(params,function (res) {
            sc.serviceData = serviceData;
            if(res.pageNum>1){
                Array.prototype.push.apply(sc.yamlMap.records,res.records);
            }else{
                params.records = res.records;
            }
            params.totalPage = res.totalPage;
            params.loaded = true;
            _.extend(sc.yamlMap,params);
        })
    })
}


function serviceLoading(params,callback,eventBack){
    Service.serviceMap(params,function (serviceData) {
        if(serviceData.status>0){
            callback(serviceData)
        }else{
            serviceLoading.timer = setTimeout(function(){
                serviceLoading(params,callback,eventBack)
                //
                Service.eventTopo(params.ServiceId,function (res) {
                    eventBack(res)
                })
            },2000)
        }
    })
}


export default new Store();
