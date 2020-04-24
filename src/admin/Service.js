const cache = {}

export default {
    servicesList(data,callback){
        _.ajax({url:`/api/v1/servicegroup/getPager`,method:'get',params:data},(res)=>{callback(res)})
    },
    servicesRowList(data,callback){
        _.ajax({url:`/api/v1/servicegroup/getPagerSqlrow`,method:'get',params:data},(res)=>{callback(res)},(res)=>{
            if(res.code=='1100'){
                window.History.replace('/noauth');
            }
        })
    },
    clustersList(data,callback){
        _.ajax({url:`/api/v1/cluster/getClusterAndEnvPager`,method:'get',params:data},(res)=>{callback(res)})
    },
    clustersRowList(data,callback){
        _.ajax({url:`/api/v1/cluster/getClusterAndEnvPagerSqlrow`,method:'get',params:data},(res)=>{callback(res)},(res)=>{
            if(res.code=='1100'){
                window.History.replace('/noauth');
            }
        })
    },
    dataTransferMap(callback){
        // {mysqlInfoAo:{},redisInfoAo:{}}
        _.ajax({url:`/api/v1/start`,method:'get'},(res)=>{callback(res)})
    },
    dataTransferMysql(data,callback){
        let param = data.type ? data : {type:false};
        _.ajax({url:`/api/v1/start/mysql`,method:'put',data:param},(res)=>{callback(res)})
    },
    dataTransferRedis(data,callback){
        let param = data.type ? data : {type:false};
        _.ajax({url:`/api/v1/start/redis`,method:'put',data:param},(res)=>{callback(res)})
    },
    dataTransferLadeit(data,callback){
        _.ajax({url:`/api/v1/start/ladeit`,method:'put',data:data},(res)=>{callback(res)})
    },
}

