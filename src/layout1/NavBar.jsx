/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from 'react';
import { useLocation, matchPath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Drawer,
    Divider,
    Avatar,
    List,
    ListSubheader,
    Typography,
    Hidden,
    IconButton,
    Badge,
    Link,
    colors
} from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import NavItem from 'components/Menu/NavItem.jsx';
import navConfig from './navConfig.jsx';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    mobileDrawer: {
        width: 180,
    },
    desktopDrawer: {
        width: 180,
        top: 64,
        height: 'calc(100% - 64px)'
    },
    navigation: {
        overflow: 'auto',
        padding: theme.spacing(0, 2, 2, 2),
        flexGrow: 1,
        '& .MuiButton-label':{
            fontWeight:400
        }
    },
    profile: {
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    },
    badge: {
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
    },
    badgeDot: {
        height: 9,
        minWidth: 9
    },
    onlineBadge: {
        backgroundColor: colors.green[600]
    },
    awayBadge: {
        backgroundColor: colors.orange[600]
    },
    busyBadge: {
        backgroundColor: colors.red[600]
    },
    offlineBadge: {
        backgroundColor: colors.grey[300]
    },
    avatar: {
        cursor: 'pointer',
        width: 40,
        height: 40
    },
    details: {
        marginLeft: theme.spacing(2)
    },
    moreButton: {
        marginLeft: 'auto',
        color: colors.blueGrey[200]
    }
}));

function renderNavItems({
    // eslint-disable-next-line react/prop-types
    items, subheader, key, ...rest
    }) {
    return (
        <List key={key}>
            {subheader && <ListSubheader disableSticky>{subheader}</ListSubheader>}
            {/* eslint-disable-next-line react/prop-types */}
            {items.reduce(
                // eslint-disable-next-line no-use-before-define
                (acc, item) => reduceChildRoutes({ acc, item, ...rest }),
                []
            )}
        </List>
    );
}

function reduceChildRoutes({
    acc, pathname, item, depth = 0
    }) {
    if (item.items) {
        const open = matchPath(pathname, {
            path: item.href,
            exact: false
        });

        acc.push(
            <NavItem
                depth={depth}
                icon={item.icon}
                key={item.href}
                label={item.label}
                open={Boolean(open)}
                title={item.title}
            >
                {renderNavItems({
                    depth: depth + 1,
                    pathname,
                    items: item.items
                })}
            </NavItem>
        );
    } else {
        acc.push(
            <NavItem
                depth={depth}
                href={item.href}
                icon={item.icon}
                key={item.href}
                label={item.label}
                title={item.title}
            />
        );
    }

    return acc;
}

function NavBar({openMobile,onMobileClose,className,type,params,footer,...rest}) {
    const classes = useStyles();
    const location = useLocation();
    const [status, setStatus] = useState('online');
    let menuList = navConfig(params,type);

    const handleStatusToggle = () => {
        const statusSeq = {
            online: 'away',
            away: 'busy',
            busy: 'offline',
            offline: 'online'
        };

        setStatus((prevStatus) => statusSeq[prevStatus]);
    };

    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose();
        }

        // eslint-disable-next-line
    }, [location.pathname]);

    const content = (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <nav className={classes.navigation}>
                {menuList.map((list) => renderNavItems({
                    items: list.items,
                    subheader: list.subheader,
                    pathname: location.pathname,
                    key: list.subheader
                }))}
            </nav>
            {footer}
        </div>
    );

    return (
        <Drawer
            anchor="left"
            classes={{
                paper: classes.desktopDrawer
            }}
            open
            variant="persistent"
        >
            {content}
        </Drawer>
    );
}

NavBar.propTypes = {
    className: PropTypes.string,
    onMobileClose: PropTypes.func,
    openMobile: PropTypes.bool
};

export default NavBar;
