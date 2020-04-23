import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
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
            maxWidth:'380px',
            color:'#94a1a9',
            display:'block'
        }
    }
})

@withStyles(styles)
class Index extends React.PureComponent {

    listClose = (status) => {
        this.setState({closable:status})
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

    loadData = ()=>{
        const sc = this;
        Service.serviceTips((res)=>{
            sc.setState({data:res})
        })
    }

    state = {
        closable:false,
        el:null,
        data:[]
    }

    componentDidMount(){
        //this.loadData();
    }

    render(){
        const { classes } = this.props;
        const { el,closable } = this.state;
        const text = _.template(intl.get('services.tipsServiceDeploy'))({num:3})
        return (
            <React.Fragment>
                <div className={clsx(classes.root,'flex-r','flex-middle')} >
                    <div className="flex-one icon_button">
                        <IconButton className={closable?'activeIcon':''} size="small" onClick={()=>{this.listClose(!closable)}}><DoubleArrowIcon /></IconButton>
                    </div>
                    <div className={clsx("flex-one memo link2",closable?'hidden':'')} onClick={this.popoverTrigger(true)}>
                        {text}
                    </div>
                    <div className={clsx("flex-box progress link2",closable?'hidden':'') } >
                        <LinearProgress className="running" variant="buffer" valueBuffer={0} value={0}/>
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
                    <Paper className={clsx(classes.row)} elevation={1}>
                        <div className="flex-r flex-middle">
                            <div className={clsx("flex-one","overflow-text","name")}>group / services</div>
                            <div className="flex-box"><LinearProgress className="running" variant="buffer" valueBuffer={0} value={0}/></div>
                        </div>
                        <br/>
                        <div className="overflow-text content">
                            {moment('2020-4-16 10:10:10').format('YYYY-MM-DD HH:mm:ss')}&nbsp;&nbsp;
                            buzzy-git-ms/buzzy-test FailedCreate
                        </div>
                    </Paper>
                    <Paper className={clsx(classes.row)} elevation={1}>
                        <div className="flex-r flex-middle">
                            <div className={clsx("flex-one","overflow-text","name")}>group / services</div>
                            <div className="flex-box"><LinearProgress className="success" variant={'determinate'}/></div>
                        </div>
                        <br/>
                        <div className="overflow-text content">
                            {moment('2020-4-16 10:10:10').format('YYYY-MM-DD HH:mm:ss')}&nbsp;&nbsp;
                            buzzy-git-ms/buzzy-test FailedCreate
                        </div>
                        <div className="overflow-text content">
                            {moment('2020-4-16 10:10:10').format('YYYY-MM-DD HH:mm:ss')}&nbsp;&nbsp;
                            buzzy-git-ms/buzzy-test FailedCreate
                        </div>
                        <div className="overflow-text content">
                            {moment('2020-4-16 10:10:10').format('YYYY-MM-DD HH:mm:ss')}&nbsp;&nbsp;
                            buzzy-git-ms/buzzy-test FailedCreatebuzzy-git-ms/buzzy-test FailedCreatebuzzy-git-ms/buzzy-test FailedCreatebuzzy-git-ms/buzzy-test FailedCreate
                        </div>
                    </Paper>
                    <Paper className={clsx(classes.row)} elevation={1}>
                        <div className="flex-r flex-middle">
                            <div className={clsx("flex-one","overflow-text","name")}>group / services</div>
                            <div className="flex-box"><LinearProgress className="failed" variant={'determinate'}/></div>
                        </div>
                        <br/>
                        <div className="overflow-text content">
                            {moment('2020-4-16 10:10:10').format('YYYY-MM-DD HH:mm:ss')}&nbsp;&nbsp;
                            buzzy-git-ms/buzzy-test FailedCreate
                        </div>
                    </Paper>
                </Popover>
            </React.Fragment>
        )
    }
}

export default Index;
