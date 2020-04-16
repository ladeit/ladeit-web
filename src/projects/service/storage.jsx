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
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
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
    this.$storage = {
      noChecked:true,
      dense:true,
      columns:[
        { id: 'name', disablePadding: true, label: '名称',style:{width:'180px'} },
        { id: '' }
      ],
      event:(name,data)=>{
      }
    }
  }

  componentDidMount(){

  }

  state = {
    dense:{storage:true},
    selects:[],
    serviceDense:false
  }

  tabChange = (one)=>{
    this.params._memo = one.key;
    this.renderRoute();
  }

  tableSelected(name,data){
    this.setState({selects:data})
    this.$edit.onOpen({open:data.length>0})
  }

  handleDense = (name) => {
    const sc = this;
    let dense = this.state.dense;
    return (event)=>{
      dense[name] = event.target.checked;
      sc.forceUpdate();
      sc.$table.onDense(event.target.checked);
    }
  }

  htmlStorage(){
    const { classes } = this.props;
    const { dense } = this.state;
    return (
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={0}>
          <TableT
              rows={[]}
              onRef={this.$storage}
          />
        </Grid>
      </Grid>
    )
  }

  render(){
    const sc = this;
    const { classes } = this.props;
    const params = this.params;
    const { selects } = this.state;
    //
    return (
        <>
        <Layout
            crumbList={[{text:params._group,url:`/group/${params._group}`},{text:params._name,url:`/summary/${params._group}/${params._name}/${params._memo}`},{text:'Storages'}]}
            menuT={<MenuLayout params={params} />}
            contentT={sc.htmlStorage()}
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
