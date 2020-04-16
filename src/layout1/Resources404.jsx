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
    },
    text:{
        margin:'8px 0'
    }
}));

function Error404() {
    const classes = useStyles();
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div className={classes.root}>
            <Typography
                align="center"
                variant={mobileDevice ? 'h4' : 'h1'}
            >
                Resource not found.
            </Typography>
            <Typography
                align="center"
                variant="subtitle2"
            >
                We couldn't find the resource.
            </Typography>
            <div className={classes.imageContainer}>
                <Icons.Resources404Icon width="300px" />
            </div>
            <div className={classes.buttonContainer}>
                <Button
                    color="primary"
                    component={RouterLink}
                    to="/"
                    variant="outlined"
                >
                    Back to homepage
                </Button>
            </div>
        </div>
    );
}

export default Error404;
