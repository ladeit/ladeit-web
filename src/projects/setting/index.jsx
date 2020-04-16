import React from 'react';
import {
    withStyles,Typography,Paper,IconButton,Divider,
} from '@material-ui/core';

import Component from '@/Component.jsx'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import MenuT from '@/components/Menu/menu.jsx'
import CommonT from './common'
import menu from "../../components/Menu/menu";
import AuthFilter from '@/AuthFilter'

const styles = theme => ({
  menu:{
    width:"200px"
  }
});
const menuData = [// 锚点 - 指向各个界面
    {key: 'common', text: '通用'},
    {key: 'group', text: '组'},
    {key: 'auth', text: '授权'},
    {key: 'notice', text: '通知'},
    {key: 'warnning', text: '报警'},
    {key: 'env', text: '集群环境'},
]

@withStyles(styles)
@AuthFilter
class Index extends Component{

  componentWillMount(){
    this.initParams();
    this.menuActive = this.params._memo || 'common';
    this.tab = Store.project.headerTabList;
  }

  menuChange = (e,val)=>{
    let url = this.props.match.path;
    url = url.replace(/\/setting\//,`/${val}/`);
    this.renderRoute(url);
  }

  render(){
    const { classes } = this.props;
    const menuActive = this.menuActive;
    const params = this.params;
    // <div className="flex-one"><MenuT data={menuData} active={menuActive} className={classes.menu}/></div>
    return (
        <Layout
          crumbList={[{text:params._group,url:`/group/${params._group}`},{text:params._name,url:`/summary/${params._group}/${params._name}/${params._memo}`},{text:'Settings'}]}
          menuT={<MenuLayout params={params} />}
          contentT={
            <div className="flex-r">
                <div className="flex-box">
                    { menuActive == "common" && <CommonT params={params}/>}
                </div>
            </div>
          }
        />
    );
  }
}

export default Index;
