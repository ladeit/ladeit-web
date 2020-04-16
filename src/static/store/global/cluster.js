
import { observable, action, computed } from 'mobx';

const ORI = {
    createVersion:{id:'', version:'', prefix:''},
    createType:{sel:''}, // {sel:'0,1,2,4,8'}
    createService:{ type:'',cluster:'',namespace:'',editYaml:{},editViews:[] },// {pods:[{name:'xx'}]}
    createFirstConfig:{sel:''},// 1:使用默认配置 2:导入配置
    createStrategy:{protocol:'',flow:''}
}

// 资源项 //TODO: @observer
class Store {
    @observable createVersion = ORI.createVersion
    @observable createType = ORI.createType
    @observable createService = ORI.createService
    @observable createStrategy = ORI.createStrategy

    @observable NONE = [""]

    @action
    update(name,obj){//  单纯状态存储 - 不render
        let sc = this;
        _.extend(sc[name],obj);
    }

    clear(arr){
        // createVersion,createType,createFirst,createService,createFirstCluster,createFirstConfig,createFirstNamespace,createStrategy
        let sc = this;
        let clearList = arr || ["createVersion", "createType", "createFirst", "createService", "createFirstCluster", "createFirstConfig", "createFirstNamespace","createStrategy"];
        clearList.map((name)=>{
            if(sc[name]){
                _.extend(sc[name],ORI[name]);
            }
        })
    }
}

export default new Store();
