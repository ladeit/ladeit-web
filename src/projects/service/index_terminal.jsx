import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import {
    withStyles,Drawer
} from '@material-ui/core'

import Terminal from '../../cluster/component/terminal.jsx'

const styles = theme => ({
    root: {

    }
});


@withStyles(styles)
class Index extends React.PureComponent {// TODO 重新包装
    componentWillMount(){}

    componentDidMount(){}

    state = {
        anchor:'bottom',
        open:false,
        data:{},
    }

    onOpen(options){
        _.extend(this.state,options);
        this.forceUpdate();
    }

    onCancel = ()=>{
        this.setState({open:false})
    }

    render(){
        let { classes,...other } = this.props;
        let { anchor,open,data } = this.state;
        return (
            <Drawer
                className={clsx('Drawer',classes.root,'drawer_edit')}
                elevation={15}
                anchor={anchor}
                open={open}
                onClose={this.onCancel}
                ModalProps={{hideBackdrop:true,disableScrollLock:true}}
                {...other}
            >
                <Terminal onClose={this.onCancel} data={data} />
            </Drawer>
        )
    }
}

export default Index;
