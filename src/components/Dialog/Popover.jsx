import React from 'react'
import { withStyles,Popover } from '@material-ui/core'

const styles = theme => ({
    root: {}
});

@withStyles(styles)
class Index extends React.PureComponent {

    componentDidMount(){
        const props = this.props;
        props.onRef && props.onRef(this);
        this.html = props.html || '';
    }

    state = {
        anchor:NULL,
        content:""
    }

    onOpen = (options,html)=>{
        _.extend(this.state,options);
        html && (this.html = html);
        this.forceUpdate();
    }

    onClose = () => {
        this.setState({anchor:NULL})
    }

    render() {
        const sc = this;
        const { anchor,content } = this.state;
        const {classes,...props} = this.props;
        let html = this.html;
        return (
            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={sc.onClose}
                //
                className={classes.popover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                {...props}
            >
                {html}
            </Popover>
        )
    }
}

export default Index;
