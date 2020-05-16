import React from 'react';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import { Link as RouterLink } from 'react-router-dom';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    withStyles,Typography,Grid,Toolbar,Tooltip,FormControlLabel,IconButton,Avatar,Divider,
    Badge,Button,Card,CardHeader,CardContent,CardActions,CardMedia
} from '@material-ui/core'
import Icons from '@/components/Icons/icons.jsx'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import intl from 'react-intl-universal'
// template
import DrawerT from '@/components/Dialog/Drawer.jsx'
import SubmenuT from 'components/Dialog/Popover.jsx'
import DeploymentT from '@/topology/deployment.jsx'
import MatchShowT from '../../topology/components/pod_topo_match_show'
import Service from '../Service'
import AuthFilter from '@/AuthFilter'
import Terminal from "../components/group/index_terminal";
import LogJsx from "../components/group/index_log";

const styles = theme => ({
    toolbar:{
        padding:'0 16px',
        '& .flex-right':{
            width:'100%'
        },
        '& .title':{
            whiteSpace:'nowrap'
        }
    },
    table:{
        '& .row_text':{
            fontSize:".8rem"
        }
    },
    groupItem:{
        minWidth:'270px',
    },
    groupOperation:{
        position:'absolute',
        right:0,
        top:'2px',
        cursor:'pointer',
        backgroundColor:'white',
        borderLeft:'1px solid #e8e6e6',
        borderBottom:'1px solid #e8e6e6'
    },
    groupOperationBox:{
        "& .item":{
            padding:"2px 4px"
        },
        "& svg":{
            padding:'2px',
            color:'#8a8a8a',
        }
    },
    group:{
        width:'100%',
        position:'relative',
        '& .MuiCardHeader-root':{
            padding:'8px 16px'
        },
        '& .MuiCardContent-root':{
            padding:'8px 4px',
            '&>p':{
                marginBottom:'4px'
            },
            '& .label':{
                width:'100px',
                fontSize:'.6rem',
                color:'#7b7b7b',
                textAlign:'right',
                display: 'inline-block'
            },
            '& h6.block':{
                width:'100px'
            }
        },
        '& .block':{fontWeight:'400', display:'inline-block'},
        // '& .MuiTypography-body2':{color:'#444'},
        '&.status_running':{borderTop:'2px solid #2e87e0'},
        '&.status_undefined':{borderTop:'2px solid #ddd'},
        '&.status_success':{borderTop:'2px solid #44b700'},
    }
});

@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        const sc = this;
        sc.initParams();
        let group = this.params._group;
        sc.$table = {
            noChecked:true,
            dense:true,
            columns:[
                { id: 'name', disablePadding: true, label: '名称',style:{width:'180px'},render:(row)=>{
                        return <RouterLink to={`/summary/${group}/${row.name}/common`}><Typography variant="body2" component="span" className="link1">{row.name}</Typography></RouterLink>
                    }} ,
                { id: 'match', disablePadding: true, label: '匹配规则',render:function(row){
                        row.match || (row.match = [])
                        return <MatchShowT data={row.match[0]} />
                    }},
                { id: 'name', disablePadding: true, label: '服务地址',render:function(row){
                        row.gateway || (row.gateway = [])
                        return row.gateway.join(",")||' 一 ';
                    }},
                { id: 'operation',noSort:true, disablePadding: true, label: '发布状态' ,render:(row)=>{
                        return sc.htmlVersion(row,group)
                    }},
                { id: 'status',noSort:true, disablePadding: true, label: '运行状态',render:(row)=>{
                        return <Typography variant="body2"><Badge className={`status_${row.status<1?'success':'running'} badge`} variant="dot" />{Service.STATUS(row.status)}</Typography>;
                    }},

            ],
            event:(name,data)=>{
                //
            }
        };
    }

    componentDidMount(){
        this.loadGroup();
        Store.event.bindDataEvent(this.renderService);
    }

    componentWillUnmount(){
        Store.event.bindDataEvent();
    }

    loadGroup(){
        const sc = this;
        let params = this.params;
        sc.setState({data_loaded:false})
        Service.groupListByName(params._group,(res)=>{
            let list = res[0].servicelist;
            sc.setState({data:list,data_loaded:true})
        })
    }

    state = {
        data:[],
        data_loaded:false,
        dense:true,
        selects:[],
        serviceDense:false
    }

    clickCreate(item){
        const sc = this;
        return ()=>{
            //sc.refs.$create.loadVersion(item);
            //sc.refs.$create.onOpen({
            //  item:item,
            //  open:true
            //})
            sc.$drawerUser.onOpen({open:true,anchor:'bottom'}, <DeploymentT serviceData={item} handleClose={this.clickCreateClose(item)} />)
        }
    }

    clickCreateClose = (item)=>{
        const sc = this;
        let { data } = this.props;
        return (flag)=>{
            if(flag){// 完成
                sc.$drawerUser.onOpen({open:false});
                // History.push(`/topology/${data.name}/${item.name}`)
            }else{// 取消
                sc.$drawerUser.onOpen({open:false});
            }
        }
    }

    clickSubmenu(index,flag){
        const sc = this;
        const { classes } = sc.props;
        return (event)=>{
            let el = document.querySelector(`.moreIcon_${index}`);
            if(flag){
                el.classList.remove('hidden')
            }else{
                el.classList.add('hidden')
            }
        }
    }

    clickSubmenu_setting(row){
        const sc = this;
        const fn = sc.toUrl(`/setting/${row.groupName}/${row.name}/common`)
        return fn;
    }

    clickSubmenu_console(row){
        const sc = this;
        return ()=>{
            sc.refs.$terminal.onOpen({
                open:true,
                data:row
            })
        }
    }

    clickLog = (terminalData)=>{
        const sc = this;
        return ()=>{
            sc.refs.$log.onOpen({
                open:true,
                data:terminalData
            })
        }
    }

    htmlVersion(item,groupName){// groupName
        let arr = [];
        let text = Service.STATUS(item.status);
        let imageVersion = item.imageVersion;
        let key = item.name;
        let auth = this.getServiceAuth(item);
        if(item.status==-1){
            arr.push(
                <div className="row_text block">
                    {auth('RW') ? <Typography variant="body2" component="span" className="link1" onClick={this.clickCreate(item)} key={key}>{intl.get('newCreate')}</Typography> : <Tooltip title={intl.get('tipsNoAuthority')}><span>{intl.get('newCreate')}</span></Tooltip>}
                </div>
            )
        }else if(item.status!=8 && item.status>1){
            if(imageVersion){// 非第一次 : 可查看详情
                arr.push(
                    <div className="row_text block">
                        <Typography variant="body2" className="link1 row_text" key={key} onClick={this.toUrl(`/topology/${groupName}/${item.name}/common`)}>{text}</Typography>
                    </div>
                )
            }else{
                arr.push(
                    <div className="row_text block">
                        <Typography variant="body2" className="row_text" key={key}>{text}</Typography>
                    </div>
                )
            }
        }else{
            arr.push(
                <div className="row_text block">
                    <Typography variant="body2" component="span" className="link1 row_text" onClick={this.toUrl(`/topology/${groupName}/${item.name}/common`)}>v{imageVersion}</Typography>&nbsp;&nbsp;&nbsp;
                    {auth('RW') ? <Typography variant="body2" component="span" className="link1" onClick={this.clickCreate(item)} >( {intl.get('newCreate')} )</Typography> : <Tooltip title={intl.get('tipsNoAuthority')}><span>{intl.get('newCreate')}</span></Tooltip>}
                </div>
            )
        }
        return arr;
    }

    handleDense = event => {
        this.setState({dense:event.target.checked});
        this.$table.onDense(event.target.checked);
    }

    renderService = (data)=>{
        let servicelist = this.state.data;
        let isChange = false;
        let ids = data.map((v) => {return v.id;})
        if(ids.length<1){
            return;
        }
        //
        servicelist.forEach((vv)=>{
            let index = ids.indexOf(vv.id);
            if(index>-1){
                let service = data[index];
                if(vv.status != service.status){
                    window._.extend(vv,service);
                    isChange = true;
                }
            }
        })
        //
        if(isChange){
            this.setState({data:[...servicelist]})
        }
    }

    render = ()=>{
        const sc = this;
        const { classes } = this.props;
        const { data,data_loaded,dense,serviceDense,selects } = this.state;
        const listFooter = data_loaded ? (data.length ? '' : <Icons.NodataT />) : <div className="split"><Icons.Loading /></div>;
        let params = this.params;
        return (
            <>
                <Layout
                    crumbList={[{text:params._group,url:`/group/${params._group}`},{text:'Services'}]}
                    menuT={<MenuLayout type="group" params={params} />}
                    contentT={
                        <>
                            <Grid container spacing={5}>
                                {
                                    data.map(function (one,index) {
                                        let avatar = one.name.substring(0,1).toLocaleUpperCase();
                                        let statusClass = one.status<1?(one.status<0?'undefined':'success'):'running';
                                        one.groupName = params._group;
                                        one.match || (one.match = [])
                                        one.gateway || (one.gateway = [])
                                        return (
                                            <Grid container item xs={3} spacing={0} className={classes.groupItem} 
                                                  onMouseEnter={sc.clickSubmenu(index,true)}
                                                  onMouseLeave={sc.clickSubmenu(index,false)}
                                            >
                                                <Card className={clsx(classes.group,'status_'+statusClass)}>
                                                    <CardHeader
                                                        avatar={
                                                            <Avatar className="avatar">{avatar}</Avatar>
                                                        }
                                                        title={
                                                            <div>
                                                                <Typography variant="h5" className="link2 overflow-text" onClick={sc.toUrl(`/summary/${params._group}/${one.name}/common`)} >{one.name}</Typography>
                                                                <Typography variant="h6" >ladeit.io</Typography>
                                                                <div className={clsx(classes.groupOperation)} >
                                                                    <div className={clsx("moreIcon_"+index,"hidden")}>
                                                                        <div className={clsx(classes.groupOperationBox,"flex-c")}>
                                                                            <IconButton size="small" className="flex-one item" onClick={sc.clickSubmenu_setting(one)}><SettingsOutlinedIcon /></IconButton>
                                                                            <Tooltip title="console" >
                                                                                <IconButton size="small" className="flex-one item" onClick={sc.clickSubmenu_console(one)}><Icons.ConsoleIcon style={{width:'20px',height:'16px',padding:0,margin:'2px 0',fill:'#8a8a8a'}}/></IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="log" >
                                                                                <IconButton size="small" className="flex-one item" onClick={sc.clickLog(one)} ><Icons.LogIcon style={{width:'1.2rem',marginTop:'-2px'}}/></IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="restart" >
                                                                                <IconButton size="small" className="flex-one item"><Icons.RestartIcon style={{width:'1.2rem',marginTop:'-2px'}}/></IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="yaml" >
                                                                                <IconButton size="small" className="flex-one item"><Icons.YamlIcon style={{width:'1.2rem',marginTop:'-2px'}}/></IconButton>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    />
                                                    <Divider light={true} />
                                                    <CardContent>
                                                        <Typography><span className="label">{intl.get('services.serviceStatus')}</span>&nbsp;:&nbsp;&nbsp;<Typography variant="h6" className="block overflow-text"><Badge className={`status_${statusClass} badge`} variant="dot" />{Service.STATUS(one.status)}</Typography></Typography>
                                                        <Typography><span className="label">{intl.get('services.serviceReleaseStatus')}</span>&nbsp;:&nbsp;&nbsp;{sc.htmlVersion(one,params._group)}</Typography>
                                                        <Typography><span className="label overflow-text">{intl.get('services.serviceMatch')}</span>&nbsp;:&nbsp;&nbsp;<Typography variant="h6" className="block overflow-text"><MatchShowT data={one.match[0]} /></Typography></Typography>
                                                        <Typography><span className="label overflow-text">{intl.get('services.serviceUrl')}</span>&nbsp;:&nbsp;&nbsp;<Typography variant="h6" className="block overflow-text">{one.gateway.join(",")||' 一 '}</Typography></Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                            {listFooter}
                            <Terminal ref="$terminal" />
                            <LogJsx ref="$log" />
                        </>
                    }
                />
                <DrawerT onRef={(ref)=>{this.$drawerUser = ref;}} />
            </>
        )
    }
}

export default Index;
