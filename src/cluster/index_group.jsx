import React from 'react';
import {
    withStyles,Typography,Button,IconButton,Divider,
} from '@material-ui/core';

import Icons from 'components/Icons/icons.jsx'
// template
import Layout from '@/layout1/dashboard.jsx'
import InfoT from './info_group.jsx'

class Index extends React.PureComponent{

  state = {
  }

  render(){
    const { classes } = this.props;

    return (
        <div style={{backgroundColor:'#fbfcfe'}}>
          <Layout
            contentT={<InfoT />}
          />
        </div>
    );
  }
}

export default Index;
