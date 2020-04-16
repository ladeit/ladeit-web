
import { observable, action, computed } from 'mobx';


// 资源项
class Store {
    @observable
    mobileOpen = true;
    @observable
    user = {}

    //@computed
    //get user(){
    //    return this.user;
    //}

    @action
    triggerMobileOpen(){
        this.mobileOpen = !this.mobileOpen;
    }

    @action
    setUser(user){
        _.local('user',user);
        this.user = user;
    }

    @action
    updateUser(info){
        let user = _.extend(_.local('user'),info);
        _.local('user',user);
        this.user = user;
    }

    @action
    autoLogin(){
        let user = _.local('user') || {};
        this.user = user;
        return user;
    }
}

export default new Store();
