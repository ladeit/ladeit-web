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
}

