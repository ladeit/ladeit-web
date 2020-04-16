import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import {Provider,observer,inject} from "mobx-react"
import {
    Search as SearchIcon,
    Edit as EditIcon,
    ExpandMore as ExpandMoreIcon,
    Close as CloseIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Divider,Button,IconButton,Checkbox,Tooltip,
    Paper,CardHeader,CardContent,
    List,ListItem,ListItemIcon,ListItemText,ListItemSecondaryAction,
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import DL from '@/static/store/CLUSTER_ADD.js'
import YamlEditor from '@/cluster/component/yamlEdit.jsx'

import ClusterService from '@/cluster/Service'

const style = theme => ({
    subtitle:{
        lineHeight:'27px'
    }
})

@inject('store')
@observer
@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        this.config = DL.config();
        this.loadService();
    }

    state = {
        editYaml:{},
        //editViews:[],
        views_loaded:false,
        views:[],
        collapse:{},
        submitAble:false
    }

    loadService(){
        const sc = this;
        let config = sc.config.createService;
        sc.setState({views_loaded:false})
        ClusterService.clusterDetailMap({clusterId:config.cluster,namespace:config.namespace},(res)=>{
            let keys = Object.keys(res);
            let views = [];
            keys.map((key)=>{
                if(res[key] && res[key].length>0){
                    views.push({name:key,list:res[key]})
                }
            })
            sc.setState({views:views,views_loaded:true})
        })
    }

    validSubmitAble(){
        const sc = this;
        return sc.state.editViews.length<1;
    }

    toggleSelItem = (name)=>{
        let config = this.config.createService;
        let editViews = config.editViews;
        let index = editViews.indexOf(name);
        if(index>-1){
            editViews.splice(index,1)
        }else{
            editViews.push(name)
        }
        config.editViews = editViews;
        config.render();
        this.forceUpdate();
    }

    clickPodsYaml = (name,type)=>{
        const sc = this;
        let config = this.config.createService;
        return ()=>{
            const { editYaml } = sc.state;
            let yaml = editYaml[`${type}:${name}`];
            sc.refs.$yaml.onOpen({clusterId:config.cluster,namespace:config.namespace,type:type,name:name},yaml)
        }
    }

    clickPodsYaml_save(){
        const sc = this;
        let refs = this.refs;
        return ()=>{
            const $y = refs.$yaml;
            const {type,name} = $y.state;
            sc.state.editYaml[`${type}:${name}`] = $y.$editor.getValue();
            $y.onCancel();
        }
    }

    clickCollapse = (name)=>{
        const { collapse } = this.state;
        collapse[name] = !collapse[name];
        this.forceUpdate();
    }

    clickRow = (one,key)=>{
        let name = `${key}:${one.name}:${one.namespace||''}`
        this.toggleSelItem(name);
    }

    htmlRow(item){
        const sc = this;
        const editViews = this.config.createService.editViews;
        const list = item.list;
        const key  = item.name;
        return list.map((v,i)=>{
            let labelId = `create_service_${key}_${i}`
            let labelName = `${key}:${v.name}:${v.namespace||''}`
            let checked = editViews.indexOf(labelName) > -1;
            return (
                <>

                    <ListItem key={i} role={undefined} dense button onClick={()=>{sc.clickRow(v,key)}}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={checked}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={v.name} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="comments" onClick={sc.clickPodsYaml(v.name,key)}><EditIcon /></IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </>
            )
        })
    }



    render(){
        const { views,views_loaded,collapse,submitAble } = this.state;
        const config = this.config.createService;
        let { classes } = this.props;
        let list = filterViews(views,config.search);

        //
        return (
            <div className={classes.content} id="create_service">
                {
                    views_loaded && list.map((item,index)=>{
                        return (
                            <Paper className={clsx("list-info")} elevation={1} key={index} >
                                <CardHeader className="list-info-header" title={
                                    <div className="flex-r" onClick={()=>{this.clickCollapse(item.name)}}>
                                      <Typography variant="h4" className="flex-one" component="b">{item.name}</Typography>
                                      <Typography variant="body2" component="span" className={'flex-box views_label '+classes.subtitle}></Typography>
                                      <IconButton className="flex-one" size="small" ><ExpandMoreIcon className={collapse[item.name]?'active_icon':''}/></IconButton>
                                    </div>
                                  } >
                                </CardHeader>
                                <Divider light={true} />
                                <CardContent className={clsx("list-info-content",'hidden',collapse[item.name]?'active_content':'')}>
                                    <List>
                                        {this.htmlRow(item)}
                                    </List>
                                </CardContent>
                            </Paper>
                        )
                    })
                }
                { views_loaded || <Icons.Loading /> }
                <YamlEditor ref="$yaml" onOk={this.clickPodsYaml_save()}/>
            </div>
        )
    }
}

function filterViews(views,search){
    if(!(search && search.trim())){
        return views;
    }
    //
    let res = [];
    views.map((one)=>{
        let list = one.list.filter((v)=>{
            return v.name.indexOf(search)>-1;
        })
        if(list.length){
            res.push({
                name:one.name,
                list:list
            });
        }
    })
    return res;
}

export default Index;
