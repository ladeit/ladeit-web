import React from 'react';
import clsx from 'clsx';
import Moment from 'moment'
import {
    Add as AddIcon,
    Edit as EditIcon,
    Info as InfoIcon,
    Remove as RemoveIcon,
    ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Paper,Button,IconButton,Divider,
    Table,TableBody,TableHead,TableCell,TableRow,
    Tooltip,CardHeader,CardContent
} from '@material-ui/core';

import YamlEditT from '../../cluster/component/yamlEdit.jsx'
import TerminalT from './index_terminal.jsx'
import Icons from '@/components/Icons/icons.jsx'
import ClusterService from '../../cluster/Service'
import AuthFilter from '@/AuthFilter.jsx'
import intl from 'react-intl-universal'

const styles = theme => ({
    root:{
        border:'1px solid #eee',

        '& .border_row':{
            backgroundColor:'#fdfdfd',

            '& td:not(:last-child)':{
                borderRight:'1px solid #eeeeee'
            },
            '& th:not(:last-child)':{
                borderRight:'1px solid #eeeeee'
            }
        },

        '& .tableExtendIcon':{
            width:'30px'
        },
        '& .tableTowRow':{
            padding:'8px 0'
        },
        '& .tableThreeRow':{
            padding:'8px 0 8px 56px'
        },
        '& .tableBody tr:last-child td':{
            borderBottom:'1px solid #eeeeee'
        },
        '&  tr.active td':{
            borderBottom:'1px dashed rgba(221, 221, 221,.4)'
        },

        '& .label':{minWidth:'100px',display:'inline-block'},
        '& .label_name':{minWidth:'160px',display:'inline-block'},
        '& .label_pod':{minWidth:'160px',display:'inline-block'},
        '& .label_image':{minWidth:'280px',display:'inline-block'},
        '& .label_command':{minWidth:'160px',display:'inline-block'}
    },
    paper:{
        padding:'0',
        margin:'0 8px 0 1px',

        '& .MuiTypography-body2':{
            marginLeft:'8px'
        },
        '& .terminal_icon':{
            width:'1.5rem'
        }
    }
})

let columns = []

