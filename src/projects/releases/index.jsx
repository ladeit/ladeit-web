import React from 'react';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    withStyles,Typography,Paper,IconButton,Divider,Button,
    CardHeader,CardContent
} from '@material-ui/core';

import Component from '@/Component.jsx'
import Icons from '@/components/Icons/icons.jsx'
import DatePicker from '@/components/Form/DatePicker'
import Service from '../Service'
import intl from 'react-intl-universal'
// template
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import ImageInfoT from '@/projects/components/versionList_ImageInfo.jsx'
import {CopyToClipboard} from "../components/group_user";
import AddImage from "./addImage";


const styles = theme => ({
    actions:{
        '& button':{
            marginRight:0
        }
    },
    menu:{
        width:"200px"
    },
    header:{
        marginBottom:'24px'
    },

    content:{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        margin: '-16px -24px',
        padding: '24px',
        position: 'absolute',
    }
});

@withStyles(styles)
class Index extends Component{

    componentWillMount(){
        this.initParams();
        this.menuActive = this.params._memo || 'common';
        this.tab = Store.project.headerTabList;
    }

    componentDidMount(){
        const sc = this;
        let params = this.params;
        let data = sc.state.data;
        Service.serviceMap({ServiceId:'',ServiceGroup:params._group,ServiceName:params._name},(res)=>{
            data.id = res.id;
            data.imageId = res.imageId;
            sc.clickMore();
        })
    }

    loadList(params){
        const sc = this;
        let data = sc.state.data;
        if(data.loaded){
            data.loaded = false;
            sc.forceUpdate();
        }
        Service.imageFilterList(params,(res)=>{
            if(params.currentPage == 1 && res.records.length){
                res.records[0]._collapse = true;
            }
            Array.prototype.push.apply(data.records,res.records);
            _.extend(data,res,{records:data.records,loaded:true});
            sc.state.data = data;
            sc.forceUpdate();
        })
    }

    state = {
        data:{loaded:false,pageNum:0,pageSize:10,totalPage:1,StartDate:'',EndDate:'',records:[]}
    }

    changeSearchDate = (arr)=>{
        const data = this.state.data;
        data.StartDate = arr[0];
        data.EndDate = arr[1];
        data.pageNum = 0;
        data.totalPage = 1;
        data.records.length = 0;
        this.clickMore();
    }

    clickMore = ()=>{
        const sc = this;
        const data = sc.state.data;
        sc.loadList({id:data.id,currentPage:data.pageNum+1, pageSize:data.pageSize,StartDate:data.StartDate,EndDate:data.EndDate});
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
    clickAdd = ()=>{
        this.refs.$yaml.onOpen({})
    }
    clickAdd_save(){
        const sc = this;
        return ()=>{
            sc.refs.$yaml.onCancel()
        }
    }  
    render(){
        const { classes } = this.props;
        const { data } = this.state;
        const params = this.params;
        let moreButton = <div className="flex-center split"><div className="buttonMore"><Button color="primary" size="small" onClick={this.clickMore} >more</Button></div></div>;
        let listFooter = data.loaded ? (data.records.length>0 ? ( data.totalPage>data.pageNum?moreButton:'' ) : <Icons.NodataT />) : <Icons.Loading />
        let serviceUrl = `${params._group}/${params._name}`;
        // <Button color="primary" startIcon={<FilterListIcon />} >筛选</Button>
        return (
            <Layout
                crumbList={[
                    {text:params._group,url:`/group/${params._group}`},
                    {text:params._name,url:`/summary/${serviceUrl}/common`},
                    {text:'Images'}
                ]}
                crumbFooter = {<Button color="primary"  onClick={this.clickAdd} startIcon={<AddIcon />} style={{marginLeft:"32px"}}>{intl.get('newCreate')}</Button>}
                menuT={<MenuLayout params={params} />}
                contentT={
                <>
                    <div className={`crumbs_action ${classes.actions}`} >

                            <DatePicker handle={this.changeSearchDate} />
                    </div>
                    <div className={classes.content}>
                      {
                        data.records.map((v,i)=>{
                          return (
                            <Paper className={clsx("list-info",'MuiPaper-elevation1')} key={i} >
                               <CardHeader className="list-info-header"
                                  title={
                                    <div onClick={()=>{this.clickCollapse(v)}}>
                                      <b className="overflow-text version link2" onClick={this.toUrl(`/releases/${serviceUrl}/${v.version}?id=${v.id}`)}>
                                          V{v.version}
                                      </b>
                                      <span className="overflow-text time"><Typography variant="body2"><Icons.TimeT data={v.createAt} /></Typography></span>
                                      {data.imageId==v.id && <Button disabled size="small" variant="outlined" style={{margin:'0 8px',padding:0,minWidth:'24px'}}>{intl.get('services.image.now')}</Button>}
                                      <IconButton className="fr" size="small" ><ExpandMoreIcon className={v._collapse?'active_icon':''}/></IconButton>
                                    </div>
                                  } >
                               </CardHeader>
                               <Divider light={true} />
                               <CardContent className={clsx("list-info-content",'hidden',v._collapse?'active_content':'')}>
                                  <ImageInfoT data={v} handle={this.clickSaveVersion}/>
                               </CardContent>
                            </Paper>
                          )
                        })
                      }
                      {listFooter}
                    </div>
                    <AddImage ref="$yaml" onOk={this.clickAdd_save()} title={intl.get('newCreate')} onOk_text={intl.get('generate')}/>
                </>
              }
            />
        );
    }
}

export default Index;
