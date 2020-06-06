import React from 'react';
import CreatePipe from "./pod_pipe";
import _ from 'lodash';
import {Popover, withStyles} from "@material-ui/core";
import PodJsx from './pod'

const styles = theme => ({
    pipeChart_small:{
        cursor:'pointer',
        '& p':{
            margin:0,
            textAlign:'center'
        },
        '& .g2_title':{
            color: "#8c8c8c",
            lineHeight:'1.7rem'
        },
        '& .g2_value':{
            fontSize:'1.6rem'
        }
    }
})

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        const { service } = this.props;
        this.id = `pipe_${((1 + Math.random()) * 0x10000000 | 0).toString(16)}`;
        this.state.service = service;
        this.state.pod = service.podStatus || {SUM:0};
        this.state.pod._pod = this.state.pod.SUM;
    }

    componentDidMount(){
        const sc = this;
        const pod = sc.state.pod;
        const html =  `<div class="g2-guide-html-small">
            <p class="g2_title">pod</p>
            <p class="g2_value">${pod._pod}</p>
        </div>`;
        CreatePipe(sc.id,pod,html,{height:80,legend:false});
    }

    state = {
        service:{},
        pod:{},
        authX:false,
        el:null
    }

    handlePopover(flag) {
        const sc = this;
        return (e) => {
            console.log("click-flag")
            let val = flag ? e.target : null;
            sc.setState({el:val});
        }
    }

    render(){
        const { classes,className,service,...props } = this.props;
        const { el } = this.state;
        return (
            <div>
                <div className={classes.pipeChart_small} id={this.id} {...props} onClick={this.handlePopover(true)}></div>
                <Popover
                    open={Boolean(el)}
                    anchorEl={el}
                    onClose={this.handlePopover(false)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    {el && <PodJsx service={service}  style={{width:'380px',padding:'24px 0 24px 16px'}} />}
                </Popover>
            </div>
        )
    }
}

export default Index;
