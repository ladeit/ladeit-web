import React from 'react';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';
import {
    Menu as MenuIcon,
    MoreVert as MoreVertIcon,
    SettingsApplications as SettingsApplicationsIcon,
    ArrowDropDown as ArrowDropDownIcon,
    //
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Person as PersonIcon,
    DeviceHub as DeviceHubIcon
} from '@material-ui/icons';
import {
    withStyles,Typography,Paper,IconButton,Button,Divider,
    Avatar,Badge,
    CardHeader,CardContent,
} from '@material-ui/core';

import Icons from '@/components/Icons/icons.jsx'
import Component from '@/Component.jsx'
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.jsx'
import DeploymentT from '@/topology/deployment.jsx'
// template
import CreateT from './create.jsx'
import DrawerT from '@/components/Dialog/Drawer.jsx'
import DrawerUserT from './group_user.jsx'
import ProjectsFlagPng from '@static/img/project_flag.png'
import ProjectsFlagSPng from '@static/img/project_flag_s.png'

const styles = theme => ({
  root:{
    marginBottom:'16px',
    color:'inherit',
    '& p':{
      margin:'8px 0 0'
    },
    '& .card-action':{
      marginTop:'8px'
    },
  },
  item:{
    lineHeight:"1rem",
    marginBottom:"8px",
    color:'inherit',
    '&:hover':{
      boxShadow:'0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
    },
    '& .pro_name':{
      color:"#444",
      fontSize:"1.1rem",
      fontWeight:600
    }
  },
  cell_name:{width:"220px",paddingRight:"8px"},
  cell_match:{width:'80px'},
  cell_gatewary:{width:'170px'},
  cell_version:{width:"150px"},
  cell_robot:{padding:'0 16px'},
  cell_action:{
    paddingLeft:"16px",
    '& .icon':{
      color:'#444'
    }
  }
});


const STATUS = ['正常运行','金丝雀发布中','蓝绿发布中','ABTEST发布中','滚动发布中']

class Index extends Component{

  state = {
  }

  //handle(){
  //  const sc = this;
  //  return (name,v)=>{
  //    sc.state.version = v.version;
  //    sc.renderCreate();
  //  }
  //}

  clickCreate(item){
    const sc = this;
    return ()=>{
      //sc.refs.$create.loadVersion(item);
      //sc.refs.$create.onOpen({
      //  item:item,
      //  open:true
      //})
      sc.$drawerUser.onOpen({open:true,anchor:'bottom'}, <DeploymentT serviceData={item} handleClose={this.clickCreateClose(item)} />)
    }
  }

  clickCreateClose = (item)=>{
    const sc = this;
    let { data } = this.props;
    return (flag)=>{
      if(flag){// 完成
        History.push(`/topology/${data.name}/${item.name}`)
      }else{// 取消
        sc.$drawerUser.onOpen({open:false});
      }
    }
  }

  clickUser(item){
    const sc = this;
    const { data } = this.props;
    return ()=>{
      sc.$drawerUser.onOpen({open:true},<DrawerUserT params={{_group:data.name}}/>)
    }
  }

  htmlGroupStatus(item){
    let status = item.status - 0
    switch (status){
      case -1:
        return <span><Badge className="status_undefined badge" variant="dot" /></span>
      case 0:
        return <span><Badge className="status_success badge" variant="dot" />正常运行中</span>
      case 1:
      case 2:
      case 3:
      case 4:
        return <span><Badge className="status_running badge" variant="dot" />滚动升级中</span>
      default:
        break;
    }
  }

  htmlVersion(item){
    let { classes,data } = this.props;
    let arr = [];
    let status = STATUS[item.status];
    let imageVersion = item.image_version;
    let key = item.name;
    if(item.status==-1){
      arr.push(<a className="link2" onClick={this.clickCreate(item)} key={key}>新建</a>)
    }else if(item.status>1){
      arr.push(<a className="link2" onClick={this.toUrl(`/topology/${data.name}/${item.name}`)} key={key}>{status}</a>)
    }else{
      arr.push(<a className="link2" onClick={this.toUrl(`/topology/${data.name}/${item.name}`)} key={key}>{imageVersion}</a>)
      arr.push(<p key={key+'_'}>( <a className="link2" onClick={this.clickCreate(item)} >新建</a> )</p>)
    }
    return arr;
  }

