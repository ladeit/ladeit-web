// extend
import intl from 'react-intl-universal'

var COOKIE = {
    get: function(name) {
        var r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
        var m = document.cookie.match(r);
        return (!m ? "": decodeURI(m[2]));
    },
    add:function(name, v, path, expire, domain) {
        var s = name + "=" + escape(v)+"; path=" + ( path || '/' ) + (domain ? ("; domain=" + domain) : '');
        if (expire > 0) {
            var d = new Date();
            d.setTime(d.getTime() + expire * 1000);
            s += ";expires=" + d.toGMTString();
        }
        document.cookie = s;
    },
    del:function(name, domain) {
        document.cookie = name + "=;path=/;" +(domain ? ("domain=" + domain + ";") : '') +"expires=" + (new Date(0)).toGMTString();
    }
};



function resultBack(response,successBack,errBack){
    let notice = window.Store.notice;
    const res = response.data;
    // if(res.token){_.local("token",res.token)} // 更新最新token信息
    // 100成功，101-599号异常属于warning异常，操作成功或部分成功，但是伴随警告，600-1100号error异常，操作失败
    if([1100].indexOf(res.code)>-1){
        if(errBack){
            errBack(res);
        }else{
            notice.add({text:intl.get('tipsNoAuthority'),type:"warning",time:3000});
        }
    }else if([608,609].indexOf(res.code)>-1){
        let from = window.location.pathname + window.location.search;
        _.local("user",{});
        History.push('/login?from='+encodeURIComponent(from))
    }else if([101].indexOf(res.code)>-1){
        notice.add({text:intl.get('tipsNoResource'),type:"warning",time:3000});
        successBack('');
    }else if(res.success){
        if(100==res.code){
            successBack(res.result);
        } else if(100<res.code && 600>res.code){
            let one = res.fieldErrors['0'];
            if(one){
                one = one.replace('↵','\\n\\r')
                notice.add({text:""+(res.warningMessages[0]||intl.get('tipsFaild')),more:one,type:"warning",time:12000});
            }else{
                notice.add({text:""+(res.warningMessages[0]||intl.get('tipsFaild')),type:"warning",time:3000});
            }
            errBack && errBack(false,res.result);
        } else{
            notice.add({text:""+(res.errorMessages[0]||intl.get('tipsFaild')),type:"warning",time:12000});
            errBack && errBack(false,res);
        }
    }else{
        if(res.errorMessages){
            notice.add({text:""+(res.errorMessages[0]||intl.get('tipsFaild')),type:"error",time:12000});
            errBack && errBack(false,res);
        }else{
            notice.add({text:intl.get('tipsNoFoundData'),type:"error",time:5000});
        }
    }
}

