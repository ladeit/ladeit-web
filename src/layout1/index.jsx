import React, { Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { LinearProgress } from '@material-ui/core';
import NavBar from './NavBar.jsx';
import TopBar from './TopBar.jsx';

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: '100vh',
        display: 'flex',
        '@media all and (-ms-high-contrast:none)': {
            height: 0 // IE11 fix
        }
    },
    content: {
        paddingTop: 64,
        flexGrow: 1,
        maxWidth: '100%',
        overflowX: 'hidden',
        [theme.breakpoints.up('lg')]: {
            paddingLeft: 256
        },
        [theme.breakpoints.down('xs')]: {
            paddingTop: 56
        }
    }
}));

function Dashboard(props) {
    const classes = useStyles();
    const [openNavBarMobile, setOpenNavBarMobile] = useState(false);
    const {  } = props;

    return (
        <>
            <TopBar onOpenNavBarMobile={() => setOpenNavBarMobile(true)} />
            <NavBar
                onMobileClose={() => setOpenNavBarMobile(false)}
                openMobile={openNavBarMobile}
            />
            <div className={classes.container}>
                <div className={classes.content}>
                    <Suspense fallback={<LinearProgress />}>

                    </Suspense>
                </div>
            </div>
        </>
    );
}

Dashboard.propTypes = {
};

export default Dashboard;
