import React from 'react';
import clsx from 'clsx';
import {
    ArrowForward as ArrowForwardIcon
} from '@material-ui/icons';
import {
    withStyles,Typography,Paper,IconButton,Divider,
    CardContent,List,ListItem,ListItemText,ListItemSecondaryAction
} from '@material-ui/core';

const styles = theme => ({
  root:{
    padding:"4px 0"
  },
  item:{
    borderLeft:'2px solid rgba(0,0,0,0)',
    '& li':{
      listStyle:'none'
    },
    '&.active':{
      color:'#3f51b5',
      borderLeftColor:'#3f51b5',
      '& .MuiListItemSecondaryAction-root':{
        display:'block'
      }
    }
  }
});

class Index extends React.PureComponent{
  componentWillMount(){
    this.handle = _.debounce(this.props.handle || function(){},100)
    this.active = this.props.active
  }

  clickItem(one){
    const sc = this;
    return ()=>{
      sc.active = one.key;
      sc.forceUpdate();
      sc.handle(one);
    }
  }

  htmlRow(data){
    const sc = this;
    const { classes } = this.props;
    //{clz ? <ListItemSecondaryAction ><ArrowForwardIcon /></ListItemSecondaryAction> : ''}
    return data.map((one,index)=>{
      let clz = one.key == sc.active ? 'active' : ''
      return (
          <ListItem button key={index} className={clsx(classes.item,one.className,clz)} onClick={sc.clickItem(one)} >
            <ListItemText primary={`${one.text}`} />
          </ListItem>
      )
    })
  }

  render(){
    const { classes,data,className } = this.props;
    return (
      <Paper className={clsx(classes.root,className)}>
        <List>
          {this.htmlRow(data)}
        </List>
      </Paper>
    );
  }
}

export default withStyles(styles)(Index);
