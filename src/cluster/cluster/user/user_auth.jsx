import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import {
    withStyles,Typography,
    FormGroup,FormControlLabel,Checkbox,
    Paper
} from '@material-ui/core';
import Icons from '@/components/Icons/icons.jsx'
import Service from '@/cluster/Service'
import intl from 'react-intl-universal'

const styles = theme => ({
    root:{
        width:'400px',
        padding:'32px 40px',
    },
    paper:{
        padding:'16px 24px',
        marginBottom:'24px'
    }
})


@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        // this.props.data // user:{}
        this.userInfo = this.props.data;// 一条用户信息
    }

    componentDidMount(){
        let userInfo = this.userInfo;
        this.setState({roleRow_auth_loaded:true,roleRow_auth:userInfo.envuser})
    }

    updateUserAuth(data){
        const sc = this;
        data.userId = this.userInfo.userId;
        data.id = data.id;
        Service.envAuthUpdate(data,function(res){
            window.Store.notice.add({text:intl.get('cluster.tipsCompleteAuthority')})
            data.id = res;
            //
            sc.userInfo._render(data)
        })
    }

    state = {
        roleRow_auth:[],
        roleRow_auth_loaded:false,
        roleChecked:{},
    }

    render(){
        const sc = this;
        const { classes } = this.props;
        const { roleChecked,roleList, roleRow_auth,roleRow_auth_loaded } = this.state;
        const authFooter = roleRow_auth_loaded ? (roleRow_auth.length ? '' : <Icons.NodataT />) : <Icons.Loading />

        return (
            <div className={classes.root}>
                {
                    roleRow_auth.map((one)=>{
                        let serverName = one.serviceName;
                        let _checked = roleChecked[one.serviceName]
                        _checked || (_checked = one.roleNum || '')
                        return (
                            <Paper className={clsx('flex-r',classes.paper)}>
                                <div className="flex-box">
                                    <Typography variant="body2" style={{paddingBottom:'12px'}}>{intl.get('namespace.namespace')} :</Typography>
                                    <Typography variant="body1">{one.namespace}</Typography>
                                </div>
                                <div className="flex-box" style={{minWidth:'165px'}} >
                                    <AuthHtml data={one} ajax={(data)=>{sc.updateUserAuth(data)}}/>
                                </div>
                            </Paper>
                        )
                    })
                }
                {authFooter}
            </div>
        )
    }
}

export default Index;


// groupAuth
function AuthHtml({data,ajax}){
    const dataArr = (data.accessLevel||'').split(',');
    const [r, setR] = React.useState(dataArr.indexOf('R')>-1);
    const [w, setW] = React.useState(dataArr.indexOf('W')>-1);
    const [x, setX] = React.useState(dataArr.indexOf('X')>-1);
    const authCheck = function(name){
        return (e)=>{
            let checked = e.target.checked;
            switch (name) {
                case 'r':{
                    setR(checked)
                }
                    break;
                case 'w':{
                    setW(checked)
                    //
                    if(checked){
                        setR(true)
                    }else if(!x){
                        setR(false)
                    }
                }
                    break;
                case 'x':{
                    setX(checked)
                    //
                    if(checked){
                        setR(true)
                    }else if(!w){
                        setR(false)
                    }
                }
                    break;
            }
            ajax.loaded = true;
        }
    }
    const _render = _.debounce(function(){
        let roleNum = [];
        r && (roleNum.push('R'));
        w && (roleNum.push('W'));
        x && (roleNum.push('X'));
        data.accessLevel = roleNum.join(",");
        ajax.loaded = false;
        ajax(data);
    },300)
    //
    React.useEffect(()=>{
        if(ajax.loaded){
            _render();
        }
    })
    //
    return (
        <>
            <Typography variant="body2">{intl.get('inviteWeb.author')} :</Typography>
            <FormControlLabel
                className="form_row"
                control={
                    <Checkbox
                        disabled={w||x}
                        checked={r}
                        onChange={authCheck('r')}
                        size="small"
                        color="primary"
                    />
                }
                label="R"
            />
            <FormControlLabel
                className="form_row"
                control={
                    <Checkbox
                        checked={w}
                        onChange={authCheck('w')}
                        size="small"
                        color="primary"
                    />
                }
                label="W"
            />
            <FormControlLabel
                className="form_row"
                control={
                    <Checkbox
                        checked={x}
                        onChange={authCheck('x')}
                        size="small"
                        color="primary"
                    />
                }
                label="X"
            />
        </>
    )
}