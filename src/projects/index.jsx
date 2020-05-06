import React from 'react';
import clsx from 'clsx';
import {
    Add as AddIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Button,IconButton,Divider,
    Paper
} from '@material-ui/core';

import Icons from 'components/Icons/icons.jsx'
import DrawerDialog from '@/components/Dialog/Drawer.jsx'
import Service from './Service'
// template
import Layout from '@/layout1/dashboard.jsx'
import GroupT from '@/projects/components/group.jsx'
import GroupAddT from '@/projects/components/groupAdd.jsx'
import intl from 'react-intl-universal'

const styles = theme => ({
  root:{
    backgroundColor:'#fbfcfe'
  },
  header:{
    textAlign:'right'
  }
});

@withStyles(styles)
class Index extends React.PureComponent{

  componentDidMount(){
      this.loadService();
      Store.event.bindDataEvent(this.renderService)
  }

  componentWillUnmount(){
      Store.event.bindDataEvent()
  }

  loadService(){
    const sc = this;
    const user = _.local('user');
    Service.groupList((res)=>{
      // let arr = res.filter((v,i)=>{// TODO 暂时前台删除无权限的，后台校验体系都没做起来
      //     // v.servicelist.length && v.servicelist.push(v.servicelist[0])
      //     v.servicelist || (v.servicelist = []);
      //     if(!user.admin){
      //         v.servicelist = v.servicelist.filter(function (one) {
      //             return (one.roleNum||'').indexOf('R')>-1;
      //         })
      //     }
      //     return  v.servicelist.length; //v.servicelist.length
      // })
      sc.setState({list:res,list_loaded:true})
    })
  }

  state = {
    list_loaded:false,
    list:[]
  }

  clickAddGroup(){
    const sc = this;
    return ()=>{
      sc.refs.$drawer.onOpen({open:true},<GroupAddT onOk={sc.clickAddGroup_success}/>)
    }
  }

  clickAddGroup_success = (res)=>{
    this.refs.$drawer.onOpen({open:false});
    this.loadService()
    window.Store.notice.add({text:res})
  }

  htmlGroup(){
    const { list,list_loaded } = this.state;

    if(list_loaded){
      let arr = [];
      return list.map((v,i)=>{
        return  <GroupT data={v} key={v.id} renderGroup={this.loadService.bind(this)}/>
      })
    }else{
      return <div className="container"><Icons.Loading /></div>
    }
  }

  renderService = (data)=>{
      let groupData = this.state.list;
      let isChange = false;
      let ids = data.map((v) => {return v.id;})
      if(ids.length<1){
          return;
      }
      //
      groupData.forEach((v) => {
          v.servicelist.forEach((vv)=>{
              let index = ids.indexOf(vv.id);
              if(index>-1){
                  let service = data[index];
                  service.imageAOS = _.concat(service.imageAOS,vv.imageAOS);
                  if(vv.status != service.status){
                      window._.extend(vv,service);
                      isChange = true;
                  }
              }
          })
      })
      //
      if(isChange){
          this.setState({list:[...groupData]})
      }
  }

  render(){
    const { classes } = this.props;
    const { list,list_loaded } = this.state;
    const footer = list_loaded && list.length<1 ? <Icons.NodataT /> : '';
    return (
        <div className={classes.root}>
          <Layout
              contentT={(
                <>
                  <div className={clsx('container',classes.header)}>
                    <Button color="primary" size="medium" startIcon={<AddIcon />} onClick={this.clickAddGroup()}>{intl.get('services.groupAdd')}</Button>
                  </div>
                  <div>
                    {this.htmlGroup()}
                    {footer}
                  </div>
                  <DrawerDialog ref="$drawer" />
                </>
              )}
          />
        </div>
    );
  }
}

export default Index;
