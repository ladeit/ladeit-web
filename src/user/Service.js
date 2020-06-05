const catche = {}

export default {
    EVENT_TYPE:['','创建节点','删除节点','修改路由权重','修改匹配规则','修改策略','调整pod数量'],

    activityList(params,callback){
        // {currentPage,pageSize}
        _.ajax({url:'/api/v1/user/getOperations',params:params},(res)=>{callback(res)})
    },
    userInfo(params,callback){
        // {UserName}
        _.ajax({url:'/api/v1/user/User',method:'get',params:params},(res)=>{callback(res)})
    },
    userUpdate(data,callback){
        _.ajax({url:'/api/v1/user/User',method:'put',data:data},(res)=>{callback(res)})
    },
    updatePassword(data,callback){
        _.ajax({url:'/api/v1/user/password',method:'put',data:data},(res)=>{callback(res)})
    },
    userSlack(params,callback){
        // {userId}
        _.ajax({url:'/api/v1/user/getSlackUser',method:'get',params:params},(res)=>{callback(res)})
    },
    userSlackDel(data,callback){
        // {userSlackRelationId}
        _.ajax({url:`/api/v1/user/unbind/${data.userSlackRelationId}`,method:'delete'},(res)=>{callback(res)})
    }
}
