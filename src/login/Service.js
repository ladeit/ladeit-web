
export default {
    userMap(data,callback){
        _.ajax({url:'/api/v1/user',params:data},(res)=>{callback(res||true)},()=>{callback()})
    },
    userPost(data,callback){
        _.ajax({url:'/api/v1/user',method:'post',data:data},(res)=>{callback(res||true)},()=>{callback()})
    },

    inviteUserToGroup(inviteCode,callback){
        _.ajax({url:`/api/v1/servicegroup/addServiceGroupRelation/${inviteCode}`,method:'post'},(res)=>{callback(res||true)},()=>{callback()})
    },
    inviteUserToCluster(code,callback){
        // {ClusterId}
        _.ajax({url:`/api/v1/cluster/addClusterRelation/${code}`,method:'post'},(res)=>{callback(res)})
    },
}