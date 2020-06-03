import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import ErrorIcon from '@material-ui/icons/Error';
import PeopleOutlinedIcon from '@material-ui/icons/PeopleOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import AddIcon from '@material-ui/icons/Add';
import {
    withStyles,Typography,Button,IconButton,Divider,Avatar,Badge,
    Paper,Tooltip
} from '@material-ui/core';
import Icons from '@/components/Icons/icons.jsx'
import Dialog from 'components/Dialog/Alert.jsx'
import DeploymentT from '@/topology/deployment.jsx'
import Service from '@/projects/Service.js'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import TipList from 'components/Tips/list.jsx'
import Moment from 'moment'
import intl from 'react-intl-universal'
// template
import CreateT from './create.jsx'
import DrawerT from '@/components/Dialog/Drawer.jsx'
import ProjectsFlagPng from '@/assets/img/project_flag.png'
import ProjectsFlagSPng from '@/assets/img/project_flag_s.png'
import MatchShowT from '../../topology/components/pod_topo_match_show'
import RobotT from '@/topology/robot.jsx'
import AuthFilter from '@/AuthFilter.jsx'
import ServiceAdd from './group/group_service.jsx'
import Terminal from './group/index_terminal'
import ImageCreateT from '../releases/addImage'
import ConfirmDialog from 'components/Dialog/Alert.jsx'
import YamlEditT from '../../cluster/component/yamlEdit.jsx'
import LogJsx from './group/index_log'
import PodJsx from './group/pod_small'
import expand from '../../assets/svg/expand.svg'
import collapse from '../../assets/svg/collapse.svg'
const styles = theme => ({
    header:{
        textAlign:'right',
        padding:'8px 0'
    },
    group:{
        width:'1200px',
        margin:'40px auto',
        '& .title':{
            lineHeight:'30px',
            padding:'0 16px',
            fontSize:'.8rem',
            fontWeight: '600',
            color:'white',
            background:'#0071fb',
            borderTopLeftRadius:'4px',
            borderTopRightRadius:'4px',
            display:"inline-block"
        },
        '& .title_icon':{
            marginLeft:'8px',
            '& svg':{
                fontSize:'1.3rem'
            }
        },
        '& .box':{
            border:'1px solid #0071fb',
            padding:'16px'
        },
        '& .content':{
            lineHeight:'30px',
            padding:'16px 24px',
            '&>div':{
                height:'80px',
            },
            '&:not(:first-child)':{
                marginTop:'16px'
            }
        },
        '& .row_text':{lineHeight:'28px'},
        '& .cell_icon':{
            width:'60px',textAlign:'center',marginTop:"-3px",
            '&>div':{background:'none'},
            '& svg':{width:'1.3em',height:'1.3em'}
        },
        '& .cell_name':{
            width:'250px',
            '& .text_name':{maxWidth:'110px'},
            '& .text_split':{margin:'0 2px 0 6px',verticalAlign:'text-top'},
            '& .text_cluster':{maxWidth:'85px'},
            '& .icon_box':{
                height: '30px',
                padding: '6px 0',
                color: 'rgba(68, 68, 68,.9)',
                '& svg':{
                    margin:'0 6px',
                    cursor:'pointer'
                },
                '& svg:first-child':{
                    marginLeft:'-4px'
                }
            }
        },
        '& .cell_name_memo':{
            color:'#8d9ea7'
        },
        '& .cell_statu1':{width:'150px',textAlign:'center'},
        '& .cell_statu2':{width:'185px',textAlign:'center'},
        '& .cell_statu3':{width:'120px',textAlign:'center'},
        '& .cell_statu4':{width:'180px',padding:'0 8px'},
        '& .cell_robot':{width:'70px',height:'80px'},
        '& .cell_action':{
            height:"60px", lineHeight: "20px", padding: "4px 0 4px 7px", overflow: 'hidden',
            "& .row_text_notification":{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordBreak:'break-all',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
            }
        },
    },
    dialog:{
        '& .MuiDialog-paper':{
            overflowY:'inherit'
        }
    }
});
const serviceTipsMap = {};

