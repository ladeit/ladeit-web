import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import {
    withStyles,Typography,
    FormGroup,FormControlLabel,Checkbox,
    Paper
} from '@material-ui/core';
import Icons from '@/components/Icons/icons.jsx'
import Service from '../Service'
import intl from 'react-intl-universal'

const styles = theme => ({
    root:{
        width:'400px',
        padding:'16px',
    },
    paper:{
        padding:'16px 24px',
        marginBottom:'24px'
    }
})


@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        // this.props.data // group:{}
        this.userInfo = this.props.data;
        this.state.roleChecked = this.userInfo.accessLevel || 'R';
    }

    componentDidMount(){}

    state = {
        roleChecked:'',
        data:{name:''},
        roleList:[// maintainer / developer / reportor / guest
            {key:'R',text:'R'},
            {key:'RW',text:'RW'}
        ],
        //projects:[
        //    {name:'buzzy-web'} //,{name:'buzzy-core'},{name:'buzzy-store'},{name:'buzzy-k8s'}
        //]
    }

    updateUserGroupAuth(data){
        const sc = this;
        const renderUser = this.props.renderUser;
        Service.groupUserGroupAuth(data,(res)=>{
            window.Store.notice.add({text:intl.get('group.tipsCompleteAuthority')});
            renderUser();
        })
    }

    changeCheck(key){
        const sc = this;
        const userInfo = this.userInfo;
        return ()=>{
            if(sc.state.roleChecked == key){
                //
            }else{
                sc.state.roleChecked = key;
                sc.forceUpdate();
                // 更新数据
                let item = {};
                item.accessLevel = key;
                item.id = userInfo.id;// 关系id
                item.serviceGroupId = userInfo.groupId;
                item.userId = userInfo.userId;
                sc.updateUserGroupAuth(item,userInfo);
            }
        }
    }

    render(){
        const { classes,data } = this.props;
        const { roleChecked, roleList } = this.state;
        return (
            <div className={classes.root}>
                <div className={clsx(classes.paper)}>
                    <Typography variant="body2" style={{paddingBottom:'12px'}}>{intl.get('group.group')} :</Typography>
                    <Typography variant="body1" gutterBottom>{data.groupName}</Typography>
                    <br/>
                    <Typography variant="body2">{intl.get('inviteWeb.author')} :</Typography>
                    {
                        roleList.map((v)=>{
                            return (
                                <FormControlLabel
                                    className="form_row"
                                    control={
                                          <Checkbox
                                            checked={roleChecked==v.key}
                                            onChange={this.changeCheck(v.key)}
                                            color="primary"
                                          />
                                        }
                                    label={v.text}
                                />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Index;
