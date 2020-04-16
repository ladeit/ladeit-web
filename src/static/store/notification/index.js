import { observable, action, computed } from 'mobx';
import Service from '@/notification/Service'

// 资源项
class Store {
    timeout = null;
    @observable
    data = {loaded:false,pageSize:'',records:[]};
    @observable
    allData = {loaded:false,pageNum:1,pageSize:10,pageCount:0,records:[],selected:[]};
    @observable
    newData = {loaded:false,pageNum:1,pageSize:10,pageCount:0,records:[],selected:[]};
    @observable
    readData = {loaded:false,pageNum:1,pageSize:10,pageCount:0,records:[],selected:[]};

    @action
    loadNotification(){
        const sc = this;
        sc.timeout || (sc.timeout = roundLoad());
        sc.timeout(function (res) {
            sc.data = res;
        })
    }

    @action
    readNotification(index){
        this.data.records.splice(index,1);
        //
        let len = this.data.totalRecord;
        this.data.totalRecord = len>1 ? len-1 : 0;
    }

    @action
    putSelected(name,arr){
        let data = this[name];
        data.selected = arr;
    }

    @action
    loadAll(pm,callback){
        const sc = this;
        const data = sc.allData;
        const param = _.extend({currentPage:data.pageNum,pageSize:data.pageSize},data.filter,pm);// 保持查询参数 （分页/筛选）
        data.loaded = false;
        sc.allData = {...sc.allData};
        //
        Service.notificationList(param,function (res) {
            res.loaded = true;
            res.pageCount = res.totalRecord;
            res.selected = [];
            res.filter = {serviceGroupId:param.serviceGroupId,type:param.type}
            sc.allData = res;
            callback && callback(res);
        })
    }

    @action
    loadNew(pm,callback){
        const sc = this;
        const data = sc.newData;
        const param = _.extend({currentPage:data.pageNum,pageSize:data.pageSize},data.filter,pm,{readFlag:"false"});// 保持查询参数 （分页/筛选）
        data.loaded = false;
        sc.newData = {...sc.newData};
        //
        Service.notificationList(param,function (res) {
            res.loaded = true;
            res.pageCount = res.totalRecord;
            res.selected = [];
            res.filter = {serviceGroupId:param.serviceGroupId,type:param.type}
            sc.newData = res;
            callback && callback(res);
        })
    }

    @action
    loadRead(pm,callback){
        const sc = this;
        const data = sc.readData;
        const param = _.extend({currentPage:data.pageNum,pageSize:data.pageSize},data.filter,pm,{readFlag:"true"});// 保持查询参数 （分页/筛选）
        data.loaded = false;
        sc.readData = {...sc.readData};
        //
        Service.notificationList(param,function (res) {
            res.loaded = true;
            res.pageCount = res.totalRecord;
            res.selected = [];
            res.filter = {serviceGroupId:param.serviceGroupId,type:param.type}
            sc.readData = res;
            callback && callback(res);
        })
    }
}

export default new Store();



// round
function roundLoad(){
    let timer = '';
    let loadData = (resultBack)=>{
        Service.notificationList({currentPage:1,pageSize:5,readFlag:'false'},resultBack)
    }
    let timeFn = (callback) => {
        loadData(callback);
        timer = setTimeout(function(){
            let user = _.local('user');
            if(!user.id){
                clearTimeout(timer);
                return;
            }
            loadData(callback);
        },30000)
    }
    //
    return (callback)=>{
        if(timer){
            clearTimeout(timer);
        }
        //
        timeFn(callback);
    }
}