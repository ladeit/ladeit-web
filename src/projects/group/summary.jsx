import React from 'react';
import ReactDOM from 'react-dom';
import { Link as RouterLink } from 'react-router-dom';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import {
    withStyles,Typography,Grid,Toolbar,Tooltip,FormControlLabel,IconButton,Avatar,Divider,
    Badge,Button,Card,CardHeader,CardContent,CardActions,CardMedia
} from '@material-ui/core'
import Icons from '@/components/Icons/icons.jsx'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
// template
import DrawerT from '@/components/Dialog/Drawer.jsx'
import DeploymentT from '@/topology/deployment.jsx'
import MatchShowT from '../../topology/components/pod_topo_match_show'
import Service from '../Service'
import AuthFilter from '@/AuthFilter'

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

    group:{
        width:'100%',
        '& .media':{
            height:'120px'
        },
        '& .MuiCardHeader-root':{
            padding:'8px 16px'
        },
        '& .MuiCardContent-root':{
            paddingTop:'0',
            '&>div':{
                marginBottom:'4px'
            }
        },
        '& .block':{
            display:'inline-block'
        },
        '& .avatar':{
            width:'50px',
            height:'50px',
            transform:'translateY(-35px)'
        }
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
                    return <Typography variant="body2"><Badge className={`status_${row.status<1?'success':'running'} badge`} variant="dot" />{Service.STATUS[row.status]}</Typography>;
                }},

            ],
            event:(name,data)=>{
                //
            }
        }
    }

    componentDidMount(){
        this.loadGroup();
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
                History.push(`/topology/${data.name}/${item.name}`)
            }else{// 取消
                sc.$drawerUser.onOpen({open:false});
            }
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
                    {auth('RW') ? <Typography variant="body2" component="span" className="link1" onClick={this.clickCreate(item)} key={key}>新建</Typography> : <Tooltip title="无权限!"><span>新建</span></Tooltip>}
                </div>
            )
        }else if(item.status>1 && item.status!=8){
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
                    {auth('RW') ? <Typography variant="body2" component="span" className="link1" onClick={this.clickCreate(item)} >( 新建 )</Typography> : <Tooltip title="无权限!"><span>新建</span></Tooltip>}
                </div>
            )
        }
        return arr;
    }

    handleDense = event => {
        this.setState({dense:event.target.checked});
        this.$table.onDense(event.target.checked);
    }

    render = ()=>{
        const sc = this;
        const { classes } = this.props;
        const { data,data_loaded,dense,serviceDense,selects } = this.state;
        const listFooter = data_loaded ? (data.length ? '' : <Icons.NodataT />) : <Icons.Loading />
        let params = this.params;
        return (
            <>
                <Layout
                    crumbList={[{text:params._group,url:`/group/${params._group}`},{text:'Services'}]}
                    menuT={<MenuLayout type="group" params={params} />}
                    contentT={
                        <>
                          <Grid container spacing={6}>
                              {
                                  data.map(function (one) {
                                      let avatar = one.name.substring(0,1).toLocaleUpperCase();
                                      one.match || (one.match = [])
                                      one.gateway || (one.gateway = [])
                                      return (
                                          <Grid container item xs={4} spacing={0}>
                                              <Card className={classes.group}>
                                                  <CardMedia
                                                      className="media"
                                                      image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
                                                      title="jpg"
                                                  />
                                                  <CardHeader
                                                      avatar={
                                                          <Avatar className="avatar">{avatar}</Avatar>
                                                      }
                                                      title={<Typography variant="h4" >{one.name}</Typography>}
                                                  />
                                                  <CardContent>
                                                      <div>
                                                          <Typography >匹配规则&nbsp;:&nbsp;&nbsp;<MatchShowT data={one.match[0]} /></Typography>
                                                      </div>
                                                      <div>
                                                          <Typography >服务地址&nbsp;:&nbsp;&nbsp;{one.gateway.join(",")||' 一 '}</Typography>
                                                      </div>
                                                      <div>
                                                          <Typography >发布状态&nbsp;:&nbsp;&nbsp;{sc.htmlVersion(one,params._group)}</Typography>
                                                      </div>
                                                      <div>
                                                          <Typography >运行状态&nbsp;:&nbsp;&nbsp;<Typography variant="body2" className="block"><Badge className={`status_${one.status<1?'success':'running'} badge`} variant="dot" />{Service.STATUS(one.status)}</Typography></Typography>
                                                      </div>
                                                  </CardContent>
                                                  <Divider light={true}/>
                                                  <CardActions disableSpacing>
                                                      <IconButton aria-label="settings" onClick={sc.toUrl(`/setting/${params._group}/${one.name}/common`)}>
                                                          <SettingsOutlinedIcon />
                                                      </IconButton>
                                                  </CardActions>
                                              </Card>
                                          </Grid>
                                      )
                                  })
                              }
                          </Grid>
                        </>
                    }
                />
                <DrawerT onRef={(ref)=>{this.$drawerUser = ref;}} />
            </>
        )
    }
}

export default Index;
