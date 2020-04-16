import React from 'react';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import {
    withStyles,Typography,Paper,IconButton,Divider,
    Button,Grid,FormControlLabel,Switch,
    Toolbar,Tooltip,
} from '@material-ui/core';

import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import GroupT from '@/projects/components/group.jsx'
import MenuT from '@/components/Menu/menu.jsx'
import TableT from '@/components/Table/table.jsx'
import TableInfo from './index_table.jsx'
import YamlEditT from "../../cluster/component/yamlEdit";
import intl from 'react-intl-universal'

import Service from '../Service'
import AuthFilter from '@/AuthFilter.jsx'

const styles = theme => ({
  menu:{
    width:'100%',
    minWidth:'120px',
    marginRight:'16px'
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
  footer:{
    height:'50px',
    '& .button':{
      margin:'0 8px'
    }
  }
});

@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent{

    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){
      this.loadService()
    }

    loadService(){
      const sc = this;
      let params = this.params;
      Service.serviceMap({ServiceId:'',ServiceGroup:params._group,ServiceName:params._name},function(result){
          sc.state.serviceData = result;
          sc.loadServiceMap();
      })
    }

    loadServiceMap = ()=>{
        const sc = this;
        const serviceData = sc.state.serviceData;
        sc.setState({data:[],data_loaded:false});
        Service.serviceServiceMap({id:serviceData.id},function(res){
            sc.setState({serviceData:serviceData,data:res,data_loaded:true})
        })
    }

    state = {
      serviceData:{},
      data_loaded:false,
      data:[]
    }

    clickDownload(index){
        const sc = this;
        return ()=>{
            let serviceData = this.state.serviceData;
            _.download({url:`/api/v1/yaml/downloadAll?ServiceId=${serviceData.id}`,fileName:`${serviceData.name}_yaml.zip`})
        }
    }

    clickAdd = ()=>{
      this.refs.$yaml.onOpen({})
    }

    clickAdd_save(){
      const sc = this;
      return ()=>{
          let id = sc.state.serviceData.id;
          let yaml = sc.refs.$yaml.$editor.getValue();
          Service.serviceServiceYaml({serviceId:id,yaml:yaml},function(){
              sc.refs.$yaml.onCancel()
              sc.loadServiceMap();
          })
      }
    }

  render(){
    const sc = this;
    const { classes } = this.props;
    const params = this.params;
    const { serviceData,data,data_loaded } = this.state;
    let auth = this.getServiceAuth(serviceData);
    //
    return (
        <>
          <Layout
              crumbList={[{text:params._group,url:`/group/${params._group}`},{text:params._name,url:`/summary/${params._group}/${params._name}/${params._memo}`},{text:'Components'}]}
              crumbFooter={
                  <>
                      {
                          auth('X') ? (
                              <Button color="primary" onClick={this.clickAdd} startIcon={<AddIcon />} style={{marginLeft:"32px"}}>{intl.get('newCreate')}</Button>
                          ):(
                              <Tooltip title={intl.get('tipsNoAuthority')} >
                                  <Button color="primary" startIcon={<AddIcon />} style={{marginLeft:"32px",opacity:.4}}>{intl.get('newCreate')}</Button>
                              </Tooltip>
                          )
                      }
                      <Button color="primary" onClick={this.clickDownload()} startIcon={<GetAppIcon />} style={{marginLeft:"8px"}}>{intl.get('services.downloadYaml')}</Button>
                  </>
              }
              menuT={<MenuLayout params={params} />}
              contentT={<TableInfo serviceData={serviceData} renderService={sc.loadServiceMap} data={data} data_loaded={data_loaded}/>}
          />
          <YamlEditT ref="$yaml" onOk={this.clickAdd_save()} title={intl.get('newCreate')} onOk_text={intl.get('generate')}/>
        </>
    );
  }
}

export default Index;
