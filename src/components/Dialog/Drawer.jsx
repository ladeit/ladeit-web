import React from 'react'
import clsx from 'clsx'
import {
    withStyles,Drawer
} from '@material-ui/core'

const styles = theme => ({
    root: {}
});

class Index extends React.PureComponent {
    componentDidMount(){
        let props = this.props;
        // TODO 都是向下单项已经木有用了。都改为ref=""吧
        props.onRef && props.onRef(this);
        this.html = props.html || ''

    }

    state = {
        isModal:true,
        isClose:true,
        anchor:'right',
        open:false
    }

    onOpen(options,html){
        _.extend(this.state,options);
        html && (this.html = html);
        this.forceUpdate();
    }

    render = () => {//
        const {classes,className,ModalProps,...other} = this.props;
        const { anchor,open,isModal,isClose } = this.state;
        let modalProps = _.extend({
            disablePortal:!isModal,
            hideBackdrop:!isModal,
            disableScrollLock:!isModal
        },ModalProps);
        let modalClassName = isModal ? '' : 'drawer_edit'
        let html = this.html;
        //
        return (
            <Drawer
                className={clsx('Drawer',classes.root,className,modalClassName)}
                ModalProps={modalProps}
                elevation={15}
                anchor={anchor}
                open={open}
                onClose={(e)=>{!isClose || this.setState({open:false})}}
                {...other}
            >
                {html}
            </Drawer>
        )
    }
}

export default withStyles(styles)(Index);
