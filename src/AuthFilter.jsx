import React from 'react';

// Auth : 劫持并扩展开
export default function AuthFilter(WComponent) {

    WComponent.prototype.toLink = function(url){
        return ()=>{
            url && window.open(url,"_blink")
        }
    }

    WComponent.prototype.toUrl = function(url){
        return ()=>{
            History.push(url);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }
    }

    WComponent.prototype.initParams = function(){
        const { match } = this.props;
        this.params =  _.extend({},_.params(),match && match.params);
    }

    WComponent.prototype.renderRoute = function(url){
        const params = this.params;
        const keys = Object.keys(params);
        url || (url = this.props.match.path);
        keys.map((v)=>{
            url = url.replace(':'+v,params[v]);
        })
        History.push(url);
    }

    WComponent.prototype.projectsMenuChange = (e,val)=>{
        let url = sc.props.match.path;
        let arr = url.split('/');
        arr[3] = val;
        if(val == 'setting'){
            arr[4] = 'common'
        }
        sc.renderRoute(arr.join('/'));
    }

    // 分组权限
    WComponent.prototype.getAuth = function (group){// R:10,RW:20
        let res = {};
        let groupLevel = 0;
        let user = _.local("user");
        if(group && group.accessLevel == "RW"){
            groupLevel = 20;
        }
        //
        return (level,from)=>{// 排除自己
            let l = groupLevel;
            if(user.admin){
                return true;
            }else if(from && from.userId == user.id){
                return false;
            }
            //
            return level<=l;// true:拥有权限大
        }
    }

    // 服务权限
    WComponent.prototype.getServiceAuth = function (serviceData){//
        let res = {};
        let groupLevel = serviceData.roleNum||'';
        let user = _.local("user");
        //
        return (level)=>{
            let str = groupLevel;
            if(user.admin){
                return true;
            }
            return str.indexOf(level)>-1;// true:拥有权限大
        }
    }

    // 集群权限
    WComponent.prototype.getClusterAuth = function (data){// R:10,RW:20
        let authStr = data && data.accessLevel || '';
        let user = _.local("user");
        //
        return (level)=>{// 排除自己
            if(user.admin) {return true;}
            // console.log(level,authStr,data)
            return authStr.indexOf(level)>-1;// true:拥有权限大
        }
    }

    // 命名空间权限
    WComponent.prototype.getEnvAuth = function (data){// R:10,RW:20
        let res = {};
        let authStr = data && data.accessLevel || '';
        let user = _.local("user");
        //
        return (level)=>{// 排除自己
            if(user.admin){ return true;}
            //
            return authStr.indexOf(level)>-1;// true:拥有权限大
        }
    }

    return class extends WComponent {
        render(){
            let sc = this;
            let view = super.render();
            let newProps = {
                ...view.props
            }
            return React.cloneElement(
                view,
                newProps
            )
        }
    }
}