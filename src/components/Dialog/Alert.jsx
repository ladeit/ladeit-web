import React from 'react';
import clsx from 'clsx'
import {
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core'
import intl from 'react-intl-universal'

class AlertTemp extends React.Component {

    state = {
        open: false,
        isModal:false,
        title:intl.get('tips'),
        message:"",
        //
        DialogContent:void 0,
        onClose:void 0,
        onOk:void 0,
        onOk_style:{}
    }

    onOpen = (opt)=>{
        const sc = this;
        _.extend(sc.state,opt)
        sc.forceUpdate();
    }

    onClose = () => {
        this.setState({open:false})
    }

    clickOk = ()=>{
        let okFunc = this.state.onOk;
        let okBack = this.props.onOk;
        return ()=>{
            console.log('1');
            let fn =  okFunc || okBack;
            fn();
        }
    }

    render() {
        const sc = this;
        const st = this.state;
        const { className } = this.props;
        const onCancel = st.isModal ? false : this.onClose;
        //
        if(st.DialogContent){
            var content = typeof st.DialogContent == "function" ? st.DialogContent() : st.DialogContent;
            return (
                <Dialog
                    className={clsx("common_alert",className)}
                    open={!!st.open}
                    onClose={onCancel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {content}
                </Dialog>
            )
        }else{
            return (
                <Dialog
                    className="common_alert"
                    open={Boolean(st.open)}
                    onClose={onCancel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>
                        <Typography >{st.title}</Typography>
                    </DialogTitle>
                    <DialogContent>
                        {st.message}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onCancel} color="primary">{intl.get('cancel')}</Button>
                        <Button onClick={sc.clickOk()} color="primary" autoFocus>{intl.get('confirm')}</Button>
                    </DialogActions>
                </Dialog>
            )
        }
    }
}

export default AlertTemp;
