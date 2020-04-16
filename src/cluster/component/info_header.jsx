import React from 'react';
import ReactDOM from 'react-dom';
import {
    withStyles,Paper,Button
} from '@material-ui/core'
import DrawerDialog from '@/components/Dialog/Drawer.jsx'
// template
import ColonyT from './colonyAdd.jsx'
import intl from 'react-intl-universal'

class Index extends React.PureComponent {
    componentDidMount(){
    }

    clusterAdd = () => {
        const sc = this;
        return ()=>{
            sc.refs.$drawerCluster.onOpen({open:true},<ColonyT onOk={sc.clusterAddSuccess()}/>)
        }
    }

    clusterAddSuccess(){
        const sc = this;
        const store = window.Store;
        return ()=>{
            sc.refs.$drawerCluster.onOpen({open:false});
            store.notice({text:intl.get('tipsPost')})
        }
    }

    render = ()=>{
        //
        return (
            <>
                <Button onClick={this.clusterAdd()}>{intl.get('cluster.clusterAdd')}</Button>
                <DrawerDialog ref="$drawerCluster" />
            </>
        )
    }
}

export default Index;
