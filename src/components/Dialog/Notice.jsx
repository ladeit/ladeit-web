import React from 'react'
import PropTypes from 'prop-types';
import {observer,inject} from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';
import {
    withStyles,
    Typography,
    Snackbar,
    SnackbarContent,
    IconButton,
    Button
} from '@material-ui/core'
import intl from 'react-intl-universal'

import {
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Close as CloseIcon
} from '@material-ui/icons'

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const useStyles = makeStyles(theme => ({
    root:{
        position:'relative',
        paddingRight:'32px'
    },
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    messageButton:{
        position:'absolute',
        right: '8px',
        top: '10px'
    }
}))

const useStyles1 = makeStyles(theme => ({
    success: {
        color: green[600],
        backgroundColor:"#dfedde",
        boxShadow:"none",
        borderBottom:"1px solid rgb(202, 202, 202,.1)"
    },
    error: {
        color: theme.palette.error.dark,
        backgroundColor:"#ffe4e3",
        boxShadow:"none",
        borderBottom:"1px solid rgb(202, 202, 202,.1)"
    },
    info: {
        color: theme.palette.primary.main,
        backgroundColor:"#dceeff",
        boxShadow:"none",
        borderBottom:"1px solid rgb(202, 202, 202,.1)"
    },
    warning: {
        color: amber[700],
        backgroundColor:"#fff5e7",
        boxShadow:"none",
        borderBottom:"1px solid rgb(202, 202, 202,.1)"
    },
    icon: {
        fontSize: 20,
    },
    text:{
        marginRight:"24px"
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    }
}));

function MySnackbarContentWrapper(props) {
    const classes = useStyles();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            size="small"
            className={`${classes[variant]} ${classes.root}`}
            aria-describedby="client-snackbar"
            message={
                <>
                    <div className={classes.message}>
                      <Icon className={`label-text-span ${classes.icon} ${classes.iconVariant}`} />
                      <span className={`label-text-span ${classes.text}`}>{message}</span>
                    </div>
                    <IconButton size="small" className={classes.messageButton} key="close" aria-label="Close" color="inherit" onClick={onClose}>
                      <CloseIcon className={classes.icon} />
                    </IconButton>
                </>
            }
            action={[]}
            {...other}
        />
    );
}

MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};




@inject('store')
@observer
class Index extends React.PureComponent {

    clickMore(item){
        const sc = this;
        return ()=>{
            item._more = true;
            sc.forceUpdate();
        }
    }

    htmlNotice(){
        const sc = this;
        const {store} = this.props;
        const notice = store.notice;
        //
        return notice.data.map((v,i)=>{
            sc.autoClose(v);
            let text = v.text;
            if(v.more){
                text = (
                    <div>
                        {v.text}
                        {
                            !v._more
                                ? ( <Button size="small" className="more" onClick={sc.clickMore(v)}>{intl.get('detail')}</Button> )
                                : ( <Typography component="pre" className="more_text">{v.more}</Typography> )
                        }
                    </div>
                )
            }
            return (
                <MySnackbarContentWrapper
                    key={v.udid}
                    id={"notice-"+v.udid}
                    onClose={()=>{notice.close(v)}}
                    variant={v.type || "success"}
                    message={text}
                />
            )
        })
    }

    autoClose(item){
        const {classes,store} = this.props;
        setTimeout(function(){
            store.notice.close(item);
        },item.time||2500)
    }

    render() {
        const {classes,store} = this.props;
        const notice = store.notice;

        return (
            <div id="notice_box">
                <div className="flex-center" style={{padding:'8px 0'}}>
                    {this.htmlNotice()}
                </div>
            </div>
        )
    }
}

export default Index;
