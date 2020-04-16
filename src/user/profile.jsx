import React from 'react';
import {
    withStyles,Typography,Button,IconButton,Divider,
} from '@material-ui/core';
import Icons from 'components/Icons/icons.jsx'
// template
import Layout from '@/layout1/dashboard.jsx'
import ProfileT from './component/userInfo.jsx'
import AuthFilter from '@/AuthFilter.jsx'


const styles = theme => ({
});

@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent{

    componentDidMount(){
        this.renderUser();
    }

    componentDidUpdate(){
        this.renderUser();
    }

    state = {}

    renderUser(){
        this.initParams();
        let username = this.params.username;
        this.refs.$profile.loadUser(username);
    }

    render(){
      const { classes } = this.props;
      return (
          <Layout
            contentT={<ProfileT ref="$profile"/>}
          />
      );
    }
}

export default Index;
