import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import PeopleOutlinedIcon from '@material-ui/icons/PeopleOutlined';
import PriorityHighOutlinedIcon from '@material-ui/icons/PriorityHighOutlined';
import RefreshIcon from '@material-ui/icons/Refresh';
import {
    withStyles,Typography,Button,IconButton,Divider,Avatar,
    Paper,Tooltip
} from '@material-ui/core';
import Icons from '@/components/Icons/icons.jsx'
import Service from './Service'
import Component from '@/Component.jsx'
import Badge from "components/Badge/Badge.js"
import DrawerT from '@/components/Dialog/Drawer.jsx'
import ColonyT from './component/colonyAdd.jsx'
import EnvAdd from './component/envAdd.jsx'
import AuthFilter from '@/AuthFilter.jsx'
import intl from 'react-intl-universal'

const BADAGE = {
    DEV:'success',
    TEST:'warning',
    STAGING:'primary',
    PROD:'info'
}
const styles = theme => ({
    header:{
        width:'1200px',
        margin:'0 auto',
        textAlign:'right'
    },
    group:{
        width:'1200px',
        margin:'32px auto',
        '& .mask_cluster_box':{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(169, 169, 169, 0.1)'
        },
        '& .mask_namespace_box':{
            height: '100% !important',
            position:'absolute',
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: 'rgba(169, 169, 169, 0.1)'
        },
        '& .title':{
            lineHeight:'30px',
            padding:'0 16px',
            fontSize:'.8rem',
            fontWeight: '600',
            color:'white',
            background:'#0071fb',
            borderTopLeftRadius:'4px',
            borderTopRightRadius:'4px',
            display:"inline-block"
        },
        '& .title_icon':{
            marginLeft:'8px',
            '& svg':{
                fontSize:'1.3rem'
            }
        },
        '& .box':{
            border:'1px solid #0071fb',
            padding:'16px',
            minHeight:'100px',
            position:'relative',
        },
        '& .content':{
            lineHeight:'30px',
            padding:'16px 24px',
            position:'relative',
            '&>div':{
                height:'60px',
            },
            '&:not(:first-child)':{
                marginTop:'16px'
            }
        },
        '& .row_text':{lineHeight:'28px'},
        '& .cell_icon':{width:'60px',textAlign:'center',marginTop:"-3px"},
        '& .cell_name':{width:'250px'},
        '& .cell_MD':{width:'160px',textAlign:'center'},
        '& .cell_SM':{width:'90px',textAlign:'center'},
        '& .cell_ACTION':{width:'90px',paddingLeft:'16px',textAlign:'center'}
    }
})

@withStyles(styles)
@AuthFilter
class Index extends Component{
    componentWillMount(){}

    componentDidMount(){
        this.loadCluster();
    }

    loadCluster(){
        const sc = this;
        sc.setState({data:[],data_load:false})
        Service.clusterListAndEnv((res)=>{
            sc.setState({data:res,data_load:true})
        })
    }

    state = {
        data_load:false,
        data:[]
    }

    handleRefreshNS = (item)=>{
        return ()=>{
            Service.namespaceSync(item.id,()=>{
                Store.notice.add({text:'Synchronization complete. '})
            })
        }
    }

    clusterAdd = () => {
        const sc = this;
        return ()=>{
            sc.refs.$drawer.onOpen({open:true},<ColonyT onOk={sc.clusterAddSuccess()}/>)
        }
    }

    clusterEdit = (item) => {
        const sc = this;
        return ()=>{
            sc.refs.$drawer.onOpen({open:true},<ColonyT data={item} onOk={sc.clusterAddSuccess()}/>)
        }
    }

    clusterAddSuccess(){
        const sc = this;
        return ()=>{
            sc.refs.$drawer.onOpen({open:false});
            window.Store.notice.add({text:intl.get('tipsPost')})
            sc.loadCluster();
        }
    }

    clickEnvAdd = (item)=>{
        const sc = this;
        return ()=>{
            sc.refs.$drawer.onOpen({open:true},<EnvAdd clusterData={item} onOk={sc.clickEnvAddSuccess(item)}/>)
        }
    }

    clickEnvEdit = (item,env)=>{
        const sc = this;
        return ()=>{
            sc.refs.$drawer.onOpen({open:true},<EnvAdd clusterData={item} data={env} onOk={sc.clickEnvAddSuccess(item)}/>)
        }
    }

    clickEnvAddSuccess = (item)=>{
        const sc = this;
        return ()=>{
            sc.refs.$drawer.onOpen({open:false})
            window.Store.notice.add({text:intl.get('tipsSave')})
            sc.loadCluster();
        }
    }

