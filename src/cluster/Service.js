const catche = {}

export default {
    clusterList(callback){
        _.ajax({url:'/api/v1/cluster'},(res)=>{callback(res)})
    },
    clusterByName(name,callback){
        _.ajax({url:'/api/v1/cluster/clusterName',params:{clusterName:name}},(res)=>{
            if(!res || res.length<1){
                //window.Store.notice.add({text:'未查询到此服务 ！',type:'error'})
                window.History.replace('/nomatch');
            }else {
                callback(res);
            }
        },(res)=>{
            if(res.code=='1100'){
                window.History.replace('/noauth');
            }
        })
    },
    clusterListAndEnv(callback){
        _.ajax({url:'/api/v1/cluster/getClusterAndEnv'},(res)=>{callback(res)})
    },
    clusterUpdate(data,callback){
        // {k8sKubeconfig,k8sName}
        if(data.id){
            _.ajax({url:'/api/v1/cluster',method:'put',data:data},(res)=>{callback(res)})
        }else{
            _.ajax({url:'/api/v1/cluster',method:'post',data:data},(res)=>{callback(res)})
        }
    },
    clusterDel(id,callback){
        _.ajax({url:"/api/v1/cluster",method:'delete',data:{id:id}},(res)=>{callback(res)})
    },
    clusterDelValid(id,callback){
        // {ClusterId}
        _.ajax({url:'/api/v1/cluster/env/service',method:'get',params:{ClusterId:id}},(res)=>{callback(res)})
    },
    namespaceList(data,callback){
        // {id}
        _.ajax({url:`/api/v1/cluster/namespace/${data.id}`},(res)=>{callback(res)})
    },
    namespaceDel(id,callback){
        _.ajax({url:"/api/v1/env",method:'delete',data:{id:id}},(res)=>{callback(res)})
    },
    namespaceDelValid(id,callback){
        // {EnvId}
        _.ajax({url:"/api/v1/env/service",method:'get',params:{EnvId:id}},(res)=>{callback(res)})
    },
    namespaceByName(params,callback){
        // {clusterName,envName}
        _.ajax({url:`/api/v1/env/clusterAndEnvName`,params:params},(res)=>{
            if(!res || res.length<1){
                //window.Store.notice.add({text:'未查询到此服务 ！',type:'error'})
                window.History.replace('/nomatch');
            }else {
                callback(res);
            }
        },(res)=>{
            if(res.code=='1100'){
                window.History.replace('/noauth');
            }
        })
    },
    namespaceYamlUpdate(data,callback){
        // {serviceId,yaml}
        _.ajax({url:`/api/v1/resource/${data.serviceId}`,method:'put',data:data.yaml},(res)=>{callback(res)})
    },
    namespaceYamlMapByServiceId(params,callback){
        // {serviceId,type,name}
        _.ajax({url:`/api/v1/resource/${params.serviceId}/${params.type}/${params.name}`},(res)=>{callback(res||' ')})
    },
    namespaceYamlMap(params,callback){
        // {clusterId,type,namespace,name}
        _.ajax({url:`/api/v1/resource/${params.clusterId}/${params.type}/${params.namespace}/${params.name}`},(res)=>{callback(res||' ')})
    },
    namespaceSync(clusterId,callback){
        _.ajax({url:`/api/v1/cluster/${clusterId}`,method:'put'},(res)=>{callback(res)})
    },
    envList(data,callback){
        _.ajax({url:`/api/v1/env/${data.id}`},(res)=>{callback(res)})
    },
    envUpdate(data,callback){
        // {"audit": true,cpuLimit": 0,"envName": "string","envTag": "string", "memLimit": 0,namespace": "string","networkLimit": 0,"visibility": true}
        if(data.id){
            _.ajax({url:'/api/v1/env',method:'put',data:data},(res)=>{callback(res)},()=>{callback()})
        }else{
            _.ajax({url:'/api/v1/env',method:'post',data:data},(res)=>{callback(res)},()=>{callback()})
        }
    },
    //
    clusterDetailMap(params,callback){
        // {clusterId,namespace}
        _.ajax({url:`/api/v1/cluster/${params.clusterId}/${params.namespace}`},(res)=>{callback(res)})
    },

    // 用户列表
    clusterInviteCode(params,callback){
        // {ClusterId}
        _.ajax({url:'/api/v1/cluster/getInviteCode',params:params},(res)=>{callback(res)})
    },
    clusterUser(params,callback){
        // {ClusterId}
        _.ajax({url:'/api/v1/cluster/getNoPagerUsers',params:params},(res)=>{callback(res)})
    },
    clusterAUsers(params,callback){
        // {ClusterId}
        _.ajax({url:'/api/v1/cluster/getAddUsers',params:params},(res)=>{callback(res)})
    },
    clusterAUsersAdd(data,callback){
        // relationAo {}
        _.ajax({url:`/api/v1/cluster/addClusterRelation`,method:'post',data:data},(res)=>{callback(res)})
    },
    clusterAUsersAddByCode(data,callback){
        // relationAo {}
        _.ajax({url:`/api/v1/cluster/addClusterRelation/${data.code}`,method:'post',data:data},(res)=>{callback(res)})
    },
    clusterAUsersAddList(data,callback){
        // list<relationAo>  [{}]
        _.ajax({url:`/api/v1/cluster/addClusterRelationList`,method:'post',data:data},(res)=>{callback(res)})
    },
    clusterAuthUpdate(data,callback){
        // relationAo {}
        _.ajax({url:`/api/v1/cluster/updateClusterRelation`,method:'put',data:data},(res)=>{callback(res)})
    },
    envAuthUpdate(data,callback){
        // relationAo {}
        _.ajax({url:`/api/v1/cluster/updateEnvRelation`,method:'put',data:data},(res)=>{callback(res)})
    },
    clusterAUsersDel(data,callback){
        // relationAo {}
        _.ajax({url:`/api/v1/cluster/deleteClusterRelation`,method:'delete',data:data},(res)=>{callback(res)})
    },
    clusterAUsersDelById(id,callback){
        // {clusterId}
        _.ajax({url:`/api/v1/cluster/ClusterRelation/user`,method:'delete',data:{clusterId:id}},(res)=>{callback(res)})
    }
}