  render(){
    const sc = this;
    const { classes,data,...other } = this.props;
    const eye = this.state.eye;
    let avator = data.name.substring(0,1).toLocaleUpperCase();
    let name = data.name;
    let envName = data.envName;
    let clusterName = data.clusterName;
    //
    return (
      <>
        <Paper className={clsx(classes.root,"MuiPaper-elevation1")} {...other}>
          <CardHeader
              avatar={
                <Avatar aria-label="recipe" className="">{avator}</Avatar>
              }
              action={
              <div className="card-action">
                <IconButton aria-label="eye" onClick={()=>{this.setState({eye:!eye})}}>{eye?<VisibilityOffIcon />:<VisibilityIcon />}</IconButton>
                <CustomDropdown
                  buttonIcon={<MoreVertIcon />}
                  placement="bottom-end"
                  dropdownList={[
                    "Action",
                    "Another action",
                    "Something else here",
                    { divider: true },
                    "Separated link"
                  ]}
                />
              </div>
            }
            title={
              <div className="flex-middle">
                <span className="h5 link2" onClick={this.toUrl(`/group/${name}`)}>{name}</span>&nbsp;&nbsp;&nbsp;
                <IconButton aria-label="user" onClick={this.clickUser()}><PersonIcon /></IconButton>
                <IconButton aria-label="setting"><SettingsApplicationsIcon /></IconButton>
                <IconButton aria-label="topography" onClick={this.toUrl('/topology/group')}><DeviceHubIcon /></IconButton>&nbsp;&nbsp;
                <Badge className={`status_success badge`} variant="dot" />{envName}&nbsp;
                <Badge className={`status_success badge`} variant="dot" />{clusterName}
              </div>
            }
              subheader=""
          />
          <Divider light={true}/>
          <CardContent className={eye?'hidden':''}>
            {
              data.servicelist.map((v,i)=>{
                let id = v.id;
                let name = v.name;
                let match = v.match || ' - ';
                let url = data.gateway || ' - ';
                return (
                    <Paper className={clsx('MuiPaper-elevation1',classes.item) } key={i}>
                      <CardContent className="flex-r card-content" style={{padding:"16px"}}>
                        <div className={"flex-one overflow-text "+classes.cell_name}>
                          <span className="link2 pro_name" onClick={this.toUrl(`/setting/${data.name}/${name}/common`)}>{name}</span>
                        </div>
                        <div className="flex-box">
                          <span className={"overflow-text "+classes.cell_match}>{match}</span>
                        </div>
                        <div className={"flex-box "+classes.cell_gatewary}>
                          <span className={"overflow-text "+classes.cell_ip}>{url}</span>
                        </div>
                        <div className="flex-box">
                          <div className={"overflow-text "+classes.cell_version}>
                            {this.htmlVersion(v)}
                          </div>
                        </div>
                        <div className="flex-box">
                              <span className={"overflow-text flex-middle "+classes.cell_version}>
                                {this.htmlGroupStatus(v)}
                              </span>
                        </div>
                        <div className="flex-one" >
                          <div className={classes.cell_robot}>
                            <IconButton>
                              <img src={v.status>-1?ProjectsFlagSPng:ProjectsFlagPng} style={{width:'24px'}}/>
                            </IconButton>
                          </div>
                        </div>
                        <div className="flex-one" >
                          <Divider orientation="vertical" light={true} style={{float:'left'}}/>
                          <div className={classes.cell_action}>
                            <IconButton><MenuIcon className="icon"/></IconButton>
                          </div>
                        </div>
                      </CardContent>
                    </Paper>
                )
              })
            }
          </CardContent>
        </Paper>
        <CreateT ref="$create" onOk={()=>{History.push('/topology/buzzy-topo')}}/>
        <DrawerT onRef={(ref)=>{this.$drawerUser = ref;}} />
      </>
    )
  }
}

export default withStyles(styles)(Index);
