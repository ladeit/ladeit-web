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
import AuthFilter from '@/AuthFilter.jsx'

const styles = theme => ({
    root:{
        backgroundColor:'#fbfcfe'
    },
    group:{
        marginBottom:'16px',
        '& .header_divider':{
            width:'200px',
            justifyContent:'center',
            borderRight:'1px solid #ddd'
        },
        '& .header':{
            maxWidth:'180px',
            padding:'0 8px'
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
        sc.refs.$load.onOpen({hidden:false})
        sc.setState({data_loaded:false})
        Service.clustersRowList(param,function (res) {
            sc.refs.$load.onOpen({hidden:true})
            sc.setState({data:res,data_loaded:true})
        })
    }

    state = {
        sort:'',
        sortBy:'',
        sortOver:'',
        data:{
            loaded:false,
            totalRecord: 6,
            pageNum: 1,
            pageSize: 20,
            totalPage: 1,
            records:[]
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
        const { classes } = this.props;
        return (
            <Paper elevation={1} className={clsx("flex-r",classes.group)} key={item.name}>
                <div className="flex-one flex-middle header_divider" >
                    <Typography variant="h5" className="header">{item.k8sName}</Typography>
                </div>
                <div className="flex-box" >
                    {
                        item.envs.map(function (v) {
                            return (
                                <>
                                    <List component="nav">
                                        <ListItem button dense={true}>
                                            <ListItemText primary={v.namespace} />
                                        </ListItem>
                                        <ListItemSecondaryAction>
                                            <IconButton><BuildOutlinedIcon style={{fontSize:'1.1rem'}}/></IconButton>
                                        </ListItemSecondaryAction>
                                    </List>
                                    <Divider light={true} />
                                </>
                            )
                        })
                    }
                </div>
            </Paper>
        )
    }

    htmlList(item,i){
        const sc = this;
        return (
            <List component="nav" key={i}>
                <ListItem className="row" dense={true} >
                    <ListItemText primary={
                        <div>
                            <span className="link2" onClick={sc.toUrl(`/cluster/${item.clustername}/setting`)} >{item.clustername}</span>&nbsp;/&nbsp;
                            <span className="link2" onClick={sc.toUrl(`/profile/${item.createby}`)} >{item.createby}</span>
                        </div>
                    } />
                </ListItem>
                <ListItem className="row" dense={true} >
                    <ListItemText primary={item.namespace} />
                </ListItem>
                <ListItem className="row" dense={true} >
                    <ListItemText primary={item.env_tag} />
                </ListItem>
                <ListItem className="row" dense={true} >
                    <ListItemText primary={item.create_by} />
                </ListItem>
                <ListItem className="row action" dense={true} >
                    <ListItemText primary={(item.create_at ? Moment(item.create_at).format('YYYY-MM-DD HH:mm:ss') : '')} />
                </ListItem>
                <ListItemSecondaryAction>
                    {item.namespace && <IconButton onClick={sc.toUrl(`/namespace/${item.clustername}/${item.namespace}/setting`)}><BuildOutlinedIcon style={{fontSize:'1.1rem'}}/></IconButton>}
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
        let footer = data_loaded ? ( data.records.length ? '' : <Icons.NodataT /> ) : '';
        return (
            <div className={classes.root}>
                <Layout
                    menuT={<MenuLayout type="admin" params={{_menu:'clusters'}}/>}
                    contentT={(
                        <>
                            <div className={classes.list}>
                                <div className="split">
                                    <div className="row gutter">{intl.get('adminArea.clusterCluster')}</div>
                                    <div className="row gutter">
                                        {sortHtml.call(sc,'namespace',intl.get('adminArea.clusterNamespace'))}
                                    </div>
                                    <div className="row gutter">
                                        {sortHtml.call(sc,'envtag',intl.get('adminArea.clusterEnv'))}
                                    </div>
                                    <div className="row gutter">
                                        {sortHtml.call(sc,'createby',intl.get('adminArea.clusterCreateBy'))}
                                    </div>
                                    <div className="row gutter">
                                        {sortHtml.call(sc,'createat',intl.get('adminArea.clusterCreateAt'))}
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
                            {data.totalPage>1?<ListPage className={classes.pape} pagination={data}  renderData={sc.renderPage} />:''}
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
