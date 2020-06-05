import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,observer,inject} from "mobx-react"
import clsx from 'clsx'
import { withStyles,Typography,Button } from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Service from '../Service'
import DL from '@/static/store/CLUSTER_ADD.js'
import intl from 'react-intl-universal'
// template
import VersionListT from './versionList.jsx'
import ImageCreateT from '../releases/addImage'

const style = theme => ({
    content:{
        '& .content_title':{
            padding:'16px 0'
        }
    }
})

let versionListBtnStatus = 2;

@inject('store')
@observer
@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        this.config = DL.config();
        this.serviceData = this.props.serviceData;
        versionListBtnStatus = 2;
    }

    componentDidMount(){
        let imageList = this.state.imageList;
        this.loadPrefix()
        this.loadList({id:imageList.id,currentPage:imageList.pageNum, pageSize:imageList.pageSize})
    }

    loadPrefix = ()=>{
        let service = this.serviceData;
        this.config.createVersion.prefix = 'release ' + (service.imageVersion || 'none') + ' -> ';
        this.state.imageList.id = service.id;
    }

    loadList(params){
        const sc = this;
        let serviceData = this.serviceData;
        let data = sc.state.imageList;
        if(data.loaded){
            data.loaded = false;
            sc.forceUpdate();
        }
        Service.imageFilterList(params,(res)=>{
            res.records.map((v,i)=>{
                if(v.id == serviceData.imageId){
                    v.btn = 1;
                    versionListBtnStatus = 0;
                }else{
                    v.btn = versionListBtnStatus;
                }
            })
            Array.prototype.push.apply(data.records,res.records);
            _.extend(data,res,{records: data.records,loaded:true})
            sc.state.imageList = data;
            sc.forceUpdate();
        })
    }

    state = {
        imageList:{loaded:false,pageNum:1,pageSize:5,totalPage:1,StartDate:'',EndDate:'',records:[]}
    }

    clickMore = ()=>{
        const sc = this;
        const data = sc.state.imageList;
        sc.loadList({id:data.id,currentPage:data.pageNum+1, pageSize:data.pageSize});
    }

    handle(){
        const sc = this;
        const { renderStep } = this.props;
        let config = this.config.createVersion;
        return (name,v)=>{
            if(config.id != v.id){
                config.version = v.version;
                config.id = v.id;
                config.serviceId = v.serviceId;
                sc.forceUpdate();
                renderStep(false);
            }
        }
    }

    handleImageCreate = () => {
        const sc = this;
        const data = sc.state.imageList;
        data.records.length = 0;
        sc.refs.$imageCreate.onCancel();
        sc.loadList({id:data.id,currentPage:1, pageSize:data.pageSize});
    }

    render = ()=>{
        let { classes } = this.props;
        let { imageList } = this.state;
        let moreButton = <div className="flex-center split"><div className="buttonMore"><Button color="primary" size="small" onClick={this.clickMore} >more</Button></div></div>;
        let listFooter = imageList.loaded ? (imageList.records.length>0 ? (imageList.totalPage > imageList.pageNum ? moreButton:'') : <Icons.NodataT />) : <Icons.Loading />;
        let config = this.config.createVersion;
        let groupUrl = this.serviceData.groupName + "/" + this.serviceData.name;
        //
        return (
            <div className={clsx('flex-c',classes.content)}>
                <div className="flex-one content_title">
                    <Typography component="b" variant="body1">{intl.get('services.deploy.labelName')} : <span className={classes.version}>{config.prefix}{config.version}&nbsp;</span></Typography>
                </div>
                <div className="flex-box content_box">
                    <VersionListT handle={this.handle()} data={imageList.records} groupUrl={groupUrl}/>
                    {listFooter || <br/>}
                    <span className="link2" onClick={()=>{this.refs.$imageCreate.onOpen()}}>{intl.get('services.firstCreateImageTips')}</span>
                </div>
                <ImageCreateT ref="$imageCreate" />
            </div>
        )
    }
}

export default Index;
