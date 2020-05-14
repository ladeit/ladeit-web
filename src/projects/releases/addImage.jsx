import React from 'react'
import {
    withStyles, Typography, Button, IconButton, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@material-ui/core';
import intl from 'react-intl-universal'
import TagsInput from "react-tagsinput";
class Index extends React.PureComponent {
    state = {
        title: "",
        open: false,
        tags: [],
        images:[]
    }
    onOpen = (params, yaml) => {
        const sc = this;
        sc.setState({ open: true })
        setTimeout(function () {
            // sc.bindMove();
        }, 120)
    }

    onCancel = (params) => {
        this.setState({ open: false })
    }
    handleTags = (regularTags) => {
        this.setState({ tags: regularTags })
    }
    handleImages = (regularTags) => {
        this.setState({ images: regularTags })
    }
    render() {
        const { classes, onOk, onOk_text } = this.props;
        const { open, title, tags,images  } = this.state;
        return (
            <Dialog open={Boolean(open)} onClose={this.onCancel} >
                <DialogTitle>
                    <Typography >{intl.get('newCreate')}</Typography>
                </DialogTitle>
                <DialogContent>
                    <div style={{ width: '500px' }}>
                        <div>
                            <label>版本：</label>
                            <TagsInput
                                addOnBlur={true}
                                value={tags}
                                onChange={this.handleTags}
                                tagProps={{ className: "react-tagsinput-tag info" }}
                                inputProps={{ placeholder: '输入版本' }}
                            />
                        </div>
                        <div>
                            <label>镜像：</label>
                            <TagsInput
                                addOnBlur={true}
                                value={images}
                                onChange={this.handleImages}
                                tagProps={{ className: "react-tagsinput-tag info" }}
                                inputProps={{ placeholder: '输入镜像' }}
                            />
                        </div>
                    </div>
                </DialogContent>
                {
                    onOk && (
                        <DialogActions>
                            <Button onClick={this.onCancel} color="primary">{intl.get('close')}</Button>
                            <Button onClick={onOk} color="primary" autoFocus>{onOk_text || intl.get('save')}</Button>
                        </DialogActions>
                    )
                }
            </Dialog>
        )
    }
}
export default Index;
