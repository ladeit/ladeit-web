import React from 'react';
import { withStyles,Button } from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import DL from '@/static/store/CLUSTER_ADD.js'
import intl from 'react-intl-universal'

import FlowStrategyT from '../../topology/components/flowStrategy.jsx'

const styles = theme => ({
    button:{
        margin:'24px 32px'
    }
})

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        let { renderStep } = this.props;
        renderStep({type:'active'},'-');
        //
        this.config = DL.config();
        this.routeNode = getRoutePod(this.config);
    }

    componentDidMount(){}

    state = {}

    // 1、候选流量验证
    renderNextStep = ()=>{
        let dg = this.refs.$flow.dg;
        let { renderStep } = this.props;
        let result = dg.result();
        if(!result){// 异常
            return;
        }
        //
        if(result.host.length<1){
            window.Store.notice.add({type:'warning',text:intl.get('services.createCfg.tipsHost')})
            return;
        }
        if(!dg.hasPodLink({id:this.routeNode.id},true)){
            window.Store.notice.add({type:'warning',text:intl.get('services.createCfg.tipsCandidateFlow')})
            return;
        }
        //
        renderStep(false);
        this.config.createStrategy.flow = result;
    }

    render = ()=>{
        const { classes,serviceData } = this.props;
        return (
            <>
                <FlowStrategyT serviceData={serviceData} routeNode={this.routeNode} ref="$flow"/>
                <Button size="small" color="primary" variant="outlined" className={classes.button} onClick={this.renderNextStep}>{intl.get('nextStep')}</Button>
            </>
        )
    }
}

function getRoutePod(config){
    let cv = config.createVersion;
    return {
        id:'newpod',
        host:"",
        subset:cv.version
    }
}

export default Index;
