import React from 'react';
import clsx from 'clsx';
import {
    Add as AddIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Button,IconButton,Divider,
    Paper,Switch,Grid 
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
    list:[],
    checked:true,
    openList:[]
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
    const { list,list_loaded,checked,openList } = this.state;
    const openHandle= (id)=>{
      let openList = [...this.state.openList];
      if(openList.includes(id)){
          return
      }
      openList.push(id);
      this.setState({
          openList
      })
  }
    if(list_loaded){
      let arr = [];
      return list.map((v,i)=>{
        return  (
          <div onClick={openHandle.bind(this,v.id)}>
            <GroupT data={v} key={v.id} renderGroup={this.loadService.bind(this)} isChecked={checked} openList ={openList} />
          </div>
        )
      })
    }else{
      return <div className="container"><Icons.Loading /></div>
    }
  }

  renderService = (data,hasChange)=>{
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
                  vv.imageAOS = _.concat(service.imageAOS,vv.imageAOS);
                  if(hasChange(vv,service)){
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
    const { list,list_loaded,checked,openList } = this.state;
    const footer = list_loaded && list.length<1 ? <Icons.NodataT /> : '';
    const AntSwitch = withStyles((theme) => ({
      root: {
        width: 28,
        height: 16,
        padding: 0,
        margin:'0px 4px'
      },
      switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
          transform: 'translateX(12px)',
          color: theme.palette.common.white,
          '& + $track': {
            opacity: 1,
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
          },
        },
      },
      thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
      },
      track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
      },
      checked: {},
    }))(Switch);
    const toggleChecked = (event)=>{
      let openList = this.state.openList;
      if(event.target.checked==false){
        openList=[]
      }
      this.setState({
        checked:event.target.checked,
        openList
      })
    }
    const switchSty = {
      position: "relative",
      top: "2px",
      color:'#3f51b5',
      fontWeight:500,
      fontSize:'14px',
      fontFamily: "Roboto, Helvetica, Aria"
    }
    return (
        <div className={classes.root}>
          <Layout
              contentT={(
                <>
                  <div className={clsx('container',classes.header)}>
                    <span style={switchSty}>
                      {intl.get('services.fold')}
                    </span> 
                    <AntSwitch checked={checked} onChange={toggleChecked} name="checked" />
                    <span style={switchSty}>
                      {intl.get('services.open')}
                    </span>
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
