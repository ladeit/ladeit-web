import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,observer,inject} from "mobx-react"
import { withStyles,Typography,Divider,Button } from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import DL from '@/static/store/CLUSTER_ADD.js'
import intl from 'react-intl-universal'

const style = theme => ({
})

let nextFlow = {1:'CreateService_1',2:'CreateService_2',4:'CreateConfigurationNew',8:'CreateConfigurationNew'}

@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        let { renderStep } = this.props;
        renderStep({type:'active'},'-');
        //
        this.config = DL.config();
    }

    state = {
        list:[
            {key:1,text:intl.get('services.releaseType.1')},
            {key:2,text:intl.get('services.releaseType.2')},
            {key:4,text:intl.get('services.releaseType.4')},
            {key:8,text:intl.get('services.releaseType.8')}
        ]
    }

    clickListItem(v){
        const sc = this;
        let config = this.config.createType;
        let { renderStep } = this.props;
        return ()=>{
            if(v.key != config.type){
                config.type = v.key;
                sc.forceUpdate();
                renderStep(false,nextFlow[config.type])
            }
        }
    }

    render = ()=>{
        const { list } = this.state;
        let { classes,serviceData } = this.props;
        let config = this.config.createType;
        let noShow = serviceData.serviceType == '1' ? [1,2,4] : [];
        //
        return (
            <div className={classes.content}>
                <div>
                    {
                        list.map((v,i) =>{
                            let active = v.key == config.type;
                            if(noShow.indexOf(v.key)>-1){
                                return ''
                            }
                            return <Icons.ItemT title={v.text} active={active} onClick={this.clickListItem(v)} key={i}/>
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Index;
