import React from 'react';
import {
    withStyles,Typography,Paper,IconButton,Divider,Button,
    DialogTitle,DialogContent
} from '@material-ui/core';

import moment from 'moment'
import Service from "../Service";
import Icons from '@/components/Icons/icons.jsx'
import DatePicker from '@/components/Form/DatePicker'
import intl from 'react-intl-universal'

const style = theme => ({
    root:{
        width:"680px",
        paddingBottom:'16px',
        '& .service_event_item':{
            padding:'8px 0'
        }
    }
})

@withStyles(style)
class Index extends React.PureComponent {
    componentDidMount(){
        this.loadEventNote();
    }

    loadEventNote(){
        const sc = this;
        const op = sc.state.eventList;
        const service = this.props.service;
        op.loaded = false;
        sc.setState({eventList:op})
        Service.eventNote({serviceId:service.id,pageSize:op.pageSize,pageNum:1,startTime:op.startTime,endTime:op.endTime},function (res) {
            op.pageNum = res.pageNum;
            op.pageSize = res.pageSize;
            op.totalPage = res.totalPage;
            op.records = res.records;
            op.loaded = true;
            sc.setState({eventList:{...op}})
        })
    }

    loadMore(){
        const sc = this;
        const service = this.props.service;
        return ()=>{
            let op = sc.state.eventList;
            op.loaded = false;
            sc.setState({eventList:op})
            Service.eventNote({serviceId:service.id,pageSize:op.pageSize,pageNum:op.pageNum+1,startTime:op.startTime,endTime:op.endTime},function (res) {
                if(res){
                    Array.prototype.push.apply(op.records,res.records);
                    op.pageNum = res.pageNum;
                    op.pageSize = res.pageSize;
                    op.totalPage = res.totalPage;
                    op.loaded = true;
                    sc.state.eventList = op;
                    sc.forceUpdate();
                }
            })
        }
    }

    state={
        eventList:{loaded:false,records:[],totalPage:0,pageSize:100,pageNum:0,startTime:'',endTime:''}
    }

    changeSearchDate = (arr)=>{
        const data = this.state.eventList;
        if(arr.length){
            data.startTime = arr[0].format('YYYY-MM-DD HH:mm');
            data.endTime = arr[1].format('YYYY-MM-DD HH:mm');
        }else{
            data.startTime = '';
            data.endTime = '';
        }
        data.records.length = 0;
        this.loadEventNote();
    }

    render(){
        const sc = this;
        const { classes }  = this.props;
        const { eventList } = this.state;
        let moreButton = <div className="flex-center split"><div className="buttonMore"><Button color="primary" size="small" onClick={this.loadMore()} >more</Button></div></div>;
        let bottomText = <div className="flex-center split"><div className="buttonMore"><Button size="small" disabled={true}>{intl.get('tipsListToBottom')}</Button></div></div>;
        let listFooter = eventList.loaded ? (eventList.records.length>0 ? ( eventList.totalPage>eventList.pageNum?moreButton:bottomText ) : <Icons.NodataT />) : <Icons.Loading />
        //
        return (
            <>
                <DialogTitle>
                    <Typography >
                        {intl.get('services.serviceActivity')}
                        {/*<div className="fr" style={{lineHeight:'30px'}}>*/}
                            {/*&nbsp;<DatePicker format="YYYY-MM-DD HH:mm" handle={this.changeSearchDate} />*/}
                        {/*</div>*/}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.root}>
                        {
                            eventList.records.map(function (one,i) {
                                return (
                                    <>
                                        <div className="service_event_item" key={i}>
                                            <div>{one.time && moment(one.time).format("YYYY/MM/DD HH:mm:ss")+'  '} {intl.get('services.events.type')} : {one.type} &nbsp;&nbsp;{intl.get('services.events.mode')} : {one.reason} &nbsp;&nbsp;{one.kind}/{one.name} &nbsp;&nbsp; <Icons.TimeT data={one.startTime} /></div>
                                            <Typography variant="body2">{one.note}</Typography>
                                        </div>
                                        <Divider light={true}/>
                                    </>
                                )
                            })
                        }
                        {listFooter}
                    </div>
                </DialogContent>
            </>
        )
    }
}

export default Index;
