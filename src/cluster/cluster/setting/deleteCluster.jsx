import React from 'react';
import {
    withStyles,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Checkbox
} from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import intl from 'react-intl-universal'

const style = theme => ({
    root:{
        '& .item':{
            padding:'8px',
            '& .text':{
                maxWidth:'180px'
            }
        }
    },
    close:{
        position:'absolute',
        right:'16px',
        top:'12px'
    }
})

@withStyles(style)
class Index extends React.Component {

    state = {
        open: false,
        isModal:false,
        disabled:true,
        checkAll:false,
        text:intl.get('delete'),
        title:intl.get('tips'),
        message:"",
        validList:[]
    }

    onClose = () => {
        this.setState({open:false})
    }

    confirmText = (e)=>{
        this.state.disabled = this.state.text != e.target.value;
        this.forceUpdate();
    }

    checkAll = (event)=>{
        this.setState({checkAll:event.target.checked});
    }

    clickSave(){
        const sc = this;
        return ()=>{
            let onOk = sc.state.onOk;
            onOk();
        }
    }

    clickToService(url){
        return ()=>{
            History.push(url)
        }
    }

    render() {
        const sc = this;
        const {classes} = this.props;
        const onCancel = sc.state.isModal ? false : this.onClose;
        //
        return (
            <Dialog
                className={classes.root}
                open={!!sc.state.open}
                onClose={onCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                { sc.state.validList.length ? validText.call(sc) : confirmText.call(sc) }
            </Dialog>
        )
    }
}

export default Index;

function validText(){
    const sc = this;
    const {classes} = this.props;
    const { validList } = sc.state;
    const onCancel = sc.state.isModal ? false : this.onClose;
    return (
        <React.Fragment>
            <DialogTitle>
                <Typography className="flex-middle" variant="h5"><ErrorIcon style={{color:'red'}}/>&nbsp;&nbsp;{intl.get('cluster.tipsDelClusterMemo')}</Typography>
                <IconButton size="small" className={classes.close} onClick={onCancel}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                <div style={{width:'580px',margin:'0 auto 24px'}}>
                    {
                        validList.map(function (v) {
                            return (
                                <div className="item">
                                    <span className="link2 text overflow-text" onClick={sc.clickToService(`/setting/${v.serviceGroupName}/${v.name}/common`)}>{v.serviceGroupName} / {v.name}</span> <Icons.TargetLinkIcon />
                                </div>
                            )
                        })
                    }
                </div>
            </DialogContent>
        </React.Fragment>
    )
}

function confirmText(){
    const sc = this;
    const onCancel = sc.state.isModal ? false : this.onClose;
    return (
        <React.Fragment>
            <DialogTitle>
                <Typography ><Typography component="b" variant="h3" >{sc.state.title}</Typography></Typography>
            </DialogTitle>
            <DialogContent  style={{width:'680px',margin:'0 auto'}}>
                <div>
                    <div style={{padding:'16px 0'}}>
                        <Typography variant="h5">{intl.get('confirmTextPre')} <b className="danger">{sc.state.text}</b> {intl.get('confirmTextFix')}</Typography>
                    </div>
                    <Inputs.AutoInput onChange={sc.confirmText}/>
                </div>
            </DialogContent>
            <DialogActions style={{padding:'16px 24px'}} >
                <Button variant="outlined" onClick={onCancel} color="primary">{intl.get('cancel')}</Button>
                <Button className="danger_button" variant="contained" disabled={sc.state.disabled} onClick={sc.clickSave()} >{intl.get('confirm')}</Button>
            </DialogActions>
        </React.Fragment>
    )
}