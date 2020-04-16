import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {observer,inject} from "mobx-react";
import clsx from 'clsx';
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import TableComponent from './new/table'
import Icons from 'components/Icons/icons.jsx'
import AuthFilter from '@/AuthFilter.jsx'
import Service from './Service'
import intl from 'react-intl-universal'
//
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button';
import FilterCom from "./all/filter";

const style = theme => ({
    root:{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        margin: '-16px -24px',
        padding: '16px 24px',
        position: 'absolute',
    },
    tab:{
        marginLeft:'16px',
        marginBottom:'0',
        marginRight:'0',
        padding:'4px 8px'
    },
    filter:{
        marginLeft:'24px'
    },
    button:{
        marginLeft:'16px'
    },
    noread:{
        paddingLeft:'16px'
    },
    cell_title:{
        paddingLeft:'16px'
    }
})
const config = {
    filter:[
        {name:'serviceGroupId',value:'',options:[{key:'',value:'服务组'}]},
        {name:'type',value:'',options:[{key:'',value:'类型'}]}
    ]
}

@withStyles(style)
@inject('store')
@AuthFilter
@observer
class Index extends React.PureComponent {

    componentDidMount(){
        const sc = this;
        Service.NOTIFICATION_FILTER(config.filter,function () {
            if(sc.refs.$table){
                sc.refs.$table.loadAll();
                sc.forceUpdate();
            }
        })
    }

    state = {
    }

    clickFilter = (param)=>{
        param.currentPage = 1;
        this.refs.$table.loadAll(param);
    }

    clickRead = ()=>{
        this.refs.$table.onReadSelected();
    }

    clickReadAll = ()=>{
        this.refs.$table.onReadAll();
    }

    clickDel = ()=>{
        this.refs.$table.onDelSelected();
    }

    clickDelAll = ()=>{
        this.refs.$table.onDelAll();
    }

    renderData = (options)=>{
        this.setState(options);
    }

    render(){
        const sc = this;
        const { classes,store } = this.props;
        let da = store.notification.newData;
        return (
            <Layout
                menuT={<MenuLayout type="notification" />}
                crumbList={[{text:intl.get('notification.newMessage')}]}
                crumbFooter={
                    <React.Fragment>
                        <Button color="primary" className={classes.button} disabled={da.selected.length<1} onClick={sc.clickDel} style={{marginLeft:'32px'}}>{intl.get('delete')}</Button>
                        <Button color="primary" className={classes.button} disabled={da.selected.length<1} onClick={sc.clickRead}>{intl.get('notification.flagRead')}</Button>
                        <Button color="primary" className={classes.button} onClick={sc.clickReadAll } >{intl.get('notification.flagAllRead')}</Button>
                        <Button color="primary" className={classes.button} onClick={sc.clickDelAll } >{intl.get('notification.flagAllDel')}</Button>
                        <div className={classes.filter}>
                            <FilterCom form={config.filter} render={sc.clickFilter}></FilterCom>
                        </div>
                    </React.Fragment>
                }
                contentT={
                    <TableComponent ref="$table" render={sc.renderData} store={store}/>
                }
            />
        )
    }
}

export default Index;
