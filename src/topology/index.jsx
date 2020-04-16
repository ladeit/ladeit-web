import React from 'react';
import {
    withStyles,Typography,Paper,Button,IconButton,Divider,
} from '@material-ui/core';

import Layout from '@/layout1/dashboard.jsx'
import FlowT from './components/pod_topo.jsx'
import DrawerT from '@/components/Dialog/Drawer.jsx'
import DeploymentT from './deployment.jsx'

import Component from '../Component.jsx'
import ProjectsService from '../projects/Service'

const styles = theme => ({
  content:{
    padding:0
  },
  headerArea:{
    padding:'8px 0px',
    display:'inline-block',
    position:'absolute',
    left:'16px',
    zIndex:9
  },
  button:{
    boxShadow:'0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20)',
    marginRight:'16px'
  }
});

@withStyles(styles,{ withTheme: true })
class Index extends Component{
  componentWillMount(){
    this.initParams();
    this.loadService();
  }

  loadService(){
    const sc = this;
    const params = this.params;
    ProjectsService.serviceMap({ServiceGroup:params._group,ServiceName:params._name},function(res){
      let first = _.extend({},res,{status:-1})
      let noFirst = _.extend({},res,{status:1})
      sc.setState({data:first,data2:noFirst,data_load:true})
    })
  }

  state = {
    data_load:false,
    data:{
      "id":"3e072cf7-a6ff-4aaa-ac4a-d97ddc8a7395"
    },
    data2:{
      "id":"3e072cf7-a6ff-4aaa-ac4a-d97ddc8a7395"
    }
  }

  clickCreate = (item) =>{
    //History.push('/topology/deployment')
    this.refs.$create.onOpen({open:true,anchor:'bottom'}, <DeploymentT serviceData={item} handleClose={this.clickCreateClose} />)
  }

  clickCreateClose = (flag)=>{
    if(flag){
      //History.push(`/topology/${data.name}/${item.name}`)
      this.refs.$create.onOpen({open:false});
    }else{
      this.refs.$create.onOpen({open:false});
    }
  }

  render(){
    const { classes } = this.props;
    const { data2,data } = this.state;
    //<Button variant="contained" color="default" className={classes.button}>添加绿色版本</Button>
    //<Button variant="contained" color="default" className={classes.button}>添加金丝雀版本</Button>
    //<Button variant="contained" color="default" className={classes.button}>添加ABTEST版本</Button>
    //<Typography variant="h1" component="b" >xxx</Typography>
    return (
        <>
          <Layout
              contentT={
                <div style={{height:"100%",backgroundColor:'white'}}>
                    <div className={classes.headerArea}>
                      <Button variant="contained" color="default" className={classes.button} onClick={()=>{this.clickCreate(data)}}>新建</Button>
                      <Button variant="contained" color="default" className={classes.button} onClick={()=>{this.clickCreate(data2)}}>新建(非首次)</Button>
                      <Button variant="contained" color="default" className={classes.button}>查看记录</Button>
                    </div>
                    <FlowT
                      nodes={[
                          {"key":"1", "name":"Don Meow", "text":"/**", "source":"cat1.png", "category":"server", "pos":"0 120", "selected":0},
                          {"key":"2", "text":"Buzzy-web-pod1", "source":"cat2.png", "category":"pod", "pos":"200 0", "selected":0},
                          {"key":"3", "text":"Buzzy-web-pod2", "source":"cat3.png", "category":"pod", "pos":"200 120", "selected":0},
                          {"key":"4", "text":"Buzzy-web-pod3", "source":"cat3.png", "category":"pod", "pos":"200 240", "selected":0}
                      ]}
                       links={[
                          {"from":"1", "to":"2", "text":"default", "name":"dot"},
                          {"from":'1', "to":'3', "text":"/k8s", "name":"dot"},
                          {"from":'1', "to":'4', "text":"/k8s", "name":"dot"}
                      ]}
                    />
                </div>
              }
              />
              <DrawerT ref="$create" ModalProps={{className:'timeline_box',style:{height:"100%"}}}/>
          </>
    );
  }
}

export default Index;
