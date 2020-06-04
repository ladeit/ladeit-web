import React from "react";
import clsx from "clsx";
import {ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon} from "@material-ui/icons";
import AuthFilter from '@/AuthFilter.jsx'
import intl from "react-intl-universal";
import _ from "lodash";
import {
    withStyles,Button,Paper,Typography,Grid,IconButton,Tooltip,Divider
} from '@material-ui/core';
import CreatePipe from "../../projects/components/group/pod_pipe";
//
const styles = theme => ({
    pipeChart_left:{
        '&>div':{
            transform:'translateX(24px)'
        }
    },
    pipeChart_right:{
        '& .MuiButton-root':{
            width:'46px'
        },
    },
    operation:{
        '& .icon':{
            fontSize:'3rem'
        }
    }
})

@withStyles(styles)
@AuthFilter
class Index extends React.PureComponent {
    componentWillMount() {
        const { service } = this.props;
        this.state.service = service;
        this.state.pod = service.podCount || {SUM:0};
        this.state.pod._pod = this.state.pod.SUM;
        this.renderPipe = _.debounce(renderPipe(this.state.pod));
    }

    componentDidMount(){
        this.renderPipe();
    }

    state = {
        service:{},
    }

    render(){
        const { classes,className,service,...props } = this.props;
        return (
            <div className={clsx('flex-r','flex-center',className)} {...props}>
                <div className={clsx('flex-box',classes.pipeChart_left)}>
                    <div id="clusterPipeChart" ></div>
                </div>
            </div>
        )
    }
}

export default Index;


function renderPipe(data){
    const html =  `<div class="g2-guide-html">
                         <p class="g2_title">pod</p>
                         <p class="g2_value">${data._pod}</p>
                     </div>`
    return ()=>{
        CreatePipe('clusterPipeChart',data,html,{});
    }
}