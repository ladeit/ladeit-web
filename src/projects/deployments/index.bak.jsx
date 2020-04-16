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
import Layout from '@/layout/Layout.jsx'
import HeaderT from '@/layout/Header.jsx'
import GroupT from '@/projects/components/group.jsx'
import MenuT from '@/components/Menu/menu.jsx'
import TableT from '@/components/Table/table.jsx'

import Drawer from '@/components/Dialog/Drawer.jsx'

const styles = theme => ({
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

@withStyles(styles)
class Index extends Component{

  componentWillMount(){
    const clickVertion = this.handleVersion;
    this.initParams();
    this.tab = Store.project.headerTabList;
    this.$table = {
      noChecked:true,
      columns:[
        { id: 'name', disablePadding: true, label: '版本', render:function(row){
          return (<a className="link2" onClick={clickVertion} >{row.name}</a>)
        }},
        { id: 'type', disablePadding: true, label: '策略' },
        { id: 'createBy', disablePadding: true, label: '操作人' },
        { id: 'memo', disablePadding: true, label: '时间' },
        { id: 'action1', numeric: 'right', disablePadding: false, label: '操作', render:function(row){
          let buttons = []
          if(row.button==2){
            buttons.push(<Button size="small" variant="outlined" color="primary" >重新部署</Button>)
          }else if(row.button==1){
            buttons.push(<Button size="small" variant="outlined" color="primary" >回滚</Button>)
          }else{
            buttons.push(<Button size="small" variant="outlined" color="primary" disabled>回滚</Button>)
          }
          return buttons;
        }},
      ],
      event:function(){
        //
      }
    }
  }

  state = {
    dense:false
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
    const { dense } = this.state;
    const params = this.params;
    window.sc = this;
    return (
      <>
        <Layout
            headerT={<HeaderT title={params._name} tab={this.tab} tabValue="deployments" tabChange={this.projectsMenuChange}/>}
            contentT={
              <>
                  <TableT
                    toolbar={
                      <Toolbar className={classes.toolbar}>
                          <Typography className="title" variant="h6" >Deployments</Typography>
                          <div className="flex-right">
                            <Tooltip title="Dense">
                              <FormControlLabel control={<Switch color="primary" checked={dense} onChange={this.handleDense} />} />
                            </Tooltip>
                            <Tooltip title="Filter list">
                                <IconButton aria-label="filter list">
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                          </div>
                      </Toolbar>
                    }
                    rows={[
                      {name:'V 3.0.1',id:"xxx2",type:"xxx",createBy:"Admin",memo:"2019.10.12",button:2},
                      {name:'V 3.0.1',id:"xxx1",type:"xxx",createBy:"Admin",memo:"2019.10.12",button:1},
                      {name:'V 3.0.1',id:"xxx1",type:"xxx",createBy:"Admin",memo:"2019.10.12",button:0},
                      {name:'V 3.0.1',id:"xxx1",type:"xxx",createBy:"Admin",memo:"2019.10.12",button:1}
                    ]}
                    onRef={this.$table}
                />
              </>
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
