import { observable, action, computed } from 'mobx';

// 资源项
class Store {
    @observable
    data = [
        //  type : error / success / warning / info
        //  {udid:"",text:"",type:"",time:""}
    ]

    @action
    close(item){
        const data = this.data;
        const index = window._.findIndex(data,{udid:item.udid});
        index>-1 && data.splice(index,1);
    }

    @action
    add(item){
        // const data = this.data;
        item.udid = window._.udid();
        //data.splice(0,0,item)
        this.data = [item];
    }
}

export default new Store();
