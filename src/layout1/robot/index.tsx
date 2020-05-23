import * as React from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
    withStyles,Typography, Button, IconButton,Popover,Divider,Tabs,Tab,
    Card,CardHeader,CardContent,CardActionArea,CardActions,List,ListItem,ListItemAvatar,Avatar,ListItemText,ListItemSecondaryAction
} from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import intl from 'react-intl-universal'
import _ from 'lodash'
//
import {observer,inject} from "mobx-react";
import Icons from 'components/Icons/icons'
import Moment from 'moment';
import Service from '@/notification/Service';
//const RobotPng = require('../../static/img/robot.png');


interface IProps {
    classes?: any;
    theme?: any;
    children?: any;
}

interface IState {
    el?: any;
    notifications: any[];
    tabVal?:any;
}

@inject('store')
@observer
class Index extends React.PureComponent<IProps,IState> {
    componentDidMount(){
        const {store} = this.props;
        store.notification.loadNotification();
    }

    public state:IState = {
        el:null,
        notifications:[],
        tabVal:0
    }

    private toUrl = (url)=>{
        return ()=>{History.push(url)}
    }

    private clickRobot = (e) =>{
        this.setState({el:e.currentTarget})
    }

    private triggleNotifications = ()=> {
        this.setState({el:null})
    }

    private clickMessage = (one,index)=> {
        const sc = this;
        let { store } = this.props;
        return ()=>{
            if(!one.read_flag){
                Service.notificationReadList([{id:one.messagestateid}],function (res) {})
            }
            sc.triggleNotifications();
            store.notification.readNotification(index);
            History.push(`/notification/info/${one.id}`);
        }
    }


    public renderContent(list): JSX.Element{
        let sc = this;
        let arr = [];
        list.map(function (one,index) {
            arr.push(
                <>
                    <ListItem key={one} button dense={true} onClick={sc.clickMessage(one,index)}>
                        <ListItemAvatar>
                            <Avatar>
                                {one.title.substr(0,1)}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={
                            <Typography variant="body1">
                                <div className="overflow-text" style={{width:'100%'}}>{one.title}</div>
                            </Typography>
                        } secondary={Moment(one.create_at).format('YYYY-MM-DD HH:mm:ss')} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <ArrowForwardIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider light={true}/>
                </>
            )
        })
        if(list.length < 1){
            arr.push(<Icons.NodataT text={intl.get('notification.tipsNoRead')} />);
        }
        return arr;
    }

    public render(): JSX.Element{
        const sc = this;
        let { classes,store } = this.props;
        let { el,tabVal } = this.state;
        let id = "robot_png_popover";
        //let active = History.location.pathname.indexOf('/notification')>-1;
        let normalMsg = store.notification.normalData.records;
        let notifications = store.notification.data.records;
        let notifications_size = store.notification.data.totalRecord || store.notification.normalData.totalRecord;// 总未读记录数
        //
        return (
            <>
                <Badge
                    variant="dot"
                    anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                    badgeContent={notifications_size?'':0}
                    color={"error"}
                >
                    <IconButton size="small" color="inherit" aria-describedby={id} className={classes.button} style={{backgroundColor:'white'}}
                        onClick={this.clickRobot}
                        // onMouseEnter={this.clickRobot}
                    >
                        <NotificationsIcon style={{color:'black'}} />
                    </IconButton>
                </Badge>
                <Popover
                    id={id}
                    open={Boolean(el)}
                    anchorEl={el}
                    onClose={this.triggleNotifications}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    className={classes.popover}
                >
                    <Card className={classes.card}>
                        <CardHeader
                            title={<span>{intl.get('notification.notification')}</span>}
                            action={<Button size="small" style={{transform:'translateY(8px)'}} onClick={this.toUrl(`/notification/new`)}>{intl.get('notification.seeAll')}</Button>}
                        />
                        <CardContent className={classes.list}>
                            <List component="nav" >
                                <Divider light={true}/>
                                <Tabs
                                    variant="fullWidth"
                                    value={tabVal}
                                    onChange={(e,value)=>{this.setState({tabVal:value})}}
                                    indicatorColor="primary"
                                    textColor="primary"
                                >
                                    <Tab label={intl.get('notification.important')} />
                                    <Tab label={intl.get('notification.common')} />
                                </Tabs>
                                <Divider light={true}/>
                                {
                                    tabVal==0 && sc.renderContent(notifications)
                                }
                                {
                                    tabVal==1 && sc.renderContent(normalMsg)
                                }
                            </List>
                        </CardContent>
                    </Card>
                </Popover>
            </>
        )
    }
}

const styles = theme => ({
    popover:{
        '& .MuiPopover-paper':{
            width:'380px',
        }
    },
    button:{
        width:'40px',
        height:'40px'
    },
    card:{
        width:'380px',
        '& .actions':{
            backgroundColor:'#fafafa'
        }
    },
    list:{
        padding:0,
        '&>nav':{
            padding:0
        }
    }
})

export default withStyles(styles as any)(Index as any) as any;
