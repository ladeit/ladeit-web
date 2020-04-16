
const ORI = {
    createVersion:`{"id":"","version":"","prefix":""}`,
    createFirst:'createType',
    createType:`{"type":""}`, // {sel:'-1,1,2,4,8'}
    createService:`{"type":"","cluster":"","namespace":"","editYaml":{},"editViews":[]}`,// { type:1/2 , pods:[{name:'xx'}],editViews:['xx:xx']}
    createFirstConfig:`{"sel":""}`,// 1:使用默认配置 2:导入配置
    createStrategy:`{"protocol":"","flow":""}`,
    createConfigurationNew:`{}`,
}
let DATA = [];
let FLOW = {};
let config = {
    createVersion:{id:'', version:'', prefix:''},
    createType:{sel:''},
    createService:{type:'',cluster:'',namespace:'',editYaml:{},editViews:[]},
    createConfigurationNew:{newYaml:false},
    createConfiguration:{},
    createFirstConfig:{sel:''},
    createStrategy:{protocol:'',flow:''}
}

function addFlow(temp){
    FLOW[temp.id] = temp;
}

function getFlow(name,flag){
    let flow = FLOW[name];
    if(!flow){return;}
    //
    if(typeof flag == 'object'){
        _.extend(flow,flag)
    }else if(flag){
        _.extend(flow,{type:'active'})
    }else{
        _.extend(flow,{type:'load'})
    }
    return flow;
}

function getData(isInit){
    if(isInit){
        DATA = ['CreateVersion','Complete'];
    }
    return DATA.map((v)=>{return FLOW[v]});
}

function updateData(arr){
    let last = arr[arr.length-1];
    let start = arr[0];
    let startIndex = DATA.indexOf(start);
    if(startIndex>-1){
        DATA.splice(startIndex,100);
    }
    Array.prototype.push.apply(DATA,arr);
    //
    let lastFlow = FLOW[last];
    if(!lastFlow.isLast){
        DATA.push('Complete')
    }
    return DATA;
}

function clear(arr){
    // createVersion,createType,createFirst,createService,createFirstCluster,createFirstConfig,createFirstNamespace,createStrategy
    let sc = this;
    let clearList = arr || ["createVersion", "createType", "createFirst", "createService", "createFirstCluster", "createFirstConfig", "createFirstNamespace","createStrategy",'createConfigurationNew'];
    clearList.map((v)=>{
        let name = v.replace(/^Create/,'create').replace(/\_.*/,'');//特殊处理-历史遗留
        let dataName = config[name] ? name : ORI[name];
        if(config[dataName]){
            _.extend(config[dataName],JSON.parse(ORI[dataName]||'{}'));// =
        }
    })
}

export default {
    config:()=>{return config},
    clear,
    updateData,
    getData,
    addFlow,
    getFlow
}
