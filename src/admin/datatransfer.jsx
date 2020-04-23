import React from 'react';
import ReactDOM from 'react-dom';
import {
    withStyles, Paper, Input, Button, Checkbox, FormControlLabel
} from '@material-ui/core';
import clsx from "clsx";
// layout
import intl from 'react-intl-universal'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import ContentJsx from './components/datatransfer'

const style = theme => ({
})

@withStyles(style)
class Index extends React.PureComponent {
    state = {}

    componentDidMount(){}

    render(){
        const sc = this;
        const {classes} = this.props;
        return (
            <Layout
                menuT={<MenuLayout type="admin" params={{_menu:'datatransfer'}}/>}
                contentT={(
                    <ContentJsx />
                )}
            />
        )
    }
}

export default Index;