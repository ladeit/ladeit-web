import intl from 'react-intl-universal'
const cache = {}

export default {
    STATUS:function(name){// TODO ： 解决：只能页面运行时获取
        if(!cache.STATUS){
            cache.STATUS = {
                '-1':intl.get('services.status.-1'),
                '0':intl.get('services.status.0'),
                '1':intl.get('services.status.1'),
                '2':intl.get('services.status.2'),
                '3':intl.get('services.status.3'),
                '4':intl.get('services.status.4'),
                '8':intl.get('services.status.8')
            }
        }
        return name ? cache.STATUS[name] : cache.STATUS;
    },
    STATUS2:function(name){//业务需要：状态补充项
        if(!cache.STATUS2){
            cache.STATUS2 = {
                '-1':' 一 ',
                '0':intl.get('services.status.0'),
                '1':intl.get('services.status.1'),
                '2':intl.get('services.status.2'),
                '3':intl.get('services.status.3'),
                '4':intl.get('services.status.4')
            }
        }
        return name ? cache.STATUS2[name] : cache.STATUS2;
    },
    RELEASE_STATUS:function(name){//
        if(!cache.RELEASE_STATUS){
            cache.RELEASE_STATUS = {
                '0':intl.get('services.releaseStatus.0'),
                '1':intl.get('services.releaseStatus.1'),
                '2':intl.get('services.releaseStatus.2'),
                '3':intl.get('services.releaseStatus.3')
            }
        }
        return name ? cache.RELEASE_STATUS[name] : cache.RELEASE_STATUS;
    },
    RELEASE_TYPE:function(name){//
        if(!cache.RELEASE_TYPE){
            cache.RELEASE_TYPE = {
                '0':intl.get('services.releaseType.0'),
                '1':intl.get('services.releaseType.1'),
                '2':intl.get('services.releaseType.2'),
                '4':intl.get('services.releaseType.4'),
                '8':intl.get('services.releaseType.8')}
        }
        return name ? cache.RELEASE_TYPE[name] : cache.RELEASE_TYPE;
    },
    DEPOLY_STATUS:function(name){//
        if(!cache.DEPOLY_STATUS){
            cache.DEPOLY_STATUS = [
                intl.get('services.deploy.status.1'),
                intl.get('services.deploy.status.2'),
                intl.get('services.deploy.status.3'),
                intl.get('services.deploy.status.4')
            ]
        }
        return name ? cache.DEPOLY_STATUS[name] : cache.DEPOLY_STATUS;
    },

    groupTopo(groupId,callback){
        _.ajax({url:`/api/v1/resource/group/${groupId}/topology`},(res)=>{callback(res)})
    },
    groupList(callback){
        _.ajax({url:'/api/v1/servicegroup/get',params:{GroupName:'',OrderParam:''}},(res)=>{callback(res)})
    },
    groupDel(data,callback){
        _.ajax({url:`/api/v1/servicegroup/del/${data.id}`,method:'delete',data:{isdelService:data.isdelService}},(res)=>{callback(res||true)},()=>{callback()})
    },
    groupUpdateName(data,callback){
        // {id,name}
        _.ajax({url:`/api/v1/servicegroup/updateGroupName`,method:'put',data:data},(res)=>{callback(res||true)},()=>{callback()})
    },
    groupListByName(name,callback){// 查询单个group信息
        let oriData = cache['groupListByName']
        // if(oriData && oriData.filter == name){
        //     callback([oriData]);
        // }else{
            let user = _.local("user");
            let url = user.username=='admin' ? `/api/v1/servicegroup/get/admin` : `/api/v1/servicegroup/get`;
            _.ajax({url:url,params:{GroupName:name}},(res)=>{
                if(!res || res.length<1){
                    //window.Store.notice.add({text:'未查询到此分组 ！',type:'error'})
                    window.History.replace('/nomatch');
                }else{
                    res.filter = name;
                    _.ajax({url:'/api/v1/servicegroup/getGroupToken',params:{ServiceGroupId:res[0].id}},(tokenInfo)=>{
                        let one = res[0];
                        one.token = tokenInfo.content;
                        cache['groupListByName'] = oriData;
                        callback(res);
                    })
                }
            },(res)=>{
                if(res.code=='1100'){
                    window.History.replace('/noauth');
                }
            })
        //}
    },
    groupUsersList(param,callback){
        //  {currentPage,pageSize,ServiceGroupId}
        _.ajax({url:'/api/v1/servicegroup/getUsers',params:param},(res)=>{callback(res)})
    },
    groupUsersListByName(p,callback){
        //  {ServiceGroupId, UserName, Email}
        if(p.UserName.indexOf('@')>-1){
            p.Email = p.UserName;
            p.UserName = '';
        }
        _.ajax({url:'/api/v1/servicegroup/getAddUsers',params:p},(res)=>{callback(res)})
    },
    groupUsersInvite(data,callback){
        _.ajax({url:'/api/v1/servicegroup/addServiceGroupRelationList',method:'post',data:data},(res)=>{callback(res)})
    },
    groupUsersList_nopage(param,callback){
        _.ajax({url:'/api/v1/servicegroup/getNoPagerUsers',params:param},(res)=>{callback(res)})
    },
    groupUserDel(data,callback){
        _.ajax({url:`/api/v1/servicegroup/deleteServiceGroupRelation`,method:'delete',data:data},(res)=>{callback(res||true)},()=>{callback()})
    },
    groupUserLeave(groupId,callback){
        _.ajax({url:`/api/v1/servicegroup/leave/${groupId}`,method:'delete'},(res)=>{callback(res||true)},()=>{callback()})
    },
    groupUserServiceAuth(data,callback){
        // {"userServiceReId":"","serviceName":"","roleNum":"","serviceId":"","userId":"","id":""}
        _.ajax({url:`/api/v1/servicegroup/updateServiceRelatio`,method:'put',data:data},(res)=>{callback(res)})
    },
    groupUserGroupAuth(data,callback){
        // {accessLevel,id,serviceGroupId,userId}
        _.ajax({url:`/api/v1/servicegroup/updateServiceGroupRelatio`,method:'put',data:data},(res)=>{callback(res)})
    },
    groupUsersAuthList(param,callback){
        //  {currentPage,pageSize,ServiceGroupId,UserId}
        _.ajax({url:'/api/v1/servicegroup/getSeriveUserInfo',params:param},(res)=>{callback(res)})
    },
    groupAdd(data,callback){
        _.ajax({url:'/api/v1/servicegroup/add',method:'post',data:data},(res)=>{callback(res)},()=>{callback()})
    },
    groupAddService(data,callback){
        // {name,serviceGroupId,clusterId,envId}
        _.ajax({url:'/api/v1/service/addService',method:'post',data:data},(res)=>{callback(res)})
    },

    groupSlackChannel(params,callback){
        // {ServiceGroupId}
        _.ajax({url:'/api/v1/servicegroup/getChannel',method:'get',params:params},(res)=>{callback(res)})
    },
    groupSlackChannelDel(data,callback){
        // {channelServiceGroupId}
        _.ajax({url:`/api/v1/servicegroup/unbind/${data.channelServiceGroupId}`,method:'delete'},(res)=>{callback(res)})
    },
    serviceSelects(ServiceId,callback){
        _.ajax({url:`/api/v1/message/user/service`},(res)=>{callback(res)})
    },
    serviceMap(params,callback){ // cache
        // {ServiceId,ServiceGroup,ServiceName}
        let oriData = cache['serviceMap'];
        let uuid = `${params.ServiceGroup}_${params.ServiceName}`;
        if(oriData && oriData.uuid == uuid ){
            callback(oriData);
        }else{
            _.ajax({url:'/api/v1/servicegroup/getService',params:params},(res)=>{
                if(!res || res.length<1){
                    //window.Store.notice.add({text:'未查询到此服务 ！',type:'error'})
                    window.History.replace('/nomatch');
                }else {
                    oriData = res[0];
                    oriData.uuid = uuid;
                    cache['serviceMap'] = oriData;
                    callback(oriData)
                }
            },(res)=>{
                if(res.code=='1100'){
                    window.History.replace('/noauth');
                }
            })
        }
        //_.ajax({url:'/api/v1/servicegroup/getService',params:params},(res)=>{callback(res[0])})
    },
    serviceConfiguration(ServiceId,callback){
        _.ajax({url:`/api/v1/resource/${ServiceId}/configuration`},(res)=>{callback(res)})
    },
    serviceServiceYaml(data,callback){
        _.ajax({url:`/api/v1/resource/${data.serviceId}`,method:'post',data:data.yaml},(res)=>{callback(res)})
    },
    serviceYamlHistory(params,callback){
        // {ServiceGroupId:'',ServiceId:'',currentPage:'1',pageSize:'20'}
        _.ajax({url:`/api/v1/yaml/get`,params:params},(res)=>{callback(res)})
    },
    serviceServiceMap(params,callback){// 服务 - 服务
        _.ajax({url:`/api/v1/resource/${params.id}`},(res)=>{callback(res)})
    },
    serviceInfoMap(params,callback){
        // {ServiceId}
        _.ajax({url:'/api/v1/service/getServiceInfos',params:params},(res)=>{callback(res)})
    },
    serviceInfoScale(ServiceId,callback){
        _.ajax({url:`/api/v1/resource/${ServiceId}/pod`},(res)=>{callback(res)})
    },
    serviceInfoScaleUpdate(data,callback){
        // {serviceId,count}
        _.ajax({url:`/api/v1/resource/${data.serviceId}/pod`,data:data.count,method:'put'},(res)=>{callback(res)})
    },

    serviceEventTips(callback){
        _.ajax({url:'/api/v1/service',method:'get',data:{}},(res)=>{callback(res)})
    },
    serviceAdd(){
        _.ajax({url:'/api/v1/servicegroup/addservice',method:'post',data:{}},(res)=>{callback(res)})
    },
    serviceDel(data,callback){
        // {id,isDelK8s}
        _.ajax({url:`/api/v1/service/delete`,method:'delete',data:data},(res)=>{callback(res)})
    },
    serviceRobot(data,callback){
        //
        _.ajax({url:`/api/v1/service/addServicePublishBot`,method:'post',data:data},(res)=>{callback(res||true)},()=>{callback()})
    },
    serviceTopo(serviceId,callback){
        _.ajax({url:`/api/v1/resource/${serviceId}/topology`},(res)=>{callback(res)})
    },
    serviceTopoUpdate(data,callback){
        _.ajax({url:`/api/v1/resource/${data.serviceId}/topology`,method:'put',data:data.topo},(res)=>{callback(res)})
    },

    imageList(ServiceId,callback){
        _.ajax({url:`/api/v1/servicegroup/getImages/${ServiceId}`},(res)=>{callback(res)})
    },
    imageMap(params,callback){
        // {ServiceGroup,ServiceName,ImageVersion}
        _.ajax({url:`/api/v1/service/image`,params:params},(res)=>{callback(res)})
    },
    imageMapByName(params,callback){
        // {ServiceGroup,ServiceName,ImageVersion}
        _.ajax({url:`/api/v1/servicegroup/service/image`,params:params},(res)=>{callback(res)})
    },
    imageFilterList(params,callback){
        // {currentPage,pageSize,StartDate,EndDate}
        _.ajax({url:`/api/v1/servicegroup/getPageImages/${params.id}`,params:params},(res)=>{callback(res)})
    },
    imagePut(data,callback){
        // {id,version}
        _.ajax({url:`/api/v1/servicegroup/Image/${data.id}`,method:'put',data:data},(res)=>{callback(res)})
    },

    releaseList(params,callback){
        // {ServiceId}
        _.ajax({url:'/api/v1/servicegroup/getReleases',params:params},(res)=>{callback(res)})
    },
    releaseConsole(id,callback){
        // {ServiceId}
        _.ajax({url:`/api/v1/resource/name/${id}`},(res)=>{callback(res)})
    },

    releaseMap(params,callback){
        _.ajax({url:'/api/v1/release/getOne',params:params},(res)=>{callback(res)})
    },
    releaseAdd(params,callback){
        // {name:'release none -> 0.04',service:{envId:1},candidate:{imageId:'',podCount:2}}
        _.ajax({url:'/api/v1/release',method:'post',data:params},(res)=>{callback(res||true)},()=>{callback()})
    },
    releaseUpdate(params,callback){
        // {name:'release none -> 0.04',service:{envId:1},candidate:{imageId:'',podCount:2}}
        _.ajax({url:'/api/v1/release',method:'put',data:params},(res)=>{callback(res||true)},()=>{callback()})
    },

    tokenGenerate(data,callback){
        // {serviceGroupId}
        _.ajax({url:`/api/v1/servicegroup/updateGroupToken`,method:'put',data:data},(res)=>{callback(res||true)},()=>{callback()})
    },
    tokenServiceGenerate(data,callback){
        // {id,name}
        _.ajax({url:`/api/v1/service/updateServiceToken`,method:'put',data:data},(res)=>{callback(res||true)},()=>{callback()})
    },

    serviceWorkloadsList(params,callback){
        _.ajax({url:`/api/v1/resource/workloads/${params.serviceId}`},(res)=>{callback(res)})
    },
    serviceInfoList(params,callback){
        _.ajax({url:`/api/v1/resource/services/${params.serviceId}`},(res)=>{callback(res)})
    },

    // == service - charts
    serviceHeatmapChart(params,callback){
        // {TargetId, Startdate, EndDate}
        let result = cache['service_heatmap'];
        if(result && (result.id == params.TargetId)){
            callback(result.data)
        }else{
            _.ajax({url:'/api/v1/service/getHeatMap',params:params},(res)=>{
                result = {id:params.TargetId,data:res};
                cache['service_heatmap'] = result;
                callback(res)
            },()=>{callback()})
        }
    },

    eventNote(data,callback){
        // {id,uid, reason , type , note , 时间 , startTime , endTime , pageSize , pageNum }
        _.ajax({url:`/api/v1/event/${data.serviceId}`,method:'post',data:data},(res)=>{callback(res)})
    },
    eventTopo(id,callback){
        //id = '48188919-993a-4083-a5b5-d2412fc38bec'
        _.ajax({url:`/api/v1/event/${id}`,method:'get'},(res)=>{callback(res)})
    },
}

