import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
    Typography,
    Button,
    useTheme,
    useMediaQuery
} from '@material-ui/core';
import Layout from '@/layout1/dashboard.jsx'
import Icons from 'components/Icons/icons.jsx'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
        paddingTop: '10vh',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center'
    },
    imageContainer: {
        marginTop: theme.spacing(6),
        display: 'flex',
        justifyContent: 'center'
    },
    image: {
        maxWidth: '100%',
        width: 560,
        maxHeight: 300,
        height: 'auto'
    },
    buttonContainer: {
        marginTop: theme.spacing(6),
        display: 'flex',
        justifyContent: 'center'
    }
}));

function Index() {
    const classes = useStyles();
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div className={classes.root}>
            <Typography
                align="center"
                variant={mobileDevice ? 'h4' : 'h1'}
            >
                - 503 -
            </Typography>
        </div>
    );
}

export default Index;
