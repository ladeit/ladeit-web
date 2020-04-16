import React from 'react';
import {inject,observer} from 'mobx-react';
import GetAppIcon from '@material-ui/icons/GetApp';
import DescriptionIcon from '@material-ui/icons/Description';
import {
    withStyles,Typography,Button,IconButton,Paper,List,ListItem,ListItemIcon,ListItemText,ListItemSecondaryAction,Checkbox
} from '@material-ui/core'
import Icons from '@/components/Icons/icons.jsx'
import Moment from 'moment'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import project from "../../static/store/project";
import YamlEditT from "../../cluster/component/yamlEdit";
import AuthFilter from '@/AuthFilter'

const styles = theme => ({
    root:{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        margin: '-16px -24px',
        padding: '16px 24px',
        position: 'absolute',
    }
})

@withStyles(styles)
@inject("store")
@observer
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){
        this.loadData();
    }

    loadData = ()=>{
        const {store} = this.props;
        const p = this.params;
        store.project.ajaxYaml({groupName:p._group,serviceName:p._name});
    }

    loadDataMore = ()=>{
        const {store} = this.props;
        store.project.ajaxYamlMore();
    }

    downloadYaml = (i)=>{
        let {store} = this.props;
        let records = store.project.yamlMap.records;
        let index = i || this.state.selects[0];
        let one = records[index];
        _.download({url:`/api/v1/yaml/download?YamlId=${one.id}`,fileName:`${one.name}.zip`})
    }

    findYaml = ()=>{
        let {store} = this.props;
        let records = store.project.yamlMap.records;
        let index = this.state.selects[0];
        let one = records[index];
        this.refs.$yaml.onOpen({},one.content);
    }

    state = {
        selects:[]
    }

    selectItem(index){
        return ()=>{
            let list = this.state.selects;
            let pos = list.indexOf(index);
            if(pos==-1){
                //list.push(index);
                list = [index];
            }else{
                list.splice(pos,1);
            }
            this.setState({selects:[...list]});
        }
    }

    clickDownload(index){
        const sc = this;
        return ()=>{
            sc.downloadYaml(index);
        }
    }

    render(){
        let sc = this;
        let {classes,store} = this.props;
        let {selects} = this.state;
        let params = this.params;
        let map = store.project.yamlMap;
        let moreButton = <div className="flex-center split"><div className="buttonMore"><Button color="primary" size="small" onClick={this.loadDataMore} >more</Button></div></div>;
        let listFooter = map.loaded ? (map.records.length>0 ? ( map.totalPage>map.pageNum?moreButton:'' ) : <Icons.NodataT />) : <Icons.Loading />
        // console.log(map)
        return (
            <Layout
                crumbList={[{text:params._group,url:`/group/${params._group}`},{text:'Topology'}]}
                crumbFooter={
                    <>
                        <Button color="primary" disabled={selects.length<1} startIcon={<GetAppIcon />} style={{marginLeft:'32px'}} onClick={()=>{this.downloadYaml()}}>下载</Button>
                        <Button color="primary" disabled={selects.length<1} startIcon={<DescriptionIcon />} style={{marginLeft:'16px'}} onClick={()=>{this.findYaml()}}>查看</Button>
                    </>
                }
                menuT={<MenuLayout type="service" params={params} />}
                contentT={
                    <>
                        <List className={classes.root}>
                            {
                                map.records.map(function (one,i) {
                                    let checked = selects.indexOf(i)>-1;
                                    return (
                                        <Paper>
                                            <ListItem key={i} role={undefined} dense button onClick={sc.selectItem(i)}>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={checked}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{'aria-labelledby': 'id'}}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText primary={one.name}/>
                                                <ListItemText primary={one.type}/>
                                                <ListItemText primary={Moment(one.createAt).format('YYYY.MM.DD')}/>
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="comments" onClick={sc.clickDownload(i)}>
                                                        <GetAppIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </Paper>
                                    )
                                })
                            }
                        </List>
                        {listFooter}
                        <YamlEditT ref="$yaml" title="查看"/>
                    </>
                } >
            </Layout>
        )
    }
}




export default Index;
