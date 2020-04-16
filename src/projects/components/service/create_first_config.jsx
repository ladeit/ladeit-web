import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,observer,inject} from "mobx-react"
import { withStyles,Typography,Divider } from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import DL from '@/static/store/CLUSTER_ADD.js'
import intl from 'react-intl-universal'

const style = theme => ({
})

@withStyles(style)
class Index extends React.PureComponent {

    componentWillMount(){
        this.config = DL.config();
    }

    state = {}

    clickListItem(v){
        const sc = this;
        let config = this.config.createService;
        return ()=>{
            if(v.key != config.type){
                config.type = v.key;
                config.render();
                sc.forceUpdate();
            }
        }
    }

    getList = ()=>{
        let typeConfig = this.config.createType;
        let res = [//TODO 弃用， 1，2，走此流程
            {key:1,text:intl.get('services.createCfg.configDefault'),memo:''},
            {key:2,text:intl.get('services.createCfg.configAuto'),memo:''}
        ]
        switch (typeConfig.type){
            case -1:
                res = [
                    {key:1,text:intl.get('services.createCfg.configDefault'),memo:''},
                    {key:2,text:intl.get('services.createCfg.configImport'),memo:''}
                ]
                break;
            default:
                break;
        }
        return res;
    }

    render = ()=>{
        const { list } = this.state;
        let { classes,serviceData } = this.props;
        let config = this.config.createService;
        let data = this.getList();

        return (
            <div className={classes.content} >
                {
                    data.map((v) =>{
                        let active = v.key == config.type;
                        return <Icons.ItemT title={v.text} content={v.memo} active={active} onClick={this.clickListItem(v)}/>
                    })
                }
            </div>
        )
    }
}

export default Index;
