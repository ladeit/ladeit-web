import React from 'react';
import clsx from 'clsx';
import {
    Close as CloseIcon,
    Add as AddIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Button,IconButton,Divider,Paper,
    Dialog,DialogTitle,DialogContent,DialogActions,
    TextField,Popover
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import TagsInput from "react-tagsinput";
import RuleTagsT from '../components/pod_topo_tag'

const styles = theme => ({
    box:{
        width:'680px',
        "& label":{
            width:'66px',
            display:'inline-block'
        }
    }
})

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        this.onOk = this.props.onOk;
    }

    componentDidMount(){}

    state = {
        open:false,
        tags:[],
        popover:NULL,
        data:{_value:[]}
    }

    onOpen = ({data,...options})=>{
        options.open = true;
        _.extend(this.state,options);
        this.forceUpdate();
    }

    onCancel = ()=>{
        this.setState({open:false})
    }

    handleTags = (regularTags)=>{
        this.setState({tags:regularTags})
    }

    clickSave = ()=>{
        const sc = this;
        let { tags,data } = sc.state;
        sc.onOk({tags:tags,data:data})
    }

    render(){
        const { classes } = this.props;
        const { open,tags,data } = this.state;
        // <br/><br/><label>匹配规则：</label><RuleTagsT data={data}/>
        return (
            <Dialog open={Boolean(open)} onClose={()=>{this.onOk(false)}} >
                <DialogTitle >
                    <Typography variant="h5" component="div">解析地址</Typography>
                </DialogTitle>
                <DialogContent className={classes.box}>
                    <label>Host：</label>
                    <TagsInput
                        addOnBlur={true}
                        value={tags}
                        onChange={this.handleTags}
                        tagProps={{ className: "react-tagsinput-tag info" }}
                        inputProps={{placeholder:'输入地址'}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{this.onOk(false)}} color="primary">取消</Button>
                    <Button onClick={this.clickSave} color="primary" autoFocus>确认</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default Index;
