import React from 'react';
import ReactDOM from 'react-dom';
import {
    withStyles,Typography,Button,
    Dialog,DialogTitle,DialogContent,DialogActions
} from '@material-ui/core';

import ColonyAddT from './colonyAdd.jsx'

const style = theme => ({
    content:{
        paddingBottom:'32px',
        '& .colonyAdd':{
            padding:0
        }
    }
})

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        //
    }

    componentDidMount(){
        //
    }

    state = {open:false}

    onCancel = ()=>{
        this.setState({open:false})
    }

    render = ()=>{
        const { classes,onOk } = this.props;
        const { open } = this.state;
        return (
            <Dialog
                open={Boolean(open)}
                onClose={this.onCancel}
            >
                <DialogContent className={classes.content} >
                    <ColonyAddT onOk={onOk} />
                </DialogContent>
            </Dialog>
        )
    }
}

export default Index;