    htmlGroup(item){// 一个集群信息
        const { classes } = this.props;
        const auth = this.getClusterAuth(item);
        const groupNull = item.envs.length ? '' : noClusterMask.call(this,item,auth("W"));
        //
        return (
            <div className={classes.group}>
                <div className="flex-middle">
                    <div className="title" onClick={this.toUrl(`/cluster/${item.k8sName}/setting`)} >
                        <span className="h5 link2" >{disableClusterIcon(item)}{item.k8sName}</span>
                    </div>
                    <Tooltip title="Cluster users" >
                        <IconButton size="small" aria-label="user" className="title_icon" onClick={this.toUrl(`/cluster/${item.k8sName}/user`)} ><PeopleOutlinedIcon /></IconButton>
                    </Tooltip>
                    {
                        auth("W") ? (
                            <Tooltip title="Add namespace" >
                                <IconButton size="small" aria-label="user" className="title_icon" onClick={this.clickEnvAdd(item)} ><AddIcon /></IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title={intl.get('tipsNoAuthority')} >
                                <IconButton size="small" aria-label="user" className="title_icon" style={{opacity:.4}} ><AddIcon /></IconButton>
                            </Tooltip>
                        )
                    }
                    {
                        auth("W") ? (
                            <Tooltip title="Synchronize namespace" >
                                <IconButton size="small" aria-label="user" className="title_icon" onClick={this.handleRefreshNS(item)} ><RefreshIcon /></IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title={intl.get('tipsNoAuthority')} >
                                <IconButton size="small" aria-label="user" className="title_icon" style={{opacity:.4}}><RefreshIcon /></IconButton>
                            </Tooltip>
                        )
                    }
                </div>
                <Paper className="box">
                    {
                        item.envs.map((v,i)=>{
                            let id = v.id;
                            let name = v.envName;
                            let avatarName = (v.namespace||'').substring(0,1).toLocaleUpperCase();
                            let auth = this.getEnvAuth(v);
                            if(!auth('R')){
                                return '';
                            }
                            //
                            return (
                                <Paper className="content">
                                    <div className="flex-r">
                                        <div className="flex-one flex-middle">
                                            <div className="cell_icon overflow-text">
                                                <Avatar variant="square" >{avatarName}</Avatar>
                                            </div>
                                        </div>
                                        <Divider light={true} orientation={'vertical'} />
                                        <div className="flex-one">
                                            <div className="cell_MD overflow-text">
                                                <Typography variant="body2" className="row_text">
                                                    {intl.get('namespace.labelNamespce')}
                                                </Typography>
                                                <Typography variant="h5" className="link2 row_text" onClick={this.toUrl(`/namespace/${item.k8sName}/${v.namespace}/setting`)}>
                                                    {disableIcon(v)}{v.namespace}
                                                </Typography>
                                            </div>
                                        </div>
                                        <Divider light={true} orientation={'vertical'} />
                                        <div className="flex-box flex-center">
                                            <div style={{textAlign:'center'}}>
                                                <Typography variant="body2" className="row_text">{intl.get('namespace.labelResourceLimit')}</Typography>
                                                <div className="cell_MD overflow-text row_text">
                                                    {v.cpuLimit && (v.cpuLimit+' '+ (v.cpuLimitUnit||'m'))}&nbsp;&nbsp;
                                                    {v.memLimit && (v.memLimit+' '+ (v.memLimitUnit||'m'))}
                                                </div>
                                            </div>
                                        </div>
                                        <Divider light={true} orientation={'vertical'} />
                                        <div className="flex-box flex-center">
                                            <div style={{textAlign:'center'}}>
                                                <Typography variant="body2" className="row_text">{intl.get('namespace.labelResourceRequest')}</Typography>
                                                <div className="cell_MD overflow-text row_text">
                                                    {v.cpuRequest && (v.cpuRequest+' '+(v.cpuRequestUnit||'m'))}&nbsp;&nbsp;
                                                    {v.memRequest && (v.memRequest+' '+(v.memRequestUnit||'m'))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Paper>
                            )
                        })
                    }
                    {groupNull}
                </Paper>
            </div>
        )
    }

    render(){
        const sc = this;
        const { classes } = this.props;
        const { data,data_load } = this.state;
        let footer = data_load ?(data.length>0?'':<Icons.NodataT />) : <div className="container"><Icons.Loading /></div>
        //
        return (
            <div>
                <div className={classes.header}>
                    <Button color="primary" size="medium" startIcon={<AddIcon />}  onClick={this.clusterAdd()}>{intl.get('cluster.clusterAdd')}</Button>
                </div>
                {
                    data.map((one)=>{
                        return sc.htmlGroup(one)
                    })
                }
                {footer}
                <DrawerT ref="$drawer" />
            </div>
        )
    }
}

export default Index;

function noClusterMask(item,hasAuth) {
    let sc = this;
    if(hasAuth){
        return (
            <div className="mask_namespace_box flex-center" style={{background:'none'}}>
                <Button variant="contained" className="icon_button" onClick={sc.clickEnvAdd(item)}>{intl.get('namespace.export')}</Button>
            </div>
        )
    }else{
        return (
            <div className="mask_namespace_box flex-center" style={{background:'none'}}>
                <Tooltip title={intl.get('tipsNoAuthority')}>
                    <Button variant="contained" className="icon_button disabled" >{intl.get('namespace.export')}</Button>
                </Tooltip>
            </div>
        )
    }
}

function disableIcon(item){
    if(!item.disable){return ""};
    //
    return (
        <Tooltip title={intl.get('namespace.nouse')}>
            <PriorityHighOutlinedIcon style={{verticalAlign:'middle',width:'1rem',marginTop:'-3px',color:'rgb(255, 0, 0)'}} />
        </Tooltip>
    )
}

function disabledMask() {
    let sc = this;
    return (
        <Tooltip title={intl.get('namespace.nouse')}>
            <div className="mask_namespace_box flex-center" >
            </div>
        </Tooltip>
    )
}

function disableClusterIcon(item){
    if(!item.disable){return ""};
    //
    return (
        <Tooltip title={intl.get('cluster.nouse')}>
            <PriorityHighOutlinedIcon style={{verticalAlign:'middle',width:'1rem',marginTop:'-3px',color:'rgb(255, 0, 0)'}} />
        </Tooltip>
    )
}

function disabledClusterMask() {
    let sc = this;
    return (
        <Tooltip title={intl.get('cluster.nouse')}>
            <div className="mask_cluster_box flex-center" >
            </div>
        </Tooltip>
    )
}