export default function(){
    _.COOKIE = COOKIE;
    //_.COOKIE.add('JSESSIONID','ce4c1cfb-2abf-42ec-b5d7-38e3731096ae', '/', 10000, 'dev.ladeit.io');
    _.scrollList = [];

    _.ajax = function(options,successBack,errBack){
        let notice = window.Store.notice;
        let user = window.Store.global.user;
        let token = user.token;
        //axios.defaults.withCredentials = true; //带入cookie
        //errBack || (errBack = ()=>{})
        //
        options = _.extend({
            method: 'get',
            url: '/no-url',
            headers:{
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                'Authorization':token || "",
                'sessionId':user.session,
                lan:_.local('language')
            },
            loading:{onShow:function(){}},
            //params: {},
            //data: {}
        },options);
        //
        if(/^\//.test(options.url)){
            options.url = window.SIP + options.url
        }
        //
        if(successBack){
            options.loading.onShow(1);
            //axios.defaults.withCredentials = true
            axios(options).then(function(response) {
                options.loading.onShow();
                resultBack(response,successBack,errBack);
            }).catch(function (error) {
                options.loading.onShow();
                notice.add({text:""+error,type:"error",time:3000});
                errBack && errBack();
            })
        }else{
            return axios(options);
        }
    }

    _.download = function(options,callback){
        let notice = window.Store.notice;
        let user = window.Store.global.user;
        let token = user.token;
        //
        options = _.extend({
            method: 'get',
            url: '/no-url',
            headers:{
                'Cache-Control': 'no-cache',
                'Authorization':token || "",
                'sessionId':user.session
            },
            responseType: 'blob',
            loading:{onShow:function(){}},
            //params: {},
            //data: {}
        },options);
        //
        if(/^\//.test(options.url)){
            options.url = window.SIP + options.url
        }
        //
        axios(options).then(function(res) {
            const content = res.data
            const blob = new Blob([content])
            const fileName = options.fileName || 'download.zip';
            if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
            } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName)
            }
        }).catch(function (error) {
            const errMsg = error.toString()
            const code = errMsg.substr(errMsg.indexOf('code') + 5);
            if(code=='503'){
                History.push('/503')
            }else{
                notice.add({text:""+error,type:"error",time:3000});
            }
        })
    }

    _.session = function(key,value){
        if(value!==void 0){
            value = typeof value == "string" ? value : encodeURIComponent(JSON.stringify(value));
            sessionStorage.setItem(key,value)
        }else{
            value = sessionStorage.getItem(key)
            return /^\%7B|^\%5B/.test(value) ? JSON.parse(decodeURIComponent(value)) : value;
        }
    }

    _.local = function(key,value){
        if(value!==void 0){
            value = typeof value == "string" ? value : encodeURIComponent(JSON.stringify(value));
            localStorage.setItem(key,value)
        }else{
            value = localStorage.getItem(key)
            if(key=='user' && !value){
                return {};
            }
            return /^\%7B|^\%5B/.test(value) ? JSON.parse(decodeURIComponent(value)) : value;
        }
    }

    _.drag = function(ev,renderFun,dragFun){
        var disx=ev.pageX-0
        var disy=ev.pageY-0

        document.onmousemove=function(ev){
            var x = ev.pageX-disx;
            var y = ev.pageY-disy;
            dragFun && dragFun(x,y);
            //
            window.requestAnimationFrame(function(){
                renderFun(x,y);
            })
        }
        document.onmouseup=function(){
            document.onmousemove=null
            document.onmousedown=null
        }
    }

    _.fullscreen = (function(){
        let elem;
        // 点击进入全屏 方法、
        let fullscreen = function(){
            elem = document.body;
            if(elem.webkitRequestFullScreen){
                elem.webkitRequestFullScreen();
            }else if(elem.mozRequestFullScreen){
                elem.mozRequestFullScreen();
            }else if(elem.requestFullScreen){
                elem.requestFullscreen();
            }else{
                //浏览器不支持全屏API或已被禁用
            }
        }
        // 点击退出全屏 方法
        let exitFullscreen = function(){
            var elem=document;
            if(elem.webkitCancelFullScreen){
                elem.webkitCancelFullScreen();
            }else if(elem.mozCancelFullScreen){
                elem.mozCancelFullScreen();
            }else if(elem.cancelFullScreen){
                elem.cancelFullScreen();
            }else if(elem.exitFullscreen){
                elem.exitFullscreen();
            }else{
                //浏览器不支持全屏API或已被禁用
            }
        }
        return (statusClose)=>{
            statusClose ? fullscreen() : exitFullscreen();
        }
    })()

    _.udid = function(){
        return (((1+Math.random())*0x10000000)|0).toString(16);
    }

    _.getFormData = (arr)=>{
        let res = {};
        arr.map(function (o) {
            res[o.name] = o.value;
        })
        return res;
    }

    // 获取非空数据
    _.getNotNull = function(data){
        let keys = Object.keys(data);
        let res = {};
        keys.map(function (key) {
            let val = data[key];
            if(typeof val == 'number' || typeof val == 'string' || typeof val == 'boolean'){
                if(val){
                    res[key] = val;
                }
            }else if(val instanceof Array){// array
                let arr = _.getNotNullByArray(val);
                if(arr.length){
                    res[key] = arr;
                }
            }else{// object
                res[key] =  val==null ? '' : _.getNotNull(val)
            }
        })
        return res;
    }

    _.getNotNullByArray = function(arr){
        return arr.filter(function(v){
            let flag = true;// true 无效的
            let keys = Object.keys(v);
            keys.every(function (key) {
                if(v[key]){
                    flag = false;
                }
                return !flag;
            })
            return !flag;
        })
    }

    _.params = function(){
        let search = window.location.search;
        let params = {};
        search = search.replace(/^\?/,'')
        search.split("&").map((v)=>{
            let arr = v.split('=');
            arr[0] && (params[arr[0]] = encodeURIComponent(arr[1]))
        })
        return params;
    }

    _.paramsUrl = function(data){
        let result = [];
        for(let key in data){
            let arr = [key,data[key]||''];
            result.push(arr.join('='));
        }
        return result.join('&');
    }

    _.href = function(p){
        let param = _.extend(_.params(),p);
        window.location.href = window.location.pathname +'?'+ _.paramsUrl(param);
    }
}
