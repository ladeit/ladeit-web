import React from 'react';
import {withStyles} from '@material-ui/core/styles'
import {inject,observer} from 'mobx-react';
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import Icons from 'components/Icons/icons'
import AuthFilter from '@/AuthFilter'
import EnvAdd from '@/cluster/component/envAdd'
import DeleteEnvCom from './setting/deleteEnv'
import {CopyToClipboard} from "../../projects/setting/common"
import Service from "@/cluster/Service";
import intl from 'react-intl-universal'
//
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root:{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        margin: '-16px -24px',
        padding: '16px 24px',
        position: 'absolute',
    },
    setting:{
        '& .content':{
            paddingBottom:'0',
            paddingTop:'0'
        },
        '& .envAdd':{
            width:'55%',
            padding:'0 32px 24px 8px',
        }
    }
});


let options = {
    namespace:{},
    envTag:{},
    resourceQuota:{size:12},
    cpuLimit:{size:4},
    cpuLimitUnit:{size:2},
    memLimit:{size:4},
    memLimitUnit:{size:2},
    cpuRequest:{size:4},
    cpuRequestUnit:{size:2},
    memRequest:{size:4},
    memRequestUnit:{size:2},
}

@inject("store")
@withStyles(styles)
@AuthFilter
@observer
class Index extends React.PureComponent {
    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){
        this.loadNamespace();
    }

    loadNamespace(){
        let sc = this;
        let { store } = this.props;
        let params = this.params;
        store.cluster.ajaxNamespaceByName({clusterName:params._name,envName:params._namespace},function (res) {});
    }

    clickDel(data){
        let sc = this;
        return ()=>{
            Service.namespaceDelValid(data.id,function (res) {
                sc.refs.$env.setState({
                    open: true,
                    title: intl.get('namespace.buttonDelete'),
                    text: data.namespace,
                    validList:res,
                    onOk: function (check) {
                        Service.namespaceDel(data.id, function (res) {
                            History.push('/cluster')
                        })
                    }
                })
            })
        }
    }

    render(){
        let { classes,store } = this.props;
        let params = this.params;
        let namespaceMap = store.cluster.namespaceMap;
        let auth = this.getEnvAuth(namespaceMap);
        return (
            <Layout
                menuT={<MenuLayout params={params}  type="namespace"/>}
                crumbList={[
                    {text:`${params._name}`,url:`/cluster/${params._name}/setting`},
                    {text:`${params._namespace}`,url:`/namespace/${params._name}/${params._namespace}/summary`},
                    {text:'Settings'}
                ]}
                contentT={
                    <div className={classes.root}>
                        <Card className={classes.setting}>
                            <div className="header">
                                <CardHeader
                                    title={<Typography variant="h4" compoonent="b" ><span className="">{intl.get('setting')}</span></Typography>}
                                />
                            </div>
                            <CardContent className="content">
                                {namespaceMap.loaded ? <EnvAdd formProps={{size:12}} options={options} clusterData={{id:namespaceMap.clusterId}} data={namespaceMap} onOk={resultOk(intl.get('namespace.tipsUpdate'))}/> : <Icons.Loading />}
                            </CardContent>
                        </Card>
                        <br/>
                        <Card className={classes.card}>
                            <div className="header">
                                <CardHeader
                                    title={<Typography variant="h4" compoonent="b" ><span className="danger">Delete namespace ( {params._namespace} )</span></Typography>}
                                />
                            </div>
                            <CardContent className="content">
                                {
                                    auth("W") ? (
                                        <Button variant="contained" className="danger_button" onClick={this.clickDel(namespaceMap)}>{intl.get('namespace.buttonDelete')}</Button>
                                    ) : (
                                        <Tooltip title={intl.get('tipsNoAuthority')}>
                                            <Button variant="contained" className="danger_button" style={{opacity:.4}}>{intl.get('namespace.buttonDelete')}</Button>
                                        </Tooltip>
                                    )
                                }
                            </CardContent>
                        </Card>
                        <DeleteEnvCom ref="$env" />
                    </div>
                }
            />
        )
    }
}

export default Index;


function resultOk(text){
    return ()=>{
        window.Store.notice.add({text:text})
    }
}