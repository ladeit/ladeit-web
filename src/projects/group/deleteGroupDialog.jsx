import React from 'react';
import {
    withStyles,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Checkbox
} from '@material-ui/core'

import Inputs from 'components/Form/inputs.jsx'
import intl from 'react-intl-universal'

const style = theme => ({
    okButton:{

    }
})

@withStyles()
class Index extends React.Component {

    state = {
        open: false,
        isModal:false,
        disabled:true,
        checkAll:false,
        text:intl.get('delete'),
        title:intl.get('tips'),
        message:""
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

    render() {
        const sc = this;
        const st = this.state;
        const {classes,onOk} = this.props;
        const onCancel = st.isModal ? false : this.onClose;
        //
        return (
            <Dialog
                className={classes.root}
                open={!!st.open}
                onClose={onCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                style={{margin:'0 auto'}}
            >
                <DialogTitle>
                    <Typography ><Typography component="b" variant="h3" >{st.title}</Typography></Typography>
                </DialogTitle>
                <DialogContent>
                    <div>
                        <div style={{width:'600px',padding:'16px 0'}}>
                            <FormControlLabel
                                checked={st.checkAll}
                                onChange={this.checkAll}
                                control={<Checkbox color="primary" />}
                                label={intl.get('group.deleteDialog.memo')}
                                labelPlacement={intl.get('group.deleteDialog.memo')}
                            />
                            <Typography variant="h5">{intl.get('confirmTextPre')} <b className="danger">{st.text}</b> {intl.get('confirmTextFix')}</Typography>
                        </div>
                        <Inputs.AutoInput onChange={sc.confirmText}/>
                    </div>
                </DialogContent>
                <DialogActions style={{padding:'16px 24px'}} >
                    <Button variant="outlined" onClick={onCancel} color="primary">{intl.get('cancel')}</Button>
                    <Button className="danger_button" variant="contained" disabled={st.disabled} onClick={onOk} >{intl.get('confirm')}</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default Index;
