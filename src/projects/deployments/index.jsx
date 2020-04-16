import React from 'react';
import {
    FilterList as FilterListIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Paper,IconButton,Divider,
    Button,Grid,FormControlLabel,Switch,
    Toolbar,Tooltip
} from '@material-ui/core';

import Component from '@/Component.jsx'
import Drawer from '@/components/Dialog/Drawer.jsx'
import Service from '../Service'
import Icons from '@/components/Icons/icons.jsx'
import intl from 'react-intl-universal'
// template
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import GroupT from '@/projects/components/group.jsx'
import MenuT from '@/components/Menu/menu.jsx'
import TableT from '@/components/Table/table_more.jsx'

const styles = theme => ({
    root:{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        margin: '-16px -24px',
        padding: '16px 24px',
        position: 'absolute',
    },
    toolbar:{
        padding:'0 16px',
        '& .flex-right':{
          width:'100%'
        },
        '& .title':{
          whiteSpace:'nowrap'
        }
    },
    drawer_version:{
        minWidth:'320px',
        padding:'8px'
    }
});

// global
const NULL_TEXT = ' 一 '
const FORMART_TIME = function(time){
  let arr = time.split(/\s+/g);
  return arr.map((v)=>{
    return <div>{v}</div>
  })
}

@withStyles(styles)
class Index extends Component{

  componentWillMount(){
    const clickVertion = this.handleVersion;
    const sc = this;
    this.initParams();
    let params = this.params;
    this.tab = Store.project.headerTabList;
    this.$table = {
        //perPage:15,
        dense:true,
        noChecked:true,
        noSort:true,
        columns:[
            { id: 'name', label: intl.get('services.deploy.labelName') ,render(row){
                    return <Typography variant="body2" component="span" className="link1" onClick={()=>{History.push(`/deployments/${params._group}/${params._name}/${params._memo}/${row.name}?id=${row.id}`)}}>{row.name}</Typography>
            }},
            { id: 'type',  label: intl.get('services.deploy.labelType') ,render(row){return Service.RELEASE_TYPE(row.type||'0')}},
            { id: 'operChannel',  label: intl.get('services.deploy.labelChannel') ,render(row){return row.operChannel||''}},
            { id: 'create',  label: intl.get('services.deploy.labelCreate'),render(row){
              return (
                  <>
                    <Typography variant="body1 link2" onClick={sc.toUrl(`/profile/${row.createBy}`)}><b>{row.createBy||NULL_TEXT}</b></Typography>
                    <Typography variant="body2"><Icons.TimeT data={row.deployStartAt} /></Typography>
                  </>
              )
            }},
            { id: 'service',  label: intl.get('services.deploy.labelWork') ,render(row){
              return (
                  <>
                    <div>{intl.get('services.deploy.labelStartTime')} :&nbsp;<Typography variant="body2" component="span"><Icons.TimeT data={row.serviceStartAt} /></Typography></div>
                    <div>{intl.get('services.deploy.labelEndTime')} :&nbsp;<Typography variant="body2" component="span"><Icons.TimeT data={row.serviceFinishAt} /></Typography></div>
                  </>
              )
            }},
            { id: 'status',  label: intl.get('services.deploy.labelStatus') ,render:function(row){
                 return Service.DEPOLY_STATUS(row.status)
            }}
        ],
        event:function() {
            //
        }
    }
  }

  componentDidMount(){
    const sc = this;
    let params = this.params;
    Service.serviceMap({ServiceId:'',ServiceGroup:params._group,ServiceName:params._name},(res)=>{
        sc.state.serviceData = res;
        sc.clickMore();
    })
  }

    loadList(params){
        const sc = this;
        let data = sc.state.data;
        let moreButton = <div className="flex-center" style={{padding:'16px 0'}}><div className="buttonMore"><Button color="primary" size="small" onClick={this.clickMore} >more</Button></div></div>;
        sc.$table.onMore('',<div className="flex-center" style={{padding:'16px 0'}}><Icons.Loading /></div>);
        Service.releaseList(params,(res)=>{
            Array.prototype.push.apply(data.records,res.records);
            data.totalPage = res.totalPage;
            data.pageNum = res.pageNum;
            if(data.records.length){
                let listFooter = data.totalPage>data.pageNum?moreButton:'';
                sc.$table.onMore(data.records,listFooter);
            }else{
                sc.$table.onMore(data.records,<Icons.NodataT />);
            }
        })
    }

    state = {
        dense:false,
        serviceData:{},
        data:{loaded:false,pageNum:0,pageSize:10,totalPage:1,ServiceId:'',records:[]}
    }

    clickMore = ()=>{
        const sc = this;
        const data = sc.state.data;
        const serviceData = sc.state.serviceData;
        sc.loadList({ServiceId:serviceData.id,currentPage:data.pageNum+1, pageSize:data.pageSize});
    }

  menuChange = (e,val)=>{
    let url = this.props.match.path;
    url = url.replace(/\/deployments\//,`/${val}/`);
    this.renderRoute(url);
  }

  handleVersion = ()=>{
    this.$version.onOpen({open:true})
  }

  handleDense = event => {
    this.setState({dense:event.target.checked});
    this.$table.onDense(event.target.checked);
  }

  render(){
    const { classes } = this.props;
    const { dense,data } = this.state;
    const params = this.params;
      //
    return (
      <>
        <Layout
            crumbList={[{text:params._group,url:`/group/${params._group}`},{text:params._name,url:`/summary/${params._group}/${params._name}/${params._memo}`},{text:'Releases'}]}
            menuT={<MenuLayout params={params} />}
            contentT={
              <div className={classes.root}>
                  <TableT
                    rows={data.records}
                    onRef={this.$table}
                  />
              </div>
            }
        />
        <Drawer
          html={
              <div className={classes.drawer_version}>
                <p><Typography component="b" variant="h5">Version</Typography></p>
                <p>( 内容为 git 信息 )</p>
              </div>
          } onRef={(ref)=>{this.$version = ref;}}/>
      </>
    );
  }
}

export default Index;
