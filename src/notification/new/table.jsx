import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {observer,inject} from "mobx-react";
import clsx from 'clsx';
import Moment from 'moment'
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import TableT from 'components/Table/table_page.jsx'
import ConfirmDialog from 'components/Dialog/Alert.jsx'
import Icons from 'components/Icons/icons'
import intl from 'react-intl-universal'
//
import Service from "@/notification/Service";
import AuthFilter from '@/AuthFilter.jsx'

const style = theme => ({
    root:{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        margin: '-16px -24px',
        padding: '16px 24px',
        position: 'absolute',
    },
    read:{
        paddingLeft:'16px'
    },
    cell_title:{
        paddingLeft:'16px'
    }
})

@withStyles(style)
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        const sc = this;
        const { classes,onEvent } = this.props;
        const typeList = Service.NOTIFICATION_TYPE();
        sc.state.$table = {
            dense:false,
            noSort:true,
            columns:[
                { id: 'title', disablePadding: true, label:<span className={classes.cell_title}>{intl.get('notification.tableTitle')}</span>,render(row){
                        if(row.read_flag){
                            return <Typography variant="body2" className={clsx("link2",classes.read)} >{row.title}</Typography>;
                        }else{
                            return <span className="link2" ><Badge className={`status_select badge`} variant="dot" />{row.title}</span>;//onClick={sc.clickDetail.call(sc,row)}
                        }
                    }},
                { id: 'gruop', disablePadding: true, label: intl.get('group.group') +' / '+intl.get('services.services'),render(row){
                        return <Typography variant="body2">{row.servicegroupname||'一'} / {row.servicename||'一'}</Typography>
                    }},
                { id: 'type', disablePadding: true, label: intl.get('notification.tableType'),render(row){
                        return <Typography variant="body2">{typeList[row.type]}</Typography>
                    }},
                { id: 'create', label: intl.get('notification.tableOprBy'),render(row){
                        return <Typography variant="body2" className="link2 auto_event" onClick={sc.toUrl(`/profile/${row.username}`)}>{row.username}</Typography>
                    }},
                { id: 'time', disablePadding: true, label: intl.get('notification.tableTime'),render(row){
                        return <Typography variant="body2">{Moment(row.create_at).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                    }},
                { id: '' }
            ],
            event:(name,data,event)=>{
                onEvent(name,data,event)
            }
        }
    }

    state = {}

    clearTable = (pagination)=>{
        this.state.$table.onRefresh(pagination);
    }

    clickDetail(row){
        let goFn = this.toUrl(`/notification/info/${row.id}`);
        return ()=>{
            if(!row.read_flag){
                Service.notificationReadList([{id:row.messagestateid}],function (res) {})
            }
            //
            goFn();
        }
    }

    render(){
        const sc = this;
        const { classes,data } = this.props;
        const { $table } = this.state;
        const loaded = data.loaded ? '' : <Icons.Loading />
        return (
            <div className={classes.root}>
                <TableT
                    toolbar=" "
                    onRef={$table}
                    rows={data}
                    rows_loaded={loaded}
                />
            </div>
        )
    }
}

export default MainComponent(Index);


function MainComponent(WComponent){

    @observer
    class Index extends React.PureComponent {
        state = {
        }

        loadAll(pm){
            let sc = this;
            let store = this.props.store;
            store.notification.loadNew(pm,function (pagination) {
                try{
                    sc.refs.$box.clearTable(pagination);
                }catch (e) {

                }
            })
        }

        clickDetail = (row)=>{
            if(!row.read_flag){
                Service.notificationReadList([{id:row.messagestateid}],function (res) {})
            }
            //
            History.push(`/notification/info/${row.id}?cate=new`)
        }

        onReadSelected = ()=>{
            let sc = this;
            let store = this.props.store;
            let data = store.notification.newData;
            let records = data.records;
            let selects = data.selected;
            let list = [];
            let tips = _.template(intl.get('notification.tipsFlagRead'))({len:selects.length})
            if(selects.length){
                sc.refs.$confirm.onOpen({
                    open:true,
                    title:'提示',
                    message:<Typography variant="body1" style={{width:'280px',fontWeight:400}}>{tips}</Typography>,
                    onOk:function(){
                        sc.refs.$confirm.onClose();
                        records.map(function(res){
                            if(selects.indexOf(res.id)>-1){
                                list.push({id:res.messagestateid})
                            }
                        })
                        //
                        Service.notificationReadList(list,function (res) {
                            sc.loadAll();
                        })
                    }
                })
            }
        }

        onReadAll = ()=>{
            const sc = this;
            sc.refs.$confirm.onOpen({
                open: true,
                title: '提示',
                message: <Typography variant="body1" style={{width: '280px', fontWeight: 400}}>{intl.get('notification.tipsFlagReadAll')}</Typography>,
                onOk:function () {
                    sc.refs.$confirm.onClose()
                    Service.notificationReadAll('', function (res) {
                        sc.loadAll();
                    })
                }
            })
        }

        onDelSelected = ()=>{
            let sc = this;
            let records = this.state.data.records;
            let selects = this.state.selected;
            let list = [];
            let tips = _.template(intl.get('notification.tipsDel'))({len:selects.length})
            if(selects.length) {
                sc.refs.$confirm.onOpen({
                    open: true,
                    title: '提示',
                    message: <Typography variant="body1"
                                         style={{width: '280px', fontWeight: 400}}>{tips}</Typography>,
                    onOk: function () {
                        sc.refs.$confirm.onClose()
                        Service.notificationDelAll('', function (res) {
                            sc.loadAll({currentPage:1});
                        })
                        records.map(function (res) {
                            if (selects.indexOf(res.id) > -1) {
                                list.push({id: res.messagestateid})
                            }
                        })
                        //
                        if (list.length) {
                            Service.notificationDelList(list, function (res) {
                                sc.loadAll({currentPage: 1});
                            })
                        }
                    }
                })
            }
        }

        onDelAll = ()=>{
            const sc = this;
            sc.refs.$confirm.onOpen({
                open: true,
                title: '提示',
                message: <Typography variant="body1" style={{width: '280px', fontWeight: 400}}>{intl.get('notification.tipsDelAll')}</Typography>,
                onOk: function () {
                    sc.refs.$confirm.onClose()
                    Service.notificationDelAll('', function (res) {
                        sc.loadAll();
                    })
                }
            })
        }

        onEvent = (name,data,event)=>{
            const sc = this;
            const store = sc.props.store;
            const newData = store.notification.newData;
            switch (name) {
                case "selected":{
                    store.notification.putSelected('newData',data);
                }
                    break;
                case "detail":{
                    let records = newData.records;
                    let one = records.filter(function (res) {return res.id == data})
                    if(one.length){
                        sc.clickDetail(one[0]);
                    }
                }
                    break;
                case 'page':{
                    sc.loadAll({currentPage: data+1})
                }
                    break;
                case 'pageSize':{
                    sc.loadAll({pageSize:data})
                }
                    break;
            }
        }

        render(){
            let sc = this;
            let store = this.props.store;
            let data = store.notification.newData;
            let newProps = {
                ...sc.props,
                data:data,
                onEvent:sc.onEvent
            }
            return (
                <div>
                    <WComponent {...newProps} ref="$box" />
                    <ConfirmDialog  ref="$confirm" onOk={sc.clickConfirm}/>
                </div>
            )
        }
    }

    return Index;
}
