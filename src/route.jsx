import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

//import Dashboard from './Layout1/dashboard.jsx'
import Invite from './login/invite.jsx'
import InviteEnv from './login/invite_env.jsx'
import InviteSlack from './login/invite_slack.jsx'
import Login from './login/login.jsx'
import Register from './login/register.jsx'
import Test from './login/test.jsx'
import Terminal from './cluster/component/terminal.jsx'
import Error404 from './layout1/Error404'
import Error503 from './layout1/Error503'
import Resources404 from './layout1/Resources404'
import Resources401 from './layout1/Resources401'

// admin
import AdminServices from './admin/services.jsx'
import AdminClusters from './admin/clusters.jsx'
import AdminDatatrasfer from './admin/datatransfer.jsx'

// import Home from './layout/Paperbase'
import Projects from './projects/index.jsx'
import ProjectsSetting from './projects/setting/index.jsx'
import ProjectsComponents from './projects/service/index.jsx'
import ProjectsRelease from './projects/releases/index.jsx'
import ProjectsReleaseDetail from './projects/releases/imageDetail.jsx'
import ProjectsDeployments from './projects/deployments/index.jsx'
import ProjectsDeploymentsInfo from './projects/deployments/info.jsx'
import ProjectsTopology from './projects/topology/index.jsx'
import ProjectsSummary from './projects/summary.jsx'

// group
import ProjectsGroup from './projects/group/index.jsx'
import ProjectsGroupSummary from './projects/group/summary.jsx'
import ProjectsTest from './projects/group.jsx'
import ProjectsGroupUser from './projects/group/user.jsx'
import ProjectsGroupTopology from './projects/group/topology.jsx'
import ProjectsGroupYaml from './projects/yaml/yaml.jsx'
import ProjectsGroupSetting from './projects/group/setting.jsx'

// topology
import Topo from './topology/index.jsx'
import TopoGroup from './topology/group.jsx'
import Deployment from './topology/deployment.jsx'
// env
import Cluster from './cluster/index_group.jsx'
import ClusterSummary from './cluster/cluster/summary.jsx'
import ClusterUser from './cluster/cluster/user.jsx'
import ClusterSetting from './cluster/cluster/setting.jsx'
import NamespaceSummary from './cluster/namespace/summary.jsx'
import NamespaceSetting from './cluster/namespace/setting.jsx'
// user
import UserProfile from './user/profile.jsx'
import UserSetting from './user/setting.jsx'
import UserAccount from './user/account.jsx'
import UserApplication from './user/application.jsx'
// notification
import NotificationAll from './notification/all.jsx'
import NotificationNew from './notification/new.jsx'
import NotificationRead from './notification/read.jsx'
import NotificationInfo from './notification/info.jsx'