@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        columns = [
            {id:'type',label:intl.get('services.component.cellType')},
            {id:'name',label:intl.get('services.component.cellName')},
            {id:'labels',label:intl.get('services.component.cellEnv'),render:function(row){ return row.labels && getLabels(row.labels)}},
            {id:'createAt',label:intl.get('services.component.cellCreateAt'),render:function(row){return <Typography variant="body2"><Icons.TimeT data={row.createAt} /></Typography>}},
            {id:'info',label:intl.get('services.component.cellInfo'),render:function(row){
                let info = '';
                let res = [];
                if(['Service','Ingress'].indexOf(row.type)>-1){
                    info = <Tooltip title="name : port protocol targetPort"><InfoIcon className="icon MuiTypography-body2" style={{fontSize:'1.2rem',marginRight:'4px'}}/></Tooltip>
                    row.info.map((v)=>{
                        res.push(`${v.name} : ${v.port} ${' '+v.protocol} ${' '+v.targetPort}`)
                    })
                }else if(row.type == 'PersistentVolumeClaim'){
                    let accessmodes = row.info.accessmodes;
                    res.push(`${intl.get('services.component.envStore')} : ${accessmodes.join(',')}`)
                    //
                    let resources = row.info.resources;
                    let keys = Object.keys(resources);
                    keys.map((v)=>{
                        let one = resources[v];
                        res.push(`${v}${intl.get('services.component.envResource')} : ${one.number} byte`)
                    })
                }else{
                    info = <Tooltip title={intl.get('services.component.envPodMemo')}><InfoIcon className="icon MuiTypography-body2" style={{fontSize:'1.2rem',marginRight:'4px'}}/></Tooltip>
                    res.push(row.info);
                }
                //
                if(!info){
                    return res.map((v)=>{
                        return <div>{v}</div>
                    })
                }else{
                    return (
                        <div className="flex-r">
                            <div className="flex-one flex-middle">
                                {info}
                            </div>
                            <div className="flex-box">
                                {
                                    res.map((v)=>{
                                        return <div>{v}</div>
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            }},
        ]
    }

    componentDidMount(){}

    state = {
    }

    clickEditYaml = (row)=>{
        const sc = this;
        let serviceData = this.props.serviceData;
        return ()=>{
            let params = {serviceId:serviceData.id,type:row.type,name:row.name};
            ClusterService.namespaceYamlMapByServiceId(params,function(result){
                sc.refs.$yaml.onOpen(params,result)
            })
        }
    }

    clickEditYaml_save(){
        const sc = this;
        let refs = this.refs;
        let serviceData = this.props.serviceData;
        let renderService = this.props.renderService;
        let notice = window.Store.notice;

        return ()=>{
            const $y = refs.$yaml;
            sc.refs.$loadCircular.onOpen({hidden:false})
            ClusterService.namespaceYamlUpdate({serviceId:serviceData.id,yaml:$y.$editor.getValue()},function(){
                notice.add({text:'已更新. '})
                renderService();
                sc.refs.$loadCircular.onOpen({hidden:true})
            })
            $y.onCancel();
        }
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

    showRow = (item)=>{
        item._show = !item._show;
        this.forceUpdate();
    }

    htmlEditYaml(row){
        if(['Service','Deployment'].indexOf(row.type)==-1){return;}
        return <Button color="primary" size="small" startIcon={<EditIcon className="icon"/>}  onClick={this.clickEditYaml(row)} >yaml</Button>
    }

    render(){
        const { classes,data,serviceData } = this.props;
        let rows = this.props.data;
        let data_loaded = this.props.data_loaded;
        let footer = data_loaded ? (rows.length > 0 ? '' : <TableRow><TableCell colSpan={columns.length+2}><Icons.NodataT /></TableCell></TableRow> ) : <TableRow><TableCell colSpan={columns.length+2}><Icons.Loading /></TableCell></TableRow>;
        let auth = this.getServiceAuth(serviceData);
        //
        return (
            <Table stickyHeader aria-label="sticky table" size="small" className={classes.root} >
                <TableHead style={{backgroundColor:'#fafafa !important'}}>
                    <TableRow className="border_row">
                        <TableCell></TableCell>
                        {columns.map(column => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                        <TableCell>
                        </TableCell>
                    </TableRow>
                </TableHead>

                    {rows.map((row,index) => {
                        row._show!=undefined || (row._show = true);
                        let rowShow = row._show;
                        let rowSyle = rowShow?'active':'';
                        return (
                            <TableBody className="tableBody" >
                                <TableRow hover role="checkbox" tabIndex={-1} key={index} className={`border_row ${rowSyle}`} >
                                    <TableCell className="tableExtendIcon">
                                        {(row.children && row.children.length>0) && <IconButton size="small" onClick={()=>{this.showRow(row)}} >{rowShow?<RemoveIcon />:<AddIcon />}</IconButton>}
                                    </TableCell>
                                    {columns.map(column => {
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.render?column.render(row):row[column.id]}
                                            </TableCell>
                                        )
                                    })}
                                    <TableCell>
                                        {this.htmlEditYaml(row)}
                                    </TableCell>
                                </TableRow>
                                {
                                    rowShow && row.children && row.children.map((rowMemo,rowMemoIndex)=>{
                                        rowMemo || (rowMemo = {});
                                        rowMemo._show!=undefined || (rowMemo._show = true);
                                        let rowMemoShow = rowMemo._show;
                                        let rowMemoStyle = rowMemoShow ? 'active' : '';
                                        let secondInfo = ( InfoMap[row.type] || InfoMap.default )(rowMemo);
                                        return (
                                            <>
                                                <TableRow className={rowSyle} key={rowMemoIndex}>
                                                    <TableCell></TableCell>
                                                    <TableCell colSpan={columns.length+1} className="tableTowRow">
                                                        <Paper className={clsx(classes.paper,"list-info",'MuiPaper-elevation1')} >
                                                            <CardHeader className="list-info-header"
                                                                title={
                                                                    <div onClick={()=>{this.showRow(rowMemo)}}>
                                                                        <Typography component="b">POD {intl.get('services.component.cellInfo')}&nbsp;&nbsp;</Typography>
                                                                        {secondInfo}
                                                                        <IconButton className="fr" size="small" ><ExpandMoreIcon className={rowMemoShow?'':'active_icon'}/></IconButton>
                                                                    </div>
                                                                } >
                                                            </CardHeader>
                                                            <Divider light={true} />
                                                            <CardContent className={clsx("list-info-content",'hidden',rowMemoShow?'active_content':'')}>
                                                                {
                                                                    rowMemoShow && rowMemo.children && rowMemo.children.map((v)=>{
                                                                        let labels = '',labels_keys = '';
                                                                        if(v.labels){
                                                                            labels = getLabels(v.labels);
                                                                            labels_keys = Object.keys(v.labels).join(',')
                                                                        }
                                                                        let terminalData = {serviceId:serviceData.id,name:rowMemo.name,container: v.name};
                                                                        return (
                                                                            <div>
                                                                                <IconButton disabled={!auth('X')} size="small" onClick={auth('X') && this.clickTerminal(terminalData)} ><Icons.ConsoleIcon className="terminal_icon"/></IconButton>&nbsp;&nbsp;
                                                                                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.containerName')}</span> : <span className="label_name overflow-text">{v.name||' 一 '}</span>
                                                                                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.containerImage')}</span> : <span className="label_image overflow-text">{v.image||' 一 '}</span>
                                                                                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.containerCommand')}</span> : <span className="label_command overflow-text">{v.command||' 一 '}</span>
                                                                                {
                                                                                    labels && (
                                                                                        <>
                                                                                            <span className="MuiTypography-body2">{intl.get('services.component.containerEnv')}</span> : <Tooltip title={labels} ><span>{labels_keys}</span></Tooltip>
                                                                                        </>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </CardContent>
                                                        </Paper>
                                                    </TableCell>
                                                </TableRow>




                                            </>
                                        )
                                    })
                                }
                            </TableBody>
                        )
                    })}

                {footer}
                <YamlEditT ref="$yaml" onOk={auth('X') && this.clickEditYaml_save()} onOk_text={intl.get('exec')}/>
                <TerminalT ref="$terminal" />
                <Icons.LoadCircular ref="$loadCircular" />
            </Table>
        )
    }
}

function getTime(value){
    if(value){
        let date = Moment(value);
        return date.format('MMM Do YYYY');
    }else{
        return ''
    }
}

function getLabels(map){
    let keys = Object.keys(map);
    let res = [];
    keys.map((v)=>{
        res.push(`${v} : ${map[v]||' 一 '}`)
    })
    return res.map((v)=>{
        return <div>{v}</div>
    })
}

let InfoMap = {
    Service:function(map){
        return (
            <span>
                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.podName')}</span> : <span className="label_name overflow-text">{map.name||' 一 '}</span>
                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.podPath')}</span> : <span className="label_pod overflow-text">{map.path||' 一 '}</span>
                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.podPort')}</span> : {map.port||' 一 '}
            </span>
        )
    },
    Ingres:function(map){
        return (
            <span>
                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.podName')}</span> : <span className="label_name overflow-text">{map.name||' 一 '}</span>
                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.podPath')}</span> : <span className="label_pod overflow-text">{map.path||' 一 '}</span>
                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.podPort')}</span> : {map.port||' 一 '}
            </span>
        )
    },
    PersistentVolumeClaim:function(map){
        map || (map = {name:' - ',type:' - '});
        return (
            <span>
                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.podName')}</span> : <span className="label_name overflow-text">{map.name||' 一 '}</span>
                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.podType')}</span> : <span className="label_pod overflow-text">{map.type||' 一 '}</span>
            </span>
        )
    },
    default:function(map){
        let labels = '',labels_keys = '';
        if(map.labels){
            labels = getLabels(map.labels);
            labels_keys = Object.keys(map.labels).join(',')
        }
        return (
            <span>
                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.podName')}</span> : <span className="label_name overflow-text">{map.name}</span>
                <span className="MuiTypography-root MuiTypography-body2">{intl.get('services.component.podNode')}</span> : <span className="label_pod overflow-text">{map.nodeName||' 一 '}</span>
                {
                    labels && (
                        <>
                            <span className="MuiTypography-body2">{intl.get('services.component.podEnv')}</span> : <Tooltip title={labels} interactive={true}><span className="overflow-text" style={{width:'300px',display:'inline-block'}}>{labels_keys}</span></Tooltip>
                        </>
                    )
                }
            </span>
        )
    }
}

export default Index;
