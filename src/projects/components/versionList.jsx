import React from 'react';
import clsx from 'clsx';
import {
    ArrowForward as ArrowForwardIcon,
    InsertComment as InsertCommentIcon
} from '@material-ui/icons';
import {
    withStyles,Typography,Paper,IconButton,Divider,Button,
    CardHeader,CardContent,
    Table,TableHead,TableRow,TableCell,TableBody
} from '@material-ui/core';

import Component from '@/Component.jsx'
import Icons from '@/components/Icons/icons.jsx'
import Service from '../Service'
import intl from 'react-intl-universal'
// template
import ImageInfoT from './versionList_ImageInfo.jsx'
import Clearfix from "components/Clearfix/Clearfix.js"

const styles = theme => ({
    menu:{
        width:"200px"
    },
    table:{
    },
    title:{
        padding:'8px 0',
        display:'inline-block',
    },
    row_content:{
        paddingLeft:"16px"
    }
});

@withStyles(styles)
class Index extends Component{
    componentWillMount(){
    }

    componentDidMount(){
        let props = this.props;
        this.handle = props.handle || function(){};
    }

    state = {
        data_sel:'',
        data:[]
    }

    clickSaveVersion = (item,val)=>{
        const sc = this;
        Service.imagePut({version:val,id:item.id},(res)=>{
            item.version = val;
            sc.forceUpdate();
        })
    }

    clickCollapse = (item)=>{
        item._collapse = !item._collapse;
        this.forceUpdate();
    }

    selectVersion = (v)=>{
        this.state.data_sel = v.id;
        this.handle('version', v)
    }

    htmlContent(item,index,btn){
        const sc = this;
        const { classes,groupUrl } = this.props;
        const { data_sel } = this.state;
        const disabled = item.id == data_sel;
        let btnSelect = <Button variant="outlined" disabled size="small" >{intl.get('services.deploy.nowVersion')}</Button>
        if(btn==2){
            btnSelect =  <Button variant="outlined" color="primary" size="small" disabled={disabled} onClick={()=>{this.selectVersion(item)}}>{intl.get('services.image.upgrade')}</Button>
        }else if(btn==0){
            btnSelect =  <Button variant="outlined" color="primary" size="small" disabled={disabled} onClick={()=>{this.selectVersion(item)}}>{intl.get('services.image.rollback')}</Button>
        }

        return (
            <Paper className={clsx("list-info",'MuiPaper-elevation1')} key={index} >
                <CardHeader className="list-info-header"
                    title={
                        <div className="flex-r">
                          <div className="flex-box" onClick={()=>{this.clickCollapse(item)}}>
                              <b className="overflow-text version link2" onClick={this.toUrl(`/releases/${groupUrl}/${item.version}?id=${item.id}`)}>V{item.version}</b>
                              <span className="overflow-text time"><Typography variant="body2"><Icons.TimeT data={item.createAt} /></Typography></span>
                          </div>
                          <div className="flex-one">
                               {btnSelect}
                          </div>
                        </div>
                    } >
                </CardHeader>
                <Divider light={true} />
                <CardContent className={clsx("list-info-content",'hidden',item._collapse?'active_content':'')}>
                    <ImageInfoT data={item} groupUrl={groupUrl} handle={this.clickSaveVersion}/>
                </CardContent>
            </Paper>
        )
    }

    render(){
        const { classes,data } = this.props;
        // <IconButton className="fr" size="small" style={{marginTop:'4px'}} ><ArrowForwardIcon className={v._collapse?'active_icon':''}/></IconButton>
        return (
            <div className="">
                {
                    data.map((v,i)=>{
                        return (
                            this.htmlContent(v,i,v.btn)
                        )
                    })
                }
                <Clearfix />
            </div>
        );
    }
}

export default Index;
