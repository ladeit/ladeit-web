import React from 'react'
import {
    withStyles, Typography, Button, IconButton, Divider,TextField,
    Dialog, DialogTitle, DialogContent, DialogActions,Input 
} from '@material-ui/core';
import intl from 'react-intl-universal'
import TagsInput from "react-tagsinput";
import Service from '@/projects/Service.js'
class Index extends React.PureComponent {
    state = {
        title: "",
        open: false,
        params:{}
    }
    onOpen = (params, yaml) => {
        this.state.params.serviceId = params.id;
        const sc = this;
        sc.setState({ open: true })
    }

    onCancel = () => {
        this.setState({ open: false,params:{} })
    }
    setDate = (e,Proper)=>{
        let params = this.state.params;
        params[Proper] = e.target.value;
    }
    onOk = ()=>{
        let {version,image} = this.state.params;
        if(!(version&&image)){
            window.Store.notice.add({type:'warning',text:'请输入版本和镜像'})
            return
        }
        Service.createImage(this.state.params,(res)=>{
            window.Store.notice.add({text:'创建成功'})
            if(this.props.onOk){
                this.props.onOk()
            }
            this.onCancel()
        })
    }
    render() {
        const { classes, onOk, onOk_text } = this.props;
        const { open, title,   } = this.state;
        return (
            <Dialog open={Boolean(open)} onClose={this.onCancel} maxWidth='xs'>
                <DialogTitle>
                    <Typography >{intl.get('newCreate')}</Typography>
                </DialogTitle>
                <DialogContent>
                    <div style={{ width: '400px' }}>
                        <div style={{height:'60px'}}>
                            <TextField fullWidth label="版本" onChange={(e)=>{this.setDate(e,'version')}}/>
                        </div>
                        <div style={{height:'60px'}}>
                            <TextField fullWidth label="镜像" onChange={(e)=>{this.setDate(e,'image')}}/>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onCancel} color="primary">{intl.get('close')}</Button>
                    <Button onClick={this.onOk} color="primary" autoFocus>{onOk_text || intl.get('save')}</Button>
                </DialogActions>
            </Dialog>
        )
    }
}
export default Index;
