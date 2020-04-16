import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import AuthFilter from '@/AuthFilter.jsx'
import Moment from 'moment';
import Service from '@/notification/Service'
import Icons from 'components/Icons/icons.jsx'
import intl from 'react-intl-universal'
// icon
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
//
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const style = theme => ({
    item:{
        width:'300px',
        padding:'8px',
        float:'left'
    },
    label:{
        width:'60px'
    }
})

@withStyles(style)
@AuthFilter
class Index extends React.PureComponent {
    componentDidMount(){
        this.loadParams();
    }

    componentDidUpdate(){
        this.loadParams();
    }

    loadParams(){
        this.initParams();
        let no = this.params._no;
        if(this._no != no){
            this._no = no;
            this.loadInfo();
        }
    }

    loadInfo(){
        let params = this.params;
        let sc = this;
        sc.refs.$loading.onOpen({hidden:false});
        Service.notificationOne(params._no,function(res){
            sc.refs.$loading.onOpen({hidden:true})
            if(res){
                sc.setState({info:res})
            }else{
                window.History.push(`/nomatch`)
            }
        })
    }

    state = {
        info:{}
    }

    clickBack = ()=>{
        const sc = this;
        const cate = sc.params.cate;
        let url = '/notification/all';
        let backSet = {'all':'all','read':'read','new':'new'};
        if(backSet[cate]){
            History.goBack();
        }else{
            History.push(`/notification/all`);
        }
    }

    render(){
        const sc = this;
        const { classes } = this.props;
        const { info } = this.state;
        const NULL_TEXT = ' 一 ';
        return (
            <Layout
                menuT={<MenuLayout type="notification" />}
                crumbList={[{text:''}]}
                crumbFooter={
                    <Button color="primary" component="span" onClick={sc.clickBack} >
                        <KeyboardBackspaceIcon /><Typography>&nbsp;{intl.get('notification.back')}</Typography>
                    </Button>
                }
                contentT={
                    <React.Fragment>
                        <div className="clearfix">
                            <div className={clsx("flex-r", classes.item)}>
                                <div className={'flex-one ' + classes.label}>{intl.get('notification.tableOprBy')}</div>
                                <div className={clsx('flex-box',classes.text)}>
                                    :&nbsp;&nbsp;
                                    {info.operuserName && <Typography component="span" variant="body2" className="link2" onClick={sc.toUrl(`/profile/${info.operuserName}`)}>{info.operuserName}</Typography>}
                                </div>
                            </div>
                            <div className={clsx("flex-r", classes.item)}>
                                <div className={'flex-one ' + classes.label}>{intl.get('notification.tableTime')}</div>
                                <div className={'flex-box ' + classes.text}>
                                    :&nbsp;&nbsp;
                                    <Typography component="span" variant="body2">{Moment(info.createAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                                </div>
                            </div>
                        </div>
                        <div className="clearfix">
                            <div className={clsx("flex-r", classes.item)}>
                                <div className={'flex-one ' + classes.label}>{intl.get('group.group')}</div>
                                <div className={clsx('flex-box',classes.text)} >
                                    :&nbsp;&nbsp;
                                    {info.serviceGroupName && <Typography component="span" variant="body2" className="link2" onClick={sc.toUrl(`/group/${info.serviceGroupName}`)}>{info.serviceGroupName}</Typography>}
                                </div>
                            </div>
                            <div className={clsx("flex-r", classes.item)}>
                                <div className={'flex-one ' + classes.label}>{intl.get('services.services')}</div>
                                <div className={clsx('flex-box',classes.text)} >
                                    :&nbsp;&nbsp;
                                    {info.serviceName && <Typography component="span" variant="body2" className="link2" onClick={sc.toUrl(`/summary/${info.serviceGroupName}/${info.serviceName}/common`)}>{info.serviceName}</Typography>}
                                </div>
                            </div>
                        </div>
                        <br/>
                        <Divider light={true} />
                        <br/>
                        {info.content}
                        <Icons.LoadCircular ref="$loading" />
                    </React.Fragment>
                }
            />
        )
    }
}

export default Index;
