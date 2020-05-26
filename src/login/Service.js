
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
    passwordMod(){
        // {username,password,newPassword}
        _.ajax({url:'/api/v1/user/password',method:'put'})
    },
    adminPassword(data,callback){
        _.ajax({url:'/api/v1/user/admin/password',method:'put',data:data},(res)=>{callback(res)})
    },
    adminFirstLogin(){
        _.ajax({url:"/api/v1/user/admin"},(res)=>{
            if(res === "nopassword"){
                History.push('/guite/admin')
            }
        })
    }
}