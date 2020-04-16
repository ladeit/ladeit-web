import React from 'react';
import {
    withStyles,Typography,Button,IconButton,Divider,
} from '@material-ui/core';
import Component from '@/Component.jsx'
import Icons from 'components/Icons/icons.jsx'
// template
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import SettingT from './component/setting.jsx'


const styles = theme => ({
});

@withStyles(styles)
class Index extends Component{

    componentWillMount(){
        this.initParams();
    }

    state = {}

    render(){
        const { classes } = this.props;
        const params = this.params;
        return (
            <Layout
                menuT={<MenuLayout type="setting" params={params} />}
                contentT={<SettingT />}
            />
        );
    }
}

export default Index;
