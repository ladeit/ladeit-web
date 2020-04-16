import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import {Provider,observer,inject} from "mobx-react"
import {
    withStyles,Typography,Divider,Button,IconButton,Paper,
    TextField
} from '@material-ui/core'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import DL from '@/static/store/CLUSTER_ADD.js'

const style = theme => ({
    paper:{
        padding:'16px 24px'
    },
    box:{
        width:"180px",
        lineHeight:'30px',
        '& .label':{
            width:'80px',
            lineHeight:'28px',
            padding:'8px 0'
        },
        '& .MuiTextField-root':{
            margin:0
        }
    },
    textField:{
        '& input':{
            textAlign:'right'
        }
    }
})

@inject('store')
@observer
@withStyles(style)
class Index extends React.PureComponent {
    componentWillMount(){
        let { renderStep} = this.props;
        renderStep(true,"-");
        //
        this.config = DL.config();
    }

    state = {
        flow:[
            {name:'V3.0.1',value:''},
            {name:'V3.1.1',value:''},
            {name:'V3.2.1',value:''},
            {name:'V3.12.1',value:''},
        ]
    }

    clickListItem(name,v){
        const sc = this;
        let { renderStep } = this.props;
        let config = this.config.createStrategy;
        return ()=>{
            config[name] = v.key;
            sc.forceUpdate();
        }
    }

    htmlTypeFlow(){
        const { classes } = this.props;
        const { flow } = this.state;
        return flow.map((v) => {
            return (
                <div className="flex-r">
                    <div className="flex-one overflow-text">
                        <Typography variant="h5" className="label">{v.name}</Typography>
                    </div>
                    <div className="flex-box">
                        <TextField
                            className={classes.textField}
                            type="number"
                            margin="normal"
                        />
                    </div>
                    <div className="flex-one">
                        %
                    </div>
                </div>
            )
        })
    }

    render(){
        const { flow,popover } = this.state;
        let { classes,serviceData } = this.props;
        let config = this.config.createStrategy;
        //
        return (
            <div className={classes.content} >
                <div className={classes.box} >
                    {config.flow==1 && this.htmlTypeFlow()}
                </div>
            </div>
        )
    }
}

export default Index;
