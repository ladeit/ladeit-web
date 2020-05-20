import { observable, action, computed } from 'mobx';
import * as attach from "xterm/lib/addons/attach/attach";

const conf = {
    resetTime:12 * 1000,// 展示消失延时
    eventsLength:3,// 事件展示数量
    time:600, // 缓存周期
    cache:[], // 有序缓存队列
    callback:null
}

// 资源项
class Store {
    @observable
    data = [];

    bindDataEvent(callback){
        conf.callback = callback;
    }

    getServieData(one){
        // return {// 合成服务对象
        //     id:one.serviceId,
        //     name:one.name,
        //     status:one.status,
        //     messageAOS:[],
        //     serviceGroupName:null,
        //     imageId:null,
        //     imageVersion:null,
        //     createAt:null,
        //     createBy:null,
        //     imagenum:null,
        //     _resetTime:0,
        // }
        let res = {
            id:one.serviceId,
            name:one.name,
            status:one.status+"",
            imageId:one.imageId,
            imageVersion:one.imageVersion,
            imageAOS:one.imageAOS,
            messageAOS:[],
            _resetTime:0
        }
        return res;
    }

    getMessageData(one){
        return {// 合成事件对象
            id:one.namespace,// 没有?
            createAt:one.startTime,
            title: one.note
        }
    }

    addData(one){
        conf.cache.push(JSON.parse(one||"{}"));
        if(conf.cache.length>3){
            conf.cache.splice(0,conf.cache.length-3);
        }
    }

    delCompleteData(data){// 每次渲染校验是否删除
        for(let i=data.length-1;i>-1;i--){
            let v = data[i];
            if(v.messageAOS.length<1){
                data.splice(i,1);
            }else{
                console.log(JSON.stringify(v.status))
                if([0,8].indexOf(v.status)>-1){// 0 成功 / 8 异常
                    v._resetTime += conf.time;
                    if(v._resetTime>conf.resetTime){
                        data.splice(i,1);
                    }
                }
            }
        }
    }

    saveData(){// 缓存渲染到界面
        let sc = this;
        let data = sc.data;
        let ids = data.map((v)=>{return v.id;})
        if(conf.cache.length<1){
            return;
        }
        //
        conf.cache.forEach((v)=>{
            let service = sc.getServieData(v);
            let event = sc.getMessageData(v);
            let index = ids.indexOf(service.id);
            if(index>-1){
                let oldService = data[index];
                service.messageAOS = oldService.messageAOS;
                service._resetTime = oldService._resetTime;
                data.splice(index,1,service);
            }else{
                ids.splice(0,0,service.id);
                data.splice(0,0,service);
            }
            service.messageAOS.splice(0,0,event)
            service.messageAOS.length>conf.eventsLength && (service.messageAOS.length = conf.eventsLength);
        });
        conf.cache.length = 0;
        //
        // sc.delCompleteData(data);
        sc.data = [...data];
        conf.callback && conf.callback(data,function (a,b) {
            return `${a.status}_${a.imageId}` != `${b.status}_${b.imageId}`;
        });
    }

    @action
    startEvents(id){
        const sc = this;
        sc.endEvents();
        mock(id,function (one) {
            sc.addData(one)
        })
        conf.timer = setInterval(()=>{
            sc.saveData();
        },conf.time)
    }

    endEvents(){
        clearInterval(conf.timer);
        if(conf.ws){
            conf.ws.close();
            conf.ws = null;
        }
    }
}

export default new Store();


function mock1(id,callback){
    var ids = [1,2,3,4,5];
    var data = {
        serviceId: 1,
        status: "1",
        reason: "pullimage",
        type: "warning",
        note: "pull image ...",
        kind: "pod",
        name: "服务名",
        resourceName: "资源名",
        namespace: "testnamespace",
        startTime: "2019-11-11 12:12:12",
        endTime: "2019-11-11 12:12:12",
        time: "2019-11-11 12:12:12"
    }

    setInterval(function () {
        data.serviceId = ids[Math.floor(Math.random()*5)];
        data.reason = data.reason;
        callback(data);
    },800)
}

function mock(id,callback){
    if(conf.ws){
        return;
    }
    //
    let ip = window.WSIP;
    let user = _.local('user');
    let ws = conf.ws =  new WebSocket(`ws://${ip}/api/v1/events/${user.id}`);
    ws.onopen = function(event){
        // TODO terminal - 异常处理
    }
    ws.onmessage = function(event){
        callback(event.data);
    }
    ws.onerror = function(event){
        //
    }
    ws.onclose = function(event){
        // 1000正常关闭
        // 1004自定义：后台提示（用户已经登陆或被踢掉）
        // 1006连接异常时关闭。
        console.log(event.code);
        if(event.code == 1006){
            setTimeout(function () {
                mock(id,callback);
            },600)
        }
    }
}