import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,observer,inject} from "mobx-react"
import {
    Add as AddIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Divider,IconButton,Button,
    List,ListItem
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import ClusterService from '@/cluster/Service'
import ColonyAddT from '@/cluster/component/colonyAdd.jsx'

const style = theme => ({
})

@inject('store')
@observer
@withStyles(style)
class Index extends React.PureComponent {
    componentDidMount(){
        const sc = this;
        ClusterService.clusterList((res)=>{
            sc.setState({clusterList:res.map((v)=>{return {key: v.id,title: v.k8sName}})})
        })
    }

    state = {
        clusterEdit:false,
        clusterList:[] // key,title,content
    }

    showAddCluster(){
        const sc = this;
        return ()=>{
            sc.setState({clusterEdit:true})
        }
    }

    clickListItem(v){
        const sc = this;
        let { renderStep,deploymentStore:{ createFirstCluster} } = this.props;
        return ()=>{
            if(v.key != createFirstCluster.sel){
                createFirstCluster.sel = v.key;
                sc.state.clusterEdit = false;
                sc.forceUpdate()
            }
        }
    }

    clickSaveAfter(){
        const sc = this;
        return (name)=>{
            let list = sc.state.clusterList;
            list.push(name)
            sc.setState({clusterList: [...list]})
        }
    }

    render = ()=>{
        const { clusterList,clusterEdit } = this.state;
        let { deploymentStore:{ createFirstCluster} } = this.props;
        let { classes,serviceData } = this.props;
        return (
            <div className={classes.content} >
                <div>
                    {
                        clusterList.map((v) =>{
                            let active = v.key == createFirstCluster.sel;
                            return <Icons.ItemT title={v.title} active={active} onClick={this.clickListItem(v)}/>
                        })
                    }
                    <IconButton onClick={this.showAddCluster()} ><AddIcon /></IconButton>
                </div>
                {!clusterEdit || <ColonyAddT onOk={this.clickSaveAfter()}/>}
            </div>
        )
    }
}

export default Index;
