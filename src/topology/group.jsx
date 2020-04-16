import React from 'react';
import {
    withStyles,Typography,Paper,Button,IconButton,Divider,
} from '@material-ui/core';

import Layout from '@/layout1/dashboard.jsx'
import FlowT from './components/group_topo.jsx'


const styles = theme => ({
  contentBox:{
    padding:0
  }
});

@withStyles(styles)
class Index extends React.PureComponent{

  render(){
    const { classes } = this.props;
    //
    return (
        <Layout
          contentT={
            <div style={{height:"100%",backgroundColor:'white'}}>
              <FlowT
                nodes={[
                  {"key":"group", "text":"Buzzy-web", "isGroup":true},
                  {"key":"group2", "text":"Buzzy-api", "isGroup":true},
                  {"key":"server", "text":"Buzzy.xxx.com", "category":"server"},
                  {"key":"10", "group":"group", "category":"server"},
                  {"key":"11", "parent":"1", "name":"v3.1.1",size:0.9, "group":"group", "category":"pod"},
                  {"key":"12", "parent":"1", "name":"v3.1.1",size:0.3, "group":"group", "category":"pod"},
                  {"key":"20","group":"group2", "category":"server", "pos":"577 -86"},
                  {"key":"21", "parent":"1", "name":"v3.2.2",size:0.6, "group":"group2", "category":"pod"},
                  {"key":"22", "parent":"1", "name":"v3.2.2",size:0.7, "group":"group2", "category":"pod"}
                ]}
                links={[
                  {from: 'server',text:'/**', to: 'group',_type:""},
                  {from: 'server',text:'/api', to: 'group2',_type:""},
                  {from: '10', to: '11',_type:""},
                  {from: '10', to: '12',_type:""},
                  {from: '20', to: '21',_type:""},
                  {from: '20', to: '22',_type:""},
                ]}
              />
            </div>
          }
        />
    );
  }
}

export default Index;
