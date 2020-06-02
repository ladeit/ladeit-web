/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
    Typography,
    AppBar,
    Badge,
    Button,
    IconButton,
    Grid,
    Toolbar,
    Tooltip,
    Avatar,
    Hidden,
    Input,
    colors,
    Popper,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ClickAwayListener
} from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import LockIcon from '@material-ui/icons/LockOutlined';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import PeopleIcon from '@material-ui/icons/PeopleOutline';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import Icons from 'components/Icons/icons.jsx'
import ProgressT from './robot/progress.jsx'
import RobotT from './robot/index.tsx'
import CustomDropdown from '@/components/CustomDropdown/CustomDropdown.jsx';
import LanCom from '@/locales/about.jsx';
import intl from 'react-intl-universal'
import md5 from 'md5'
const useStyles = makeStyles((theme) => ({
    root: {
        '& .menu_button':{
            marginLeft:'16px',
            color:'white',
            '&.active':{
                backgroundColor: 'white',
                color: '#444'
            }
        }
    },
    logo:{
        color:'white'
    },
    adminButton:{
        color:'white',
        marginLeft:'16px',
        '& svg':{
            fontSize:'16px'
        }
    },
    adminButtonActive:{
        background: 'white',
        color: '#3f51b5',
        '&:hover':{
            background:'white'
        }
    }
}));


function htmlMenus(){
    const classes = useStyles();
    const menus = [
        {text:intl.get('services.services'),url:'/services'},
        {text:intl.get('cluster.cluster'),url:'/cluster'},
        // {text:'服务-拓扑',url:'/topology/buzzy/buzzy-web'},
    ];
    let path = window.location.pathname;
    let arr = menus.map((one,index)=>{
        let active = path.indexOf(one.url)==0;
        //active && adminArea(false)
        return (
            <RouterLink to={one.url} className="link2" key={index} ><Button size="medium" className={`menu_button ${active && 'active'}`} >{one.text}</Button></RouterLink>
        )
    })
    //
    let user = _.local("user");
    if(user.username=="admin"){
        let active = path.indexOf('/admin')==0;
        //active && adminArea(true);
        arr.push(<RouterLink to="/admin/services" ><IconButton className={clsx(classes.adminButton,!active||classes.adminButtonActive)} ><BuildIcon /></IconButton></RouterLink>)
    }
    return arr;
}

function clickMenu(param){
    if('LogOut' == param){
        window.Store.global.setUser('')
        window.History.push('/login')
    }else if('Profile' == param){
        const user = _.local("user");
        window.History.push(`/profile/${user.username}`)
    }else if('Setting' == param){
        window.History.push('/setting/profile')
    }
}

function adminArea(isAdmin){
    let user = _.local("user");
    if(typeof isAdmin == 'undefined'){
        isAdmin = isAdmin;
    }else{
        user.admin = isAdmin;
        _.local('user',user);
    }
    return isAdmin;
}

function TopBar({
    onOpenNavBarMobile,
    className,
    ...rest
    }) {

    const classes = useStyles();
    const user = _.local("user");
    const myAvatar = md5((user.email||'').toLowerCase().trim())
    return (
        <AppBar
            {...rest}
            className={clsx(classes.root, className)}
            color="primary"
        >
            <Toolbar>
                <Grid container spacing={1} alignItems="center">
                    <Grid item >
                        <RouterLink to="/">
                            <Typography className={classes.logo}>
                                <img width="36px" src="/logo/vector/isolated-monochrome-white.svg" />
                            </Typography>
                        </RouterLink>
                    </Grid>
                    <Grid item xs >
                        {htmlMenus()}
                    </Grid>
                    <Grid item>
                        <ProgressT />
                    </Grid>
                    <Grid item style={{display:'none'}}>
                        <LanCom className="index" callback={(lan)=>{_.href(lan)}}/>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Robot">
                            <RobotT />
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <CustomDropdown
                            size="small"
                            buttonIcon={(
                              <Avatar
                                  className={classes.avatar}
                                  src={"https://www.gravatar.com/avatar/"+myAvatar+"?d=retro"}
                                  alt="My Avatar"
                              />
                          )}
                            placement="bottom-end"
                            buttonProps={{
                                style:{
                                    padding: 0,
                                    background: 'none',
                                    boxShadow: 'none'
                                }
                            }}
                            dropdownHeader={
                                <Typography variant="body1" component="b" style={{padding:"0 8px",color:'black',minWidth:'80px',display:'inline-block'}}>{user.username}</Typography>
                            }
                            dropdownList={[
                                {divider: true},
                                "Profile",
                                "Setting",
                                "Language",
                                {divider: true},
                                "LogOut"
                            ]}
                            onClick={(param)=>{clickMenu(param)}}
                        />
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

TopBar.propTypes = {
    className: PropTypes.string,
    onOpenNavBarMobile: PropTypes.func
};

export default TopBar;