@withStyles(styles)
@AuthFilter
class Index extends React.Component{
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

    clickAddService = ()=>{
        const sc = this;
        const {data} = this.props;
        return ()=>{
            sc.refs.$drawer.onOpen({open:true},<ServiceAdd onOk={sc.clickAddService_ok(data.id)}/>)
        }
    }

    clickAddService_ok = (id)=>{
        const sc = this;
        const renderGroup = this.props.renderGroup;
        return (form)=>{
            form.serviceGroupId = id;
            Service.groupAddService(form,function (res) {
                sc.refs.$drawer.onOpen({open:false})
                renderGroup();
            })
        }
    }

    clickRobot(item){
        const sc = this;
        return ()=>{
            // if(item.status==-1){
            //     return;
            // }
            //
            sc.refs.$dialog.onOpen({
                open:true,
                data:item,
                DialogContent:<RobotT serviceData={item} onOk={sc.clickRobot_ok}/>
            })
        }
    }

    clickRobot_ok = (result)=>{
        let item = this.refs.$dialog.state.data;
        item.servicePublishBot = result;
        // ajax
        this.forceUpdate();
        this.refs.$dialog.onOpen({open:false})
    }

    clickCreateClose = (item)=>{
        const sc = this;
        let { data } = this.props;
        return (flag)=>{
            if(flag){// 完成
                sc.$drawerUser.onOpen({open:false});
                // History.push(`/topology/${data.name}/${item.name}/common`)
            }else{// 取消
                sc.$drawerUser.onOpen({open:false});
            }
        }
    }

    clickCopy = ()=>{
        window.Store.notice.add({text:intl.get('tipsCopy'),time:1000})
    }

