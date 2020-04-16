import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
//import Pagination from '@material-ui/lab/Pagination';
// layout
import intl from 'react-intl-universal'
import AuthFilter from '@/AuthFilter.jsx'
import Service from './Service'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import Icons from 'components/Icons/icons.jsx'
import ListPage from 'components/Table/list_page.jsx'
import Moment from 'moment'
// icon
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import BuildIcon from '@material-ui/icons/Build';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import Sort from './components/sort'

const styles = theme => ({
    root:{
        backgroundColor:'#fbfcfe'
    },
    group:{
        marginBottom:'16px',
        '& .header_divider':{
            width:'200px',
            justifyContent:'flex-end',
            borderRight:'1px solid #ddd'
        },
        '& .header':{
            maxWidth:'180px',
            padding:'0 4px'
        }
    },
    list:{
        '& .row':{
            width:'180px',
            display:'inline-block'
        },
        '& .row.gutter':{
            paddingLeft:'16px',
            paddingRight:'16px',
        },
        '& .row.groupname':{
            width:'240px'
        }
    },
    pape:{
        float:'right'
    },
    box:{
        height:'21px',
        cursor:'pointer',
        display:'flex',
        alignItems:'center',
        '& .top':{
            flex:1
        },
        '& .bottom':{
            flex:1
        },
        '& .active':{
            color:'red'
        }
    }
});

@withStyles(styles)
@AuthFilter
class Services extends React.PureComponent {
    componentWillMount(){}

    componentDidMount(){
        this.loadServices({GroupName:'',currentPage:1,pageSize:20});
    }

    loadServices(param){
        const sc = this;
        //param.OrderParam = sc.state.sortBy+sc.state.sort;
        sc.refs.$load.onOpen({hidden:false})
        sc.setState({data_loaded:false});
        Service.servicesRowList(param,function (res) {
            sc.refs.$load.onOpen({hidden:true})
            sc.setState({data:res,data_loaded:true})
        })
    }

    state = {
        sort:'',
        sortBy:'',
        data_loaded:false,
        data:{
            totalRecord: 6,
            pageNum: 1,
            pageSize: 20,
            totalPage: 1,
            records:[]
        }
    }

    clickItem(one){
        // /summary/bot/bot/common
        const goFn = this.toUrl(`/summary/${one.groupname}/${one.name}/common`);
        return ()=>{
            goFn();
        }
    }

    clickSetting(item){
        // /group/bot/setting
        const goFn = this.toUrl(`/group/${item.name}/setting`);
        return ()=>{
            goFn();
        }
    }

    clickSort = (name,sort)=>{
        const sc = this;
        const renderPage = _.throttle(sc.renderPage,1000)
        let data = {};
        if(name!=sc.state.sortBy){
            sort = 'asc';
        }
        if(sort){
            data = {sortBy:name,sort:sort};
        }else{
            data = {sortBy:'',sort:''};
        }
        // TODO sortBy sort
        sc.setState(data);
        sc.state.sortBy = data.sortBy;
        sc.state.sort = data.sort;
        renderPage(sc.state.data);
    }

    overSort = (name,flag)=>{
        const sc = this;
        return ()=>{
            if(flag){
                sc.setState({sortOver:name});
            }else{
                sc.setState({sortOver:''});
            }
        }
    }

    htmlGroup(item){
        const sc = this;
        const { classes } = this.props;
        return (
            <Paper elevation={1} className={clsx("flex-r",classes.group)} key={item.name}>
                <div className="flex-one flex-middle header_divider" >
                    <Typography variant="h5" className="header">{item.name}</Typography>
                    <Tooltip title="设置">
                        <IconButton onClick={sc.clickSetting(item)}><SettingsOutlinedIcon /></IconButton>
                    </Tooltip>
                </div>
                <div className="flex-box" >
                    {
                        item.servicelist.map(function (v,i) {
                            v.serviceGroupName = item.name;
                            return (
                                <>
                                    {i!=0?<Divider light={true} />:''}
                                    <List component="nav" key={i}>
                                        <ListItem button dense={true}  onClick={sc.clickItem(v)}>
                                            <ListItemText primary={v.name} />
                                        </ListItem>
                                        <ListItemSecondaryAction>
                                            <IconButton><BuildOutlinedIcon style={{fontSize:'1.1rem'}}/></IconButton>
                                        </ListItemSecondaryAction>
                                    </List>
                                </>
                            )
                        })
                    }
                </div>
            </Paper>
        )
    }

