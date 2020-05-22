import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import {
    withStyles,Drawer
} from '@material-ui/core'

import Icons from 'components/Icons/icons'
import LogJsx from '@/cluster/component/log.jsx'
import intl from 'react-intl-universal'
import Service from '@/projects/Service'

const styles = theme => ({
    root: {

    }
});


@withStyles(styles)
class Index extends React.PureComponent {// TODO 重新包装
    state = {
        anchor:'bottom',
        open:false,
        data:{},
        list:[]
    }

    onOpen(options){
        const sc = this;
        _.extend(this.state,{list:[]},options);
        sc.forceUpdate();
        //
        Service.releaseConsole(options.data.id,function (res) {
            if(!res || res.length<1 || res[0]['children'].length<1){
                window.Store.notice.add({type:'warning',text:intl.get('services.tipsNoTiminal')})
                sc.state.open = false;
            }else{
                sc.state.list = res;
            }
            sc.forceUpdate();
        })
    }

    onCancel = ()=>{
        this.setState({open:false})
    }

    render(){
        let { classes,...other } = this.props;
        let { anchor,open,data,list } = this.state;
        return (
            <Drawer
                className={clsx('Drawer',classes.root,'drawer_edit')}
                elevation={15}
                anchor={anchor}
                open={open}
                onClose={this.onCancel}
                ModalProps={{hideBackdrop:true,disableScrollLock:true}}
                {...other}
            >
                {list.length ? <LogJsx onClose={this.onCancel} serviceData={data} list={list}/> : <Icons.Loading />}
            </Drawer>
        )
    }
}

export default Index;
