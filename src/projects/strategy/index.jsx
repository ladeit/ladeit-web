import React from 'react';
import clsx from 'clsx';
import {
    FilterList as FilterListIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@material-ui/icons';
import {
    withStyles,Typography,Paper,IconButton,Divider,
    Button,Grid,FormControlLabel,Switch,
    Toolbar,Tooltip,
} from '@material-ui/core';

import Component from '@/Component.jsx'
import Layout from '@/layout/Layout.jsx'
import HeaderT from '@/layout/HeaderIndex.jsx'
import GroupT from '@/projects/components/group.jsx'
import MenuT from '@/components/Menu/menu.jsx'
import TableT from '@/components/Table/table.jsx'

import Drawer from '@/components/Dialog/Drawer.jsx'

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
class Index extends Component{

  componentWillMount(){
    const proStore = Store.project;
    this.initParams();
    this.params._memo = proStore.item._tabValue;
    this.tab = proStore.headerTabList;
    this.subtab = Store.project.item._tab;
    this.subtabValue = this.params._memo;
    this.$table = {
      columns:[
        { id: 'name', disablePadding: true, label: '名称' },
        { id: 'route', numeric: 'right', disablePadding: false, label: '路由' },
        { id: 'deployment', numeric: 'right', disablePadding: false, label: '部署' },
        { id: 'carbs', numeric: 'right', disablePadding: false, label: '描述' },
        { id: 'use', numeric: 'right', disablePadding: false, label: '启用' , render:function(row){return row.use?'是':'否'}},
        { id: '' }
      ],
      event:(name,data)=>{
        switch (name){
          case 'selected':
            this.tableSelected(name,data)
        }
      }
    }
  }

  componentDidMount(){

  }

  state = {
    dense:false,
    selects:[]
  }

  tabChange = (one)=>{
    this.params._memo = one.key;
    this.renderRoute();
  }

  tableSelected(name,data){
    this.setState({selects:data})
    this.$edit.onOpen({open:data.length>0})
  }

  handleDense = event => {
    this.setState({dense:event.target.checked});
    this.$table.onDense(event.target.checked);
  }

  render(){
    const { classes } = this.props;
    const params = this.params;
    const { dense,selects } = this.state;
    return (
        <>
        <Layout
            headerT={<HeaderT title={params._name} tab={this.tab} tabValue="strategy" tabChange={this.projectsMenuChange}/>}
            contentT={
                <Grid container spacing={1}>
                    <Grid container item xs={12} spacing={0}>
                      <TableT
                        toolbar={
                          <Toolbar className={classes.toolbar}>
                              <Typography className="title" variant="h6">
                                  工作负载
                              </Typography>
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
                        rowsPerPage="8"
                        rows={[
                          {id:'1',name:"滚动升级",route:"https://xxxxx",deployment:"10%->v2",use:1},
                          {id:'2',name:"滚动升级2",route:"https://xxxxx",deployment:"10%->v2",use:1}
                        ]}
                        onRef={this.$table}
                      />
                    </Grid>
                </Grid>
              }
        />
        <Drawer
            html={
              <>
                <div className={clsx(classes.footer,"flex-center")}>
                  <div style={{position:"absolute",left:"16px",fontSize:"1.3rem"}}>{selects.length} Selected</div>
                  <Button
                    className="button"
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    className="button"
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </div>
              </>
            } onRef={(ref)=>{this.$edit = ref;ref.onOpen({isModal:false,isClose:false,anchor:'bottom'})}}/>
        </>
    );
  }
}

export default Index;

