import React from 'react';
import {withStyles} from '@material-ui/core/styles'
import {inject,observer} from 'mobx-react';
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import Icons from 'components/Icons/icons'
import AuthFilter from '@/AuthFilter'
import ColonyAdd from  '@/cluster/component/colonyAdd'
import DeleteClusterCom from './setting/deleteCluster'
import ConfirmDialog from 'components/Dialog/Alert.jsx'
//
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {CopyToClipboard} from "../../projects/setting/common";
import Service from "@/cluster/Service";
import intl from 'react-intl-universal'

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
        '& .colonyAdd':{
            width:'55%',
            padding:'0 24px 16px 24px',
        }
    }
});


@inject("store")
@withStyles(styles)
@AuthFilter
@observer
class Index extends React.PureComponent {
    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){
        this.loadCluster();
    }

    loadCluster(){
        let sc = this;
        let { store } = this.props;
        let params = this.params;
        store.cluster.ajaxClusterByName(params._name);
    }

    clickDelCluster(cluster){
        let sc = this;
        return ()=>{
            Service.clusterDelValid(cluster.id,function (res) {
                sc.refs.$cluster.setState({
                    open:true,
                    title:intl.get('cluster.buttonDelete'),
                    validList:res,
                    text:cluster.k8sName,
                    onOk:function (check) {
                        Service.clusterDel(cluster.id,function (res) {
                            History.push('/cluster')
                        })
                    }
                })
            })
        }
    }

    leaveGroup = (cluster)=>{
        this.refs.$leave.onOpen({
            open:true,
            title:intl.get('tips'),
            message:<Typography variant="body1" style={{width:'240px',fontWeight:400}}>{intl.get('cluster.tipsLeaveCluster')}</Typography>,
            onOk:function (res) {
                Service.clusterAUsersDelById(cluster.id,function (res) {
                    History.push('/cluster')
                })
            }
        })
    }

    render(){
        let sc = this;
        let { classes,store } = this.props;
        let params = this.params;
        let clusterMap = store.cluster.clusterMap;
        let auth = this.getClusterAuth(clusterMap);
        return (
            <Layout
                menuT={<MenuLayout params={params}  type="cluster"/>}
                crumbList={[
                    {text:`${params._name}`,url:`/cluster/${params._name}/summary`},
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
                                {clusterMap.loaded ? <ColonyAdd data={clusterMap} onOk={resultOk(intl.get('cluster.tipsUpateCluster'))}/> : <Icons.Loading />}
                            </CardContent>
                        </Card>
                        <br/>
                        <Card className={classes.card}>
                            <div className="header">
                                <CardHeader
                                    title={<Typography variant="h4" compoonent="b" ><span className="danger">Leave cluster</span></Typography>}
                                />
                            </div>
                            <CardContent className="content">
                                <Button variant="contained" className="danger_button" onClick={()=>{sc.leaveGroup(clusterMap)}} >{intl.get('cluster.buttonLeave')}</Button>
                            </CardContent>
                        </Card>
                        <br/>
                        <Card className={classes.card}>
                            <div className="header">
                                <CardHeader
                                    title={<Typography variant="h4" compoonent="b" ><span className="danger">Delete cluster ( {params._name} )</span></Typography>}
                                />
                            </div>
                            <CardContent className="content">
                                {
                                    auth("RW") ? (
                                        <Button variant="contained" className="danger_button" onClick={this.clickDelCluster(clusterMap)}>{intl.get('cluster.buttonDelete')}</Button>
                                    ) : (
                                        <Tooltip title={intl.get("tipsNoAuthority")}>
                                            <Button variant="contained" className="danger_button" style={{opacity:.4}}>{intl.get('cluster.buttonDelete')}</Button>
                                        </Tooltip>
                                    )
                                }
                            </CardContent>
                        </Card>
                        <ConfirmDialog ref="$leave" />
                        <DeleteClusterCom ref="$cluster" />
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