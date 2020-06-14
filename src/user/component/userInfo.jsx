import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'
import {
    Typography,Button,Avatar,Divider,
    Tabs,Tab,
    Paper,
    Zoom,Fab
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import UserBgImg from '@/assets/img/user_bg.jpg';
import intl from 'react-intl-universal';
import Service from '../Service'
import md5 from 'md5'
const styles = theme => ({
    root:{
        margin:'-24px -24px 0'
    },
    container:{
        padding:'16px 24px'
    },
    user_bg:{
        height: '120px',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    },
    user_avatar:{
        position: 'absolute',
        top:' -60px',
        left: '24px',
        width: '120px',
        border: '2px solid #fff',
        height: '120px'
    },
    user_info:{
        display: 'flex',
        padding: '16px 24px',
        paddingLeft: '160px',
        position: 'relative',
        flexWrap: 'wrap',
        '& .user_actions':{
            display: 'inline-block',
            marginLeft: 'auto'
        }
    },
    row:{
        padding:'16px',
        marginTop:'16px'
    }
})

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        //
    }

    componentDidMount() {
        this.bindScroll();
        this.loadActivity();
    }

    loadActivity(params){
        const sc = this;
        const act = sc.state.activityList;
        const user = this.props.user;
        params || (params = {currentPage:act.pageNum,pageSize:act.pageSize,loaded:false});
        params.UserName = user.username;
        act.loaded = false;
        if(act.pageNum == 1){
            act.records = [];
        }
        sc.setState({activityList:{...act}})
        Service.activityList(params,function(res){
            res.loaded = true;
            Array.prototype.push.apply(act.records,res.records);
            res.records = act.records;
            sc.state.activityList = res;
            sc.forceUpdate();
        })
    }

    bindScroll(){
        let sc = this;
        let triggerLoadMore = _.debounce(function(){
            let opt = sc.state.activityList;
            if(opt.pageNum < opt.totalPage){
                let params = _.extend({},{currentPage:++opt.pageNum,pageSize:opt.pageSize});
                sc.loadActivity(params);
            }
        },100)
        //
        _.scrollList.push(function(){
            let dom = document.documentElement;
            let isBottom = dom.scrollTop  > dom.scrollHeight - dom.offsetHeight - 50;
            triggerLoadMore();
        })
    }

    state = {
        activityList:{pageNum:1,pageSize:10,totalPage:0,loaded:false,records:[]},
        tabValue:0
    }

    tabSelect = (event, newValue) => {
        this.setState({tabValue:newValue})
    }

    
    render(){
        const { classes,user } = this.props;
        const { tabValue,activityList } = this.state;
        let listFooter = activityList.loaded ? (activityList.records.length>0 || <Icons.NodataT />) : <Icons.Loading />;
        if(activityList.records.length && activityList.totalPage == activityList.pageNum){
            listFooter = <div className="flex-center" style={{margin:'24px 0'}}><div className="buttonMore"><Button disabled size="small">{intl.get('tipsListToBottom')}</Button></div></div>;
        }
        const myAvatar = md5((user.email||'').toLowerCase().trim())
        return (
            <div className={classes.root}>
                <div className={classes.user_bg} style={{backgroundImage:`url(${UserBgImg})`}}></div>
                <div className={classes.user_info} >
                    <Avatar src={"https://www.gravatar.com/avatar/"+myAvatar+"?d=retro&size=120"} className={classes.user_avatar}/>
                    <div className="user_name">
                        <Typography variant="body2"></Typography>
                        <Typography variant="body1">{user.username}</Typography>
                    </div>
                    <div className="user_actions">
                    </div>
                </div>
                <div className={classes.container}>
                    <Tabs
                        value={tabValue}
                        onChange={this.tabSelect}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="standard"
                        aria-label="full width tabs example"
                    >
                        <Tab label="Activity" />
                    </Tabs>
                    <Divider light={true}/>
                    <br/><br/>
                    <Typography variant="h4">Most Recent Activity</Typography>
                    {
                        activityList.records.map((v,i)=>{
                            return (
                                <Paper className={clsx('flex-r',classes.row)} key={i}>
                                    <div className="flex-box">
                                        <Typography variant="subtitle1">{v.eventLog}</Typography>
                                        <Typography variant="body2">{Service.EVENT_TYPE[v.eventType]}</Typography>
                                    </div>
                                    <div className="flex-one">
                                        <Icons.TimeT data={v.createAt}/>
                                    </div>
                                </Paper>
                            )
                        })
                    }
                    {listFooter}
                    <div className="split" ></div>
                </div>
            </div>
        )
    }
}

export default Main(Index);


function Main(WComponent){

    return class extends React.PureComponent {
        state = {
            user:{}
        }

        loadUser(username){
            let sc = this;
            sc.setState({user:{username:username}});
            Service.userInfo({UserName:username},function (res) {
                if(res){
                    sc.setState({user:res});
                }else{
                    window.History.replace('/nomatch')
                }
            })
        }

        render(){
            let sc = this;
            let user = sc.state.user;
            if(user.id){
                let newProps = {
                    ...sc.props,
                    user:user
                }
                return <WComponent {...newProps} />
            }else{
                return <Icons.Loading />
            }
        }
    }
}