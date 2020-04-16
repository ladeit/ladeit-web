import React from 'react';
import ReactDOM from 'react-dom';
import { Link as RouterLink } from 'react-router-dom';
import {
    FilterList as FilterListIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Grid,Toolbar,Tooltip,FormControlLabel,IconButton,
    Switch
} from '@material-ui/core'

import Icons from '@/components/Icons/icons.jsx'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import FlowT from '@/topology/components/group_topo.jsx'
// template
import TableT from '@/components/Table/table.jsx'
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
    }
});


@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){
        this.loadGroup();
    }

    loadGroup(){
        const sc = this;
        let params = this.params;
        sc.setState({data_loaded:false})
        Service.groupListByName(params._group,(res)=>{
            let groupData = res[0];
            //sc.setState({data:list,data_loaded:true})
            sc.loadTopo(groupData.id);
        })
    }

    loadTopo(id){
        const sc = this;
        Service.groupTopo(id,function (res) {
            sc.setState({data_loaded:true,data:res.topologys.filter(function (v,i) {
                if(v){
                    v.id = i;
                    return true;
                }
            })})
        })
    }

    state = {
        data_loaded:false,
        data:[]
    }

    handleDense = event => {
        this.setState({dense:event.target.checked});
        this.$table.onDense(event.target.checked);
    }

    render = ()=>{
        const { classes } = this.props;
        const { data,data_loaded,dense,serviceDense,selects } = this.state;
        let params = this.params;
        let footer = data_loaded ? '' : <Icons.Loading />
        return (
            <Layout
                crumbList={[{text:params._group,url:`/group/${params._group}`},{text:'Topology'}]}
                menuT={<MenuLayout type="group" params={params} />}
                contentT={
                    <>
                        {data_loaded && <FlowT topo={data} />}
                        {footer}
                    </>
                }
            />
        )
    }
}

export default Index;
