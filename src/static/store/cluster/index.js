import { observable, action, computed } from 'mobx';
import Service from '@/cluster/Service'

// 资源项
class Store {
    @observable
    clusterMap = {loaded:false};
    @observable
    userMap = {loaded:false,groupName:'',pageSize:'',records:[]};
    @observable
    userSelMap = {};
    @observable
    namespaceMap = {};

    @action
    selectUser(user){
        this.userSelMap = user;
    }

    @action
    delUser(one){
        let list = this.userMap.records.filter((v)=>{return v.id!=one.id})
        this.userMap.records = list;
    }

    @action
    ajaxCluster(data){
        let sc = this;
        sc.clusterMap = data;
        Service.clusterInviteCode({ClusterId:data.id},function(res){
            sc.clusterMap.code = res;
        })
    }

    @action
    ajaxClusterByName(name,callback){
        let sc = this;
        sc.clusterMap.loaded = false;
        Service.clusterByName(name,function (res) {
            // let res = {
            //     "id":"eb417e12-0218-478a-a3a4-03625e17b044",
            //     "k8sName":"202",
            //     "k8sKubeconfig":"apiVersion: v1",
            //     "isdel":false,
            //     "createBy":"admin",
            //     "createAt":"2020-03-13T08:12:41.000+0000",
            //     "accessLevel":"RW",
            // }
            res.loaded = true;
            sc.clusterMap = res;
            callback && callback();
            Service.clusterInviteCode({ClusterId:res.id},function(res){
                sc.clusterMap.code = res;
            })
        })
    }


    @action
    ajaxNamespaceByName(data,callback) {
        let sc = this;
        sc.namespaceMap = {loaded:false};
        Service.namespaceByName(data,function(res){
            res.loaded = true;
            sc.namespaceMap = res;
            callback && callback(res);
        })
    }

    @action
    ajaxUsers(){
        const sc = this;
        const cluster = this.clusterMap;
        _.extend(sc.userMap,{loaded:false,records:[]})// TODO render很多次了
        Service.clusterUser({ClusterId:cluster.id},(res)=>{
            _.extend(sc.userMap,{loaded:true,records:res})
        })
    }
}

export default new Store();
