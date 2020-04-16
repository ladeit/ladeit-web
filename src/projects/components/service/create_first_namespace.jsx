import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,observer,inject} from "mobx-react"
import {
    Search as SearchIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Divider,
    List,ListItem
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import ClusterService from '@/cluster/Service'

const style = theme => ({
    list:{
        maxHeight: '240px',
        overflow: 'auto'
    }
})

@inject('deploymentStore')
@observer
@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        //
    }

    componentDidMount(){
        const sc = this;
        let { deploymentStore:{createFirstCluster} } = this.props;
        ClusterService.namespaceList({id:createFirstCluster.sel},(res)=>{
            sc.setState({namespaceList:res})
        })
    }

    state = {
        //namespaceList_loaded:false,
        namespaceList:[]
    }

    clickListItem(v){
        const sc = this;
        let { renderStep,deploymentStore:{createFirstNamespace} } = this.props;
        return ()=>{
            if(v != createFirstNamespace.sel){
                createFirstNamespace.sel = v;
                sc.forceUpdate();
            }
        }
    }

    render = ()=>{
        const { namespaceList,namespaceList_loaded } = this.state;
        let { classes,serviceData,deploymentStore:{createFirstNamespace } } = this.props;
        return (
            <div className={classes.content} >
                <Inputs.AutoInput icons={<SearchIcon style={{margin:'0 8px'}}/>} />
                <List className={classes.list}>
                    {
                        namespaceList.map((v) =>{
                            return <ListItem button selected={v==createFirstNamespace.sel} onClick={this.clickListItem(v)} >{v}</ListItem>
                        })
                    }
                </List>
            </div>
        )
    }
}

export default Index;
