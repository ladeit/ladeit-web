import { observable, action, computed } from 'mobx';
import Service from '@/projects/Service'

// 资源项
class Store {
    @observable
    groupData = {};
    @observable
    userMap = {loaded:false,groupName:'',pageSize:'',records:[]};

    @action
    delUser(one){
        let list = this.userMap.records.filter((v)=>{return v.id!=one.id})
        this.userMap.records = list;
    }

    @action
    ajaxUsers(options){
        const sc = this;
        _.extend(sc.userMap,{loaded:false,records:[]})// TODO render很多次了
        loadGroup.call(sc,options,function (groupData) {
            Service.groupUsersList_nopage({ServiceGroupId:groupData.id},(res)=>{
                sc.groupData = groupData;
                _.extend(sc.userMap,{loaded:true,records:res})
            })
        })
    }
}

function loadGroup(params,callback){
    const sc = this;
    Service.groupListByName(params._group,function(res){
        sc.groupData = res[0];
        callback(sc.groupData)
    })
}

export default new Store();
