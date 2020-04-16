import React from 'react';
import ReactDOM from 'react-dom';
import {observer,inject} from "mobx-react";
import {withRouter,Route ,Router ,Switch ,Redirect} from "react-router-dom";
import Notice from 'components/Dialog/Notice.jsx'
import ExtendLodash from './lodash'
import RouteConfig from './route'
import intl from 'react-intl-universal'

//,'/404' 有头（ 存在用户信息 ）
const NoMatch = [
    '/login',"/test","/register","/group",
    "/invite","/inviteSlack"
]
const env = process.env;

@inject('store')
@observer
class App extends React.PureComponent {

    componentWillMount(){
        ExtendLodash();
        //
        window.SIP = env.PUBLIC_SIP;
        window.WSIP = env.PUBLIC_WSIP;
        window.History = this.props.history;
        window.Store = this.props.store;
        window.setI18n = this.setI18n;
        window.NULL = null; // 给组件anchor_el用的
        this.setI18n();
        // init data
        window.onscroll = _.debounce(function(){
            _.scrollList.map((v) => {
                v();
            })
        },300)
    }

    setI18n = (language)=>{
        let sc = this;
        let url = window.location.href;
        let match = /.*language=([a-zA-Z\-]*).*/;
        let currentLocale = language || _.local('language') || (match.test(url) ? url.replace(match,'$1') : 'zh-CN');
        _.local('language',currentLocale);
        try{
            intl.init({
                currentLocale: currentLocale,
                commonLocaleDataUrls: {
                    'zh': false,
                    'en': false
                },
                locales: {
                    [currentLocale]: require(`@/locales/${currentLocale}.js`).default
                }
            }).then(() => {
                sc.forceUpdate();
            })
        }catch (e) {
            intl.init({
                currentLocale: currentLocale,
                commonLocaleDataUrls: {
                    'zh': false,
                    'en': false
                },
                locales: {
                    [currentLocale]: require(`@/locales/zh-CN.js`).default
                }
            }).then(() => {
                sc.forceUpdate();
            })
        }
    }
    
    //
    render(){
        const { store,history } = this.props;
        store.global.autoLogin();
        return (
            <>
                <RouteConfig history={history}/>
                <Notice />
            </>
        )
    }
}

export default withRouter(App);
