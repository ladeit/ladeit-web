const cache = {}
import intl from 'react-intl-universal'

export default {
    NOTIFICATION_TYPE:function(){
        if(!cache.type){
            cache.type = {'10':intl.get('notification.type.10'),'20':intl.get('notification.type.20'),'30':intl.get('notification.type.30'),'40':intl.get('notification.type.40'),'50':intl.get('notification.type.50'),'60':intl.get('notification.type.60'),'70':intl.get('notification.type.70'),'80':intl.get('notification.type.80'),'90':intl.get('notification.type.90'),'100':intl.get('notification.type.100'),'110':intl.get('notification.type.110')};
        }
        return cache.type;
    },
    NOTIFICATION_FILTER:function(filter,callback){
        let sc = this;
        //
        let optionsType = filter[1]['options'];
        let typeList = sc.NOTIFICATION_TYPE();
        optionsType.length = 0;
        optionsType.push({key:'',value:intl.get('notification.filterType')});
        for(let key in typeList){
            let val = typeList[key];
            optionsType.push({key:key,value:val})
        }
        //
        let optionsService = filter[0]['options'];
        optionsService.length = 0;
        optionsService.push({key:'',value:intl.get('notification.filterGroup')});
        _.ajax({url:`/api/v1/message/user/group`},(res)=>{
            res.forEach(function (one) {
                optionsService.push({key:one.id,value:one.name})
            })
            callback();
        })
    },

    notificationOne(id,callback){
        _.ajax({url:`/api/v1/message/${id}`},(res)=>{callback(res)})
    },
    notificationList(params,callback){
        // {userId,currentPage,pageSize,readFlag,type} readFlag:''/'true'/'false'  type:normal/110
        _.ajax({url:`/api/v1/message/messages`,params:params},(res)=>{callback(res)})
    },
    notificationReadList(list,callback){
        _.ajax({url:`/api/v1/message/state`,method:'put',data:list},(res)=>{callback(res)})
    },
    notificationReadAll(p,callback){
        _.ajax({url:`/api/v1/message/states`,method:'put'},(res)=>{callback(res)})
    },
    notificationDelList(list,callback){
        _.ajax({url:`/api/v1/message/state`,method:'delete',data:list},(res)=>{callback(res)})
    },
    notificationDelAll(p,callback){
        _.ajax({url:`/api/v1/message/states`,method:'delete'},(res)=>{callback(res)})
    }
}