    clickTerminal = (terminalData)=>{
        const sc = this;
        return ()=>{
            sc.refs.$terminal.onOpen({
                open:true,
                data:terminalData
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


    clickRestart  = (terminalData)=>{
        const sc = this;
        return ()=>{
            sc.refs.$confirm.onOpen({
                open:true,
                title:intl.get('tips'),
                message:<Typography variant="body1" style={{width:'240px',fontWeight:400}}>Confirm restart ?</Typography>,
                onOk:function (res) {
                    sc.refs.$confirm.onClose();
                    Service.serviceRestart(terminalData.id,()=>{
                        //
                    })
                }
            })
        }
    }

    clickYamlList = (terminalData)=>{
        const sc = this;
        return ()=>{
            Service.serviceYamlList(terminalData.id,(result)=>{
                if(result){
                    sc.refs.$yaml.onOpen({},result)
                }
            })
        }
    }

    clickYamlList_save = (terminalData)=>{
        const sc = this;
        return ()=>{
            //
        }
    }

    handleImageCreate = () => {
        this.refs.$imageCreate.onCancel();
        this.props.renderGroup();
    }

    htmlVersion(item,authX){// 灰度发布
        let { classes,data } = this.props;
        let arr = [];
        let status = Service.STATUS2(item.status);
        let imageVersion = item.imageVersion;
        let key = item.name;
        if(item.status==-1){
            arr.push(
                <div key={key}>
                    <Typography variant="body2" className="row_text">{intl.get('services.serviceReleaseStatus')}</Typography>
                    <div className="row_text">
                        {authX ? <Typography variant="body2" component="span" className="link1" onClick={this.clickCreate(item)} key={key}>新建</Typography> : <Tooltip title={intl.get('tipsNoAuthority')}><span>{intl.get('newCreate')}</span></Tooltip>}
                    </div>
                </div>
            )
        }else if(item.status>1 && item.status!=8){
            if(imageVersion){// 非第一次 : 可查看详情
                arr.push(
                    <div key={key}>
                        <Typography variant="body2" className="row_text">{intl.get('services.serviceReleaseStatus')}</Typography>
                        <div className="row_text">
                            <Typography variant="body2" className="link1 row_text" key={key} onClick={this.toUrl(`/topology/${data.name}/${item.name}/common`)}>{status}</Typography>
                        </div>
                    </div>
                )
            }else{
                arr.push(
                    <div key={key}>
                        <Typography variant="body2" className="row_text">{intl.get('services.serviceReleaseStatus')}</Typography>
                        <div className="row_text">
                            <Typography variant="body2" className="row_text" key={key}>{status}</Typography>
                        </div>
                    </div>
                )
            }
        }else{
            arr.push(
                <div key={key}>
                    <Typography variant="body2" className="row_text">{intl.get('services.serviceReleaseStatus')}</Typography>
                    <div className="row_text">
                        <Typography variant="body2" component="span" className="link1 row_text" onClick={this.toUrl(`/topology/${data.name}/${item.name}/common`)}>v{imageVersion}</Typography>&nbsp;&nbsp;&nbsp;
                        {authX ? <Typography variant="body2" component="span" className="link1" onClick={this.clickCreate(item)} >( {intl.get('newCreate')} )</Typography> : <Tooltip title={intl.get('tipsNoAuthority')}><span>{intl.get('newCreate')}</span></Tooltip>}
                    </div>
                </div>
            )
        }
        return arr;
    }

    render = ()=>{
        const sc = this;
        const { classes,data,isChecked,openList,...other } = this.props;
        //const eye = this.state.eye;
        let name = data.name;
        let groupAuth = this.getAuth(data);
        let footer = data.servicelist.length ? '' : noServiceMask.call(sc,groupAuth(true));
        //
        const flexCell = {
            display:'flex',
            minWidth:'100px'
        }
        return (
            <div className={classes.group} key={data.name} >
                <div className="flex-middle">
                    <div className="title">
                        <span className="h5 link2" onClick={this.toUrl(`/group/${name}`)}>{name}</span>
                    </div>
                    <Tooltip title="Members">
                        <IconButton size="small" aria-label="user" className="title_icon" onClick={this.toUrl(`/group/${name}/user`)}><PeopleOutlinedIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                        <IconButton size="small" aria-label="setting" className="title_icon" onClick={this.toUrl(`/group/${name}/setting`)}><SettingsOutlinedIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Topology">
                        <IconButton size="small" aria-label="topography" className="title_icon" onClick={this.toUrl(`/group/${name}/topology`)}><DeviceHubIcon /></IconButton>
                    </Tooltip>
                    {
                        groupAuth(true) ? (
                            <Tooltip title="Add service">
                                <IconButton size="small" aria-label="user" className="title_icon" onClick={sc.clickAddService()}><AddIcon /></IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title={intl.get('tipsNoAuthority')} >
                                <IconButton size="small" aria-label="user" className="title_icon" style={{opacity:.4}} ><AddIcon /></IconButton>
                            </Tooltip>
                        )
                    }
                    <Tooltip title="Expand" style={{display:(isChecked||(openList.includes(data.id)))?'inline':'none'}}>
                        <IconButton size="small" aria-label="setting" className="title_icon">
                            <img src={expand} alt="" style={{opacity:.8,width:'16px',height:'16px'}}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Collapse" style={{display:(!isChecked&&(!openList.includes(data.id)))?'inline':'none'}}>
                        <IconButton size="small" aria-label="setting" className="title_icon">
                            <img src={collapse} alt="" style={{opacity:.8,width:'16px',height:'16px'}}/>
                        </IconButton>
                    </Tooltip>
                </div>
                <Paper className="box">
                {
                    data.servicelist.map((v,i)=>{
                        let auth = this.getServiceAuth(v);
                        v.match || (v.match = []);
                        v.gateway || (v.gateway = []);
                        v.groupName = data.name;
                        let TEXT_NUll = ' 一 '
                        let id = v.id;
                        let name = v.name;
                        let avatarName = name.substring(0,1).toLocaleUpperCase();
                        let url = v.gateway.join(',');
                        let icon = {'0':<Tooltip title="k8s" ><Icons.K8sIcon style={{margin:'0 6px 0',width:'16px',height:'16px',opacity:.5}}/></Tooltip>,'1':<Tooltip title="istio" ><Icons.IstioIcon style={{margin:'-2px 6px 0',width:'10px',height:'16px',fill:'#8d9ea7'}}/></Tooltip>}[v.serviceType] || '';
                        // CheckCircleIcon,CancelIcon,ErrorIcon
                        if((!isChecked)&&!(openList.includes(data.id))){
                            return (
                                <div style={{minWidth:"100px",display: "inline-block"}} >
                                     <div className="cell_icon overflow-text">
                                        {avatorHtml(v.status)}
                                </div>
                                     <div className="flex-one" style={{minWidth:"100px",display: "inline-block"}}>
                                        <div>
                                            {groupStatusHtml.call(sc,v)}
                                        </div>
                                     </div>       
                                </div>
                            )
                        }
                        return (
                            <Paper className="content mask_group" key={v.id}>
                                <div className="flex-r">
                                    <div className="flex-one flex-middle">
                                        <div className="cell_icon overflow-text">
                                            {avatorHtml(v.status)}
                                        </div>
                                    </div>
                                    <div className="flex-one">
                                        <div className="flex-middle" style={{height:'80px'}}>
                                            <div className="cell_name overflow-text">
                                                <Typography variant="h5" className="row_text">
                                                    {groupStatusHtml.call(sc,v)}
                                                    <Typography variant="body2" className="cell_name_memo" component="span">
                                                        <span className="text_split">@</span>
                                                        {groupClusterHtml.call(sc,v)}
                                                    </Typography>
                                                    {icon}
                                                </Typography>
                                                <div className="row_text icon_box flex-middle">
                                                    <Tooltip title="console" >
                                                        <Icons.ConsoleIcon width="24" height="18" onClick={sc.clickTerminal(v)} />
                                                    </Tooltip>
                                                    <Tooltip title="log" >
                                                        <Icons.LogIcon onClick={sc.clickLog(v)} style={{width:'1.2rem',marginTop:'-2px'}}/>
                                                    </Tooltip>
                                                    <Tooltip title="restart" >
                                                        <Icons.RestartIcon onClick={sc.clickRestart(v)} style={{width:'1.2rem',marginTop:'-2px'}}/>
                                                    </Tooltip>
                                                    <Tooltip title="yaml" >
                                                        <Icons.YamlIcon onClick={sc.clickYamlList(v)} style={{width:'1.2rem',marginTop:'-2px'}}/>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider light={true} orientation={'vertical'} />
                                    <div className="flex-one">
                                        <div className="cell_statu1 overflow-text">
                                            <Typography variant="body2" className="row_text">{intl.get('services.serviceMatch')}</Typography>
                                            <div className="row_text"><MatchShowT data={v.match[0]}/></div>
                                        </div>
                                    </div>
                                    <Divider light={true} orientation={'vertical'} />
                                    <div className="flex-one">
                                        <div className="cell_statu2 overflow-text">
                                            <Typography variant="body2" className="row_text">{intl.get('services.serviceGateway')}</Typography>
                                            <div className="row_text">{url || TEXT_NUll}</div>
                                        </div>
                                    </div>
                                    <Divider light={true} orientation={'vertical'} />
                                    <div className="flex-one">
                                        <div className="cell_statu3 overflow-text">
                                            {this.htmlVersion(v,auth('X'))}
                                        </div>
                                    </div>
                                    <Divider light={true} orientation={'vertical'} />
                                    <div className="flex-one">
                                        <div className="cell_statu4 overflow-text">
                                            { imagePanelHtml.call(sc,v) }
                                        </div>
                                    </div>
                                    <Divider light={true} orientation={'vertical'} />
                                    <div className="flex-one">
                                        <div className="cell_robot overflow-text flex-center">
                                        <Tooltip title={"Bot settings"} >
                                            {
                                                auth('X') ? (
                                                    <IconButton onClick={sc.clickRobot(v)}>
                                                        <img src={v.servicePublishBot.id?ProjectsFlagSPng:ProjectsFlagPng} style={{width:'24px'}}/>
                                                    </IconButton>
                                                ):(
                                                    <IconButton style={{opacity:.4}}>
                                                        <img src={v.servicePublishBot.id?ProjectsFlagSPng:ProjectsFlagPng} style={{width:'24px'}}/>
                                                    </IconButton>
                                                )
                                            }
                                             </Tooltip>
                                        </div>
                                    </div>
                                    <Divider light={true} orientation={'vertical'} />
                                    <div className="flex-box flex-middle" style={{transform:"translateX(8px)"}}>
                                        {/*{getNotification(v.messageAOS)}*/}
                                        <PodJsx service={v} style={{width:'98px'}}/>
                                    </div>
                                </div>
                                { !v.imagenum ? imageMask.call(sc,v) : (v.status == -1 ? firstMask.call(sc,v,groupAuth(true)) : '' ) }
                            </Paper>
                        )
                    })
                }
                {footer}
                </Paper>
                <CreateT ref="$create" onOk={()=>{History.push('/topology/buzzy-topo')}}/>
                <Dialog ref="$dialog" className={classes.dialog}/>
                <DrawerT onRef={(ref)=>{this.$drawerUser = ref;}} />
                <DrawerT ref="$drawer" />
                <Terminal ref="$terminal" />
                <LogJsx ref="$log" />
                <ConfirmDialog ref="$confirm" />
                <ImageCreateT ref="$imageCreate" onOk={sc.handleImageCreate}/>
                <YamlEditT ref="$yaml" />
            </div>
        )
    }
}

function avatorHtml(status){
    if(status<0){
        return (// ! status_skipped status_undefined
            <Tooltip title={intl.get('services.errorStatus.stop')}>
                <Avatar><ErrorIcon className="status_undefined"/></Avatar>
            </Tooltip>
        )
    }else if(status==8){// x ..
        return (
            <Tooltip title={intl.get('services.errorStatus.error')}><Avatar><CancelIcon className="status_failed"/></Avatar></Tooltip>
        )
    }else if(status>0){// ! ..
        return (
            <Tooltip title={intl.get('services.errorStatus.upgrade')}><Avatar className="badge"><span className="av_error flex-center"><ErrorIcon className="status_skipped"/></span></Avatar></Tooltip>
        )
    }else{
        return (// v
            <Tooltip title={intl.get('services.errorStatus.running')}>
                <Avatar><CheckCircleIcon className="status_success"/></Avatar>
            </Tooltip>
        )
    }
    // <Tooltip title="滚动升级中"><Avatar><CancelIcon className="status_failed"/></Avatar></Tooltip>
    // return <Avatar className="badge"><span className="av_error flex-center"><CancelIcon className="status_failed"/></span></Avatar>
}

function imageMask(item){
    let sc = this;
    let html = `curl --url ${window.SIP}/api/v1/service/image -H "Content-Type: application/json" -X POST --data '{"token":"${item.token}","serviceName":"${item.name}","image":"YOUR_IMAGE_NAME","version":"YOUR_IMAGE_VERSION","refs":"YOUR_GIT_REFS","commitHash":"YOUR_GIT_COMMIT_HASH"}'`
    let firstMemo1Arr = intl.get('services.firstMemo1').split('<%=button%>') // TODO lodash-template 无用
    return (
        <div className="mask_group_box">
            <div className="">
                {firstMemo1Arr[0]}
                <Button variant="contained" size={'small'} className="icon_button" onClick={()=>{sc.refs.$imageCreate.onOpen(item)}}>{intl.get('services.firstCreateImageButton')}</Button>
                {firstMemo1Arr[1]}
            </div>
            <div>{intl.get('services.firstMemo2')}</div>
            <Tooltip title={html}>
                <div className="html_text fl overflow-text" dangerouslySetInnerHTML={{__html:html}} ></div>
            </Tooltip>
            <CopyToClipboard text={html} onCopy={sc.clickCopy}>
                <Button variant="contained" size={'small'} className="icon_button">{intl.get('copy')}</Button>
            </CopyToClipboard>
        </div>
    )
}

function firstMask(item,hasAuth) {
    let sc = this;
    if(hasAuth){
        return (
            <div className="mask_group_box flex-center">
                <Button variant="contained" className="icon_button" onClick={sc.clickCreate(item)}>{intl.get('services.firstButton')}</Button>
            </div>
        )
    }else{
        return (
            <div className="mask_group_box flex-center">
                <Tooltip title={intl.get('tipsNoAuthority')}>
                    <Button variant="contained" className="icon_button disabled" >{intl.get('services.firstButton')}</Button>
                </Tooltip>
            </div>
        )
    }
}

function noServiceMask(hasAuth) {
    let sc = this;
    if(hasAuth){
        return (
            <div className="mask_group_box flex-center" style={{margin:'16px'}}>
                <Button variant="contained" className="icon_button" onClick={sc.clickAddService()}>{intl.get('services.servicesAdd')}</Button>
            </div>
        )
    }else{
        return (
            <div className="mask_group_box flex-center" style={{margin:'16px'}}>
                <Tooltip title={intl.get('tipsNoAuthority')}>
                    <Button variant="contained" className="icon_button disabled" >{intl.get('services.servicesAdd')}</Button>
                </Tooltip>
            </div>
        )
    }
}

function groupClusterHtml(item){
    const sc = this;
    let text = `${item.clustername}.${item.envname}`;
    let url = `/namespace/${item.clustername}/${item.envname}/setting`;
    let tip = '';
    text.length>14 && (tip = text);
    if(tip){
        return (
            <Tooltip title={tip}>
                <span className="text_cluster overflow-text link2" onClick={sc.toUrl(url)}>{text}</span>
            </Tooltip>
        )
    }else{
        return <span className="text_cluster overflow-text link2" onClick={sc.toUrl(url)}>{text}</span>
    }
}

function groupStatusHtml(item){
    const sc = this;
    let text = item.name;
    let tip = '';
    text.length>14 && (tip = text);
    if(tip){
        return (
            <Tooltip title={tip}>
                    <span>
                        <span className="text_name overflow-text link2" onClick={sc.toUrl(`/summary/${item.groupName}/${item.name}/common`)}>{text}</span>
                    </span>
            </Tooltip>
        )
    }else{
        return <span className="text_name overflow-text link2" onClick={sc.toUrl(`/summary/${item.groupName}/${item.name}/common`)}>{text}</span>
    }
}

function imagePanelHtml(item){// [{version:'5123',createAt:'2020-03-11T02:38:10.000+0000'}]
    let sc = this;
    let arr = [];
    let now = Moment();
    item.imageAOS.length = 2;
    item.imageAOS.map(function(v,i){
        if(v){
            let createAt_new = '';
            if(i==0){ // 最新一条记录，如果是当天内则展示'最新'
                let date = Moment(v.createAt||'');
                createAt_new = now.diff(date,'day')>0?'':<Icons.TagNewIcon style={{marginTop:'-4px'}}/>;
            }
            //
            arr.push(
                <div className="flex-middle">
                    <Typography variant="body2" component="span" className="link2" onClick={sc.toUrl(`/releases/${item.groupName}/${item.name}/${v.version}?id=${v.id}`)}>V{v.version}</Typography>&nbsp;&nbsp;<Icons.TimeT data={v.createAt} />{createAt_new}
                </div>
            )
        }
    })
    arr.push(<Typography variant="body2" className="link1" onClick={sc.toUrl(`/releases/${item.groupName}/${item.name}/common`)}>{intl.get('services.imageMoreButton')}</Typography>)
    return arr;
}

function getNotification(data){
    if(!data || data.length<1){
        return <div style={{paddingLeft:'8px'}}>No notification.</div>
    }else{
        return (
            <div className="cell_action">
                <TipList options={{height:60}} data={data} time={_.udid()}/>
            </div>
        )
    }
}

export default Index;




