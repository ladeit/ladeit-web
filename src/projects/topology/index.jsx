import React from 'react';
import {inject,observer} from 'mobx-react';
import {
    withStyles,Typography,Paper,IconButton,Divider,Button,Tooltip
} from '@material-ui/core';

import Icons from '@/components/Icons/icons.jsx'
import SaveIcon from '@material-ui/icons/Save';
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import FlowT from '@/topology/components/pod_topo.jsx'
import Service from "../Service";
import {CopyToClipboard} from "../components/group_user";
import AuthFilter from '@/AuthFilter.jsx'
import intl from 'react-intl-universal'

const styles = theme => ({
    menu:{
        width:"200px"
    },
    mask:{
        position:'absolute',
        top: 0,
        left: 0,
        textAlign: "center",
        width:'100%',
        height:'100%',
        backgroundColor:'rgba(1,1,1,.03)',
        '& span':{
            padding:'24px 0',
            display: 'inline-block',
            fontSize: "1rem",
        }
    }
});


@inject("store")
@observer
@AuthFilter
class Index extends React.PureComponent{
    componentWillMount(){
        this.initParams();
        this.loadTopo();
    }

    componentWillUnmount(){
        let { store } = this.props;
        store.project.ajaxTopoStop();
    }

    loadTopo(){
        const sc = this;
        let { store } = this.props;
        let params = this.params;
        store.project.ajaxTopo(params)
    }

    state = {}

    // match: {  }
    clickSave(){
        const sc = this;
        const { store } = this.props;
        const serviceData = store.project.serviceData;
        return ()=>{
            let json = sc.refs.$flow.dg.result();
            if(json){
                Service.serviceTopoUpdate({serviceId:serviceData.id,topo:JSON.stringify(json)},function () {
                    store.project.updateTopoOpt({isChange: false});
                    store.notice.add({text:intl.get('tipsSave')})
                    //
                    sc.loadTopo();
                })
            }
        }
    }


    render(){
        const { classes,store } = this.props;
        let params = this.params;
        let options = store.project.topoOpt;
        let topoData = options.data;
        let serviceData = store.project.serviceData;
        let auth = this.getServiceAuth(serviceData);
        return (
            <Layout
                crumbList={[{text:params._group,url:`/group/${params._group}`},{text:params._name,url:`/summary/${params._group}/${params._name}/${params._memo}`},{text:'Topology'}]}
                crumbFooter={
                    auth('X') ? (
                        <Button color="primary" disabled={!options.isChange} onClick={this.clickSave()}
                                startIcon={<SaveIcon/>} style={{marginLeft: '32px'}}>{intl.get('update')}</Button>
                    ) : (
                        <Tooltip title={intl.get('tipsNoAuthority')}>
                            <Button color="primary" startIcon={<SaveIcon/>} style={{marginLeft: '32px',opacity:.4}}>{intl.get('update')}</Button>
                        </Tooltip>
                    )
                }
                menuT={<MenuLayout params={params} />}
                contentT={
                    <>
                        {options.loaded ? <FlowT topoData={topoData} mask={serviceData.status>0?Service.STATUS[serviceData.status]:''} ref="$flow"/> : <Icons.Loading />}
                    </>
                }
            />
        );
    }
}

export default Index;
