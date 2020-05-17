import React from 'react';
import clsx from "clsx";
import { makeStyles } from '@material-ui/styles';
import {
    Typography,
    Button,
    useTheme,
    useMediaQuery
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import {Link as RouterLink} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "100%",
        position: "fixed",
        backgroundColor:'rgba(62, 135, 251,.8)',

        "& p::selection":{
            background: "#fff"
        },

        "&>.content":{
            width: '450px',
            margin: '68px',
            marginTop:'-80px'
        },
        "& p":{
            color:'white'
        },
        '& .divider':{
            width: "180px",
            margin: "32px 0",
            backgroundColor:'rgba(255, 255, 255, .4)'
        },
        '& .title':{
            fontSize:'2.4rem',
            fontWeight: 600,
            color:'#2a5088',
            textShadow:'0 0 1px rgb(79, 146, 255)',
        },
        '& .subtitle':{
            lineHeight:'2rem',
            fontWeight: 500,
            fontSize:'1.4rem',
            textShadow:'0 0 1px rgb(255, 255, 255)',
        },
        '& .memo':{
            fontSize:'1rem'
        },
        '& .button':{
            padding:'8px 24px',
            color:'#fff',
            boxShadow:'0 0 1px rgb(255, 255, 255)',
            border:'1px solid rgba(255, 255, 255, 0.5)',
            borderRadius:'24px',
        }
    }
}));

function Resource401() {
    const classes = useStyles();
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div className={clsx(classes.root,"flex-middle")}>
            <div className="content">
                <div className="title">404 - Permission denied</div>
                <p className="subtitle" >Permission denied.</p>
                <Divider className="divider" />
                <p className="memo">We've notified our team of highly-trained monkeys (i.e:engineers) to solve the problem . </p>
                <p>&nbsp;</p>
                <Button
                    className="button"
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

export default Resource401;