    // 字段带下划线命名空间的参数 / 字段不带下划线集群的参数
    htmlList(item,i){
        return (
            <List component="nav" key={i}>
                <ListItem className="row groupname" dense={true}>
                    <ListItemText primary={
                        <div>
                            <span className="link2" onClick={this.toUrl(`/group/${item.groupname}`)}>{item.groupname}</span>&nbsp;/&nbsp;
                            <span className="link2" onClick={this.toUrl(`/profile/${item.groupcreateby}`)}>{item.groupcreateby}</span>
                        </div>
                    }/>
                </ListItem>
                <ListItem className="row link1" dense={true} onClick={this.toUrl(`/summary/${item.groupname}/${item.name}/common`)}>
                    <ListItemText primary={<span className="link1">{item.name}</span>} />
                </ListItem>
                <ListItem className="row" dense={true} >
                    <ListItemText primary={item.modify_at ? Moment(item.modify_at).format('YYYY-MM-DD HH:mm:ss') : ''} />
                </ListItem>
                <ListItem className="row" dense={true} >
                    <ListItemText primary={item.create_by} className="link2" onClick={this.toUrl(`/profile/${item.create_by}`)}/>
                </ListItem>
                <ListItem className="row action" dense={true} >
                    <ListItemText primary={(item.create_at ? Moment(item.create_at).format('YYYY-MM-DD HH:mm:ss') : '')} />
                </ListItem>
                <ListItemSecondaryAction>
                    {item.name && <IconButton onClick={this.toUrl(`/setting/${item.groupname}/${item.name}/common`)}><BuildOutlinedIcon style={{fontSize:'1.1rem'}}/></IconButton>}
                </ListItemSecondaryAction>
            </List>
        )
    }

    renderPage = (page) => {
        const { sortBy,sort } = this.state;
        this.loadServices({GroupName:'',currentPage:page.pageNum,pageSize:page.pageSize,OrderParam:sortBy+sort})
    }

    render(){
        const sc = this;
        const { classes } = this.props;
        const { data,data_loaded } = this.state;
        let footer = data_loaded ? ( data.records.length ? '' : <Icons.NodataT /> ) : <Icons.Loading />;
        //window.sc = this;
        return (
            <div className={classes.root}>
                <Layout
                    menuT={<MenuLayout type="admin" params={{_menu:'services'}}/>}
                    contentT={(
                        <>
                            <div className={classes.list}>
                                <div className="split">
                                    <div className="row gutter groupname">{intl.get('adminArea.serviceGroup')}</div>
                                    <div className="row gutter">
                                        {sortHtml.call(sc,'servicename',intl.get('adminArea.serviceService'))}
                                    </div>
                                    <div className="row gutter">
                                        {sortHtml.call(sc,'modifyat',intl.get('adminArea.serviceDeploy'))}
                                    </div>
                                    <div className="row gutter">
                                        {sortHtml.call(sc,'createby',intl.get('adminArea.serviceCreateBy'))}
                                    </div>
                                    <div className="row gutter">
                                        {sortHtml.call(sc,'createat',intl.get('adminArea.serviceCreateAt'))}
                                    </div>
                                    <div className="row gutter"></div>
                                </div>
                                <Divider light={true} />
                                {
                                    data.records.map(function (one) {
                                        return [sc.htmlList(one),<Divider light={true} />]
                                    })
                                }
                            </div>
                            {footer}
                            {data.totalPage>1?<ListPage className={clsx(classes.pape,'split')} pagination={data} renderData={sc.renderPage} />:''}
                            <div className="split"></div>
                        </>
                    )}
                />
                <Icons.LoadCircular ref="$load" />
            </div>
        )
    }
}

const position = ['asc','desc',''];
function sortHtml(name,text){
    let { classes } = this.props;
    let { sortOver,sortBy,sort } = this.state;
    let icon = sort ? (sort == "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon /> ) : '';
    let index = (position.indexOf(sort)+1)%3;
    let sortIndex = position[index];
    return (
        <div className={classes.box}
             onClick={()=>{this.clickSort(name,sortIndex)}}
             onMouseOver={this.overSort(name,true)}
             onMouseLeave={this.overSort(name,false)}
        >
            { text }
            { sortBy==name && icon }
            { sortBy!=name && sortOver==name && <ArrowUpwardIcon style={{opacity:.2}}/> }
        </div>
    )
}

export default Services;