const routes = [
    {exact:true,path:'/group',component:ProjectsTest},
    {exact:true,path:'/test',component:Test},
    //
    {exact:true,path:'/',component:requireAuth(Projects)},
    {exact:true,path:'/invite',component:Invite},
    {exact:true,path:'/inviteEnv',component:InviteEnv},
    {exact:true,path:'/inviteSlack',component:InviteSlack},
    {exact:true,path:'/login',component:Login},
    {exact:true,path:'/register',component:Register},
    {exact:true,path:'/services',component:requireAuth(Projects)},
    {exact:true,path:'/terminal',component:requireAuth(Terminal)},
    //
    {exact:true,path:'/admin/services',component:requireAuth(AdminServices)},
    {exact:true,path:'/admin/clusters',component:requireAuth(AdminClusters)},
    {exact:true,path:'/admin/datatransfer',component:requireAuth(AdminDatatrasfer)},
    //
    {exact:true,path:'/profile/:username',component:requireAuth(UserProfile)},
    {exact:true,path:'/setting/profile',component:requireAuth(UserSetting)},
    {exact:true,path:'/setting/account',component:requireAuth(UserAccount)},
    {exact:true,path:'/setting/application',component:requireAuth(UserApplication)},
    {exact:true,path:'/notification/all',component:requireAuth(NotificationAll)},
    {exact:true,path:'/notification/new',component:requireAuth(NotificationNew)},
    {exact:true,path:'/notification/read',component:requireAuth(NotificationRead)},
    {exact:true,path:'/notification/info/:_no',component:requireAuth(NotificationInfo)},
    //
    {exact:true,path:'/topology/group',component:requireAuth(TopoGroup)},
    {exact:true,path:'/topology/deployment',component:requireAuth(Deployment)},
    {exact:true,path:'/topology/:_group/:_name',component:requireAuth(Topo)},
    //
    {exact:true,path:'/cluster',component:requireAuth(Cluster)},
    {exact:true,path:'/cluster/:_name/summary',component:requireAuth(ClusterSummary)},
    {exact:true,path:'/cluster/:_name/user',component:requireAuth(ClusterUser)},
    {exact:true,path:'/cluster/:_name/setting',component:requireAuth(ClusterSetting)},
    {exact:true,path:'/namespace/:_name/:_namespace/summary',component:requireAuth(NamespaceSummary)},
    {exact:true,path:'/namespace/:_name/:_namespace/setting',component:requireAuth(NamespaceSetting)},
    //
    {exact:true,path:'/setting/:_group/:_name/:_memo',component:requireAuth(ProjectsSetting)},
    {exact:true,path:'/summary/:_group/:_name/:_memo',component:requireAuth(ProjectsSummary)},
    {exact:true,path:'/components/:_group/:_name/:_memo',component:requireAuth(ProjectsComponents)},
    {exact:true,path:'/yaml/:_group/:_name/:_memo',component:requireAuth(ProjectsGroupYaml)},
    {exact:true,path:'/releases/:_group/:_name/common',component:requireAuth(ProjectsRelease)},
    {exact:true,path:'/releases/:_group/:_name/:_memo',component:requireAuth(ProjectsReleaseDetail)},
    {exact:true,path:'/deployments/:_group/:_name/:_memo',component:requireAuth(ProjectsDeployments)},
    {exact:true,path:'/deployments/:_group/:_name/:_memo/:_release',component:requireAuth(ProjectsDeploymentsInfo)},
    {exact:true,path:'/topology/:_group/:_name/:_memo',component:requireAuth(ProjectsTopology)},
    //
    {exact:true,path:'/group/:_group',component:requireAuth(ProjectsGroup)},
    {exact:true,path:'/group/:_group/summary',component:requireAuth(ProjectsGroupSummary)},
    {exact:true,path:'/group/:_group/user',component:requireAuth(ProjectsGroupUser)},
    {exact:true,path:'/group/:_group/setting',component:requireAuth(ProjectsGroupSetting)},
    {exact:true,path:'/group/:_group/topology',component:requireAuth(ProjectsGroupTopology)},
    //
    {exact:true,path:'/nomatch',component:Resources404},
    {exact:true,path:'/noauth',component:Resources401},
    {exact:true,path:'/503',component:Error503},
    {path:'/*',component:Error404}
];

export default function RouteConfig() {

    React.useEffect(() => {});

    return (
        <Switch>
            {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
            ))}
        </Switch>
    );
}

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes(route) {
    return (
        <Route
            path={route.path}
            render={props => (
                // pass the sub-routes down to keep nesting
                <route.component {...props} routes={route.routes} >
                    {route.redirect}
                </route.component>
            )}
        />
    );
}

// 验证登陆
function requireAuth(Component) {
    // 组件有已登陆的模块 直接返回 (防止从新渲染)
    if (Component.AuthenticatedComponent) {
        return Component.AuthenticatedComponent
    }

    // 创建验证组件
    class AuthenticatedComponent extends React.Component {
        state = {
            login: false,
        }

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            //this.checkAuth();
        }

        checkAuth() {
            // 判断登陆
            const {history} = this.props;
            const store = window.Store;
            const user = _.local('user');
            const id = user && user.id;
            // 未登陆重定向到登陆页面
            if (!id) {
                store.event.endEvents(id);
                let redirect = this.props.location.pathname + this.props.location.search;
                history.push('/login?message=401&from=' + encodeURIComponent(redirect));
                return;
            }
            store.global.autoLogin();
            store.event.startEvents(id);
            this.state.login = Boolean(id);// TODO 为什么Component先被挂载了
        }

        render() {
            let login = this.state.login;
            return  login ? <Component {...this.props}/> : ''
        }
    }

    Component.AuthenticatedComponent = AuthenticatedComponent;
    return Component.AuthenticatedComponent
}