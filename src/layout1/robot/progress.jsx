import React from 'react';
import clsx from 'clsx';
import {inject,observer} from 'mobx-react';
import { withStyles } from '@material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import {Popover} from "@material-ui/core";
import Service from '@/projects/Service';
import intl from 'react-intl-universal'
import moment from 'moment'

const styles = theme => ({
    root:{
        //width: '230px',
        //minHeight: '30px',
        background: 'white',
        padding:'4px',
        '& .MuiLinearProgress-root':{
            width:'100%'
        },
        '& .icon_button':{
            width:'30px'
        },
        '& .memo':{
            width:'160px',
            padding:'0 8px',
            color:'#485358'
        },
        '& .progress':{
            width:'100px',
            paddingRight:'8px'
        },
        "& .activeIcon":{
            transform:'rotate3d(0, 0, 1, -180deg)',
            transition:'transform .3s'
        },
    },
    row:{
        minWidth:'280px',
        padding:'16px 24px',
        '& .name':{
            width:'180px',
            paddingRight:'8px'
        },
        '& .content':{
            width:'380px',
            color:'#94a1a9',
            display:'block'
        }
    }
})


@withStyles(styles)
@inject("store")
@observer
class Index extends React.PureComponent {

    listClose = (status) => {
        let val = this.state.closable ? 0 : status;
        this.setState({closable:val})
    }

    popoverTrigger = (status) => {
        const sc = this;
        if(status){
            return (e)=>{
                sc.setState({el:e.target})
            }
        }else{
            return ()=>{
                sc.setState({el:null})
            }
        }
    }

    state = {
        closable:false,
        el:null,
        data:[]
    }

    componentDidMount(){}

    renderStatus(status){
        let res = "";
        switch (status+'') {
            case '0':
                res = <LinearProgress className="success" variant={'determinate'}/>;
                break;
            case '8':
                res = <LinearProgress className="failed" variant={'determinate'}/>;
                break;
            default:
                res = <LinearProgress className="running" variant="buffer" valueBuffer={0} value={0}/>;
                break;
        }
        return res;
    }

    renderEvents = (data)=>{
        const sc = this;
        const { classes } = this.props;
        return data.map((v)=>{
            return (
                <Paper className={clsx(classes.row)} elevation={1}>
                    <div className="flex-r flex-middle">
                        <div className={clsx("flex-one","overflow-text","name")}>{v.name}</div>
                        <div className="flex-box">{sc.renderStatus(v.status)}</div>
                    </div>
                    <br/>
                    {
                        v.messageAOS.map((event)=>{
                            let startText = event.createAt ? moment(event.createAt).format('HH:mm:ss') : ' 一 ';
                            let reason = event.title || '';
                            return (
                                <div className="overflow-text content">
                                    {startText}&nbsp;&nbsp;
                                    {
                                        reason.length > 55 ? <Tooltip title={reason} ><span>{reason}</span></Tooltip> : reason
                                    }
                                </div>
                            )
                        })
                    }
                </Paper>
            )
        })
    }

    render(){
        const { classes,store } = this.props;
        const { el,closable } = this.state;
        const data = store.event.data;
        const runningArr = data.filter((one)=>{return one.status != 0;})
        const text = _.template(intl.get('services.tipsServiceDeploy'))({num:runningArr.length});
        let isClose = data.length == closable;

        return (
            <React.Fragment>
                <div className={data.length?'':'hidden'}>
                    <div className={clsx(classes.root,'flex-r','flex-middle')}>
                        <div className="flex-one icon_button">
                            <IconButton className={isClose?'activeIcon':''} size="small" onClick={()=>{this.listClose(data.length)}}><DoubleArrowIcon /></IconButton>
                        </div>
                        <div className={clsx("flex-one memo link2",isClose?'hidden':'')} onClick={this.popoverTrigger(true)}>
                            {text}
                        </div>
                        <div className={clsx("flex-box progress link2",isClose?'hidden':'') } >
                            {this.renderStatus(runningArr.length ? '1' : '0')}
                        </div>
                    </div>
                </div>
                <Popover
                    open={Boolean(el)}
                    anchorEl={el}
                    onClose={this.popoverTrigger(false)}
                    style={{marginTop:'10px'}}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    {
                        this.renderEvents(data)
                    }
                </Popover>
            </React.Fragment>
        )
    }
}

export default Index;
