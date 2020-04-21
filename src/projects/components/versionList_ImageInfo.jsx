import React from 'react';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import {observer,inject} from "mobx-react";
import {withRouter,Route ,Router ,Switch ,Redirect} from "react-router-dom";
import {
    ArrowForward as ArrowForwardIcon,
    InsertComment as InsertCommentIcon,
    Edit as EditIcon
} from '@material-ui/icons';
import {
    withStyles,Typography,Paper,IconButton,Divider,Button,Input,Tooltip,
    CardHeader,CardContent,
    Table,TableHead,TableRow,TableCell,TableBody
} from '@material-ui/core';

const styles = theme => ({
    row_content:{
        paddingLeft:"16px"
    },
});

import Component from '@/Component.jsx'
import Icons from '@/components/Icons/icons.jsx'
import Inputs from '@/components/Form/inputs.jsx'
import AuthFilter from '@/AuthFilter.jsx'
import intl from 'react-intl-universal'


function getPath(){
    let arr = location.pathname.split('/');
    return `${arr[2]}/${arr[3]}`
}

@withStyles(styles)
@AuthFilter
class Index extends Component {
    componentWillMount(){
    }

    componentDidMount(){
        const { handle } = this.props;
        this.handle = handle || function(){};
    }

    render(){
        const { classes,data,groupUrl } = this.props;
        const sc = this;
        // 版本&nbsp;:&nbsp;<span className="overflow-text" style={{width:"160px"}}>master <EditIcon /></span>
        // 备: 版本 = 分组表头版本
        let version = data.version;
        let createAt = data.createAt;
        let image = data.image;
        let master = data.refs;
        let commit = data.commitHash;
        let memo = data.comments;
        let releases = data.releaseAO;

        return (
            <>
                <div className="row">
                    <b>{intl.get('services.image.imageTitle')}</b>
                    <div className={classes.row_content}>
                        {intl.get('services.image.imageVersion')}&nbsp;:&nbsp;<Inputs.EditLabel1 value={version} width={240} handle={(val)=>{this.handle(data,val)}}/>
                        {intl.get('services.image.imageTime')}&nbsp;:&nbsp;<span className="overflow-text"><Icons.TimeT data={createAt} /></span>
                        <br/>
                        {intl.get('services.image.imagePath')}&nbsp;:&nbsp;<Tooltip title={image}><span className="overflow-text" style={{maxWidth:"480px",padding:'0 8px'}}>{image}</span></Tooltip>
                    </div>
                </div>
                <div className="row">
                    <b>{intl.get('services.image.gitTitle')}</b>
                    <div className={classes.row_content}>
                        <Icons.BranchIcon />&nbsp;&nbsp;<span className="overflow-text" style={{width:"160px"}}>{master}</span>
                        <Icons.CommitIcon />&nbsp;&nbsp;<span className="overflow-text">{commit}</span>
                        <br/>
                        <InsertCommentIcon className="icon" style={{width:'15px'}}/>&nbsp;&nbsp;<span className="overflow-text">{memo}</span>
                    </div>
                </div>
                <div className="row">
                    <b>{intl.get('services.image.deployTitle')}</b>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{intl.get('services.image.deployName')}</TableCell>
                                <TableCell align="right">{intl.get('services.image.deployCreateBy')}</TableCell>
                                <TableCell align="right">{intl.get('services.image.deployOprChannel')}</TableCell>
                                <TableCell align="right">{intl.get('services.image.deployTime')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {releases.map(row => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" component="span" className="link1" onClick={this.toUrl(`/deployments/${groupUrl || getPath()}/common/${row.name}?id=${row.id}`)}>{row.name}</Typography>
                                    </TableCell>
                                    <TableCell align="right"><span className="link2" onClick={sc.toUrl(`/profile/${row.createBy}`)}>{row.createBy}</span></TableCell>
                                    <TableCell align="right">{row.operChannel}</TableCell>
                                    <TableCell align="right"><Icons.TimeT data={row.deployStartAt} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </>
        )
    }
}

export default Index;
