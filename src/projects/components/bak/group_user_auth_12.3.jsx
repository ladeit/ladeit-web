import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import {
    withStyles,Typography,Button,
    FormControl,FormHelperText,FormGroup,FormControlLabel,Checkbox,
    Paper
} from '@material-ui/core';
import Icons from '@/components/Icons/icons.jsx'
import Service from '../Service'

const styles = theme => ({
    root:{
        width:'490px',
        padding:'32px 40px',
    },
    paper:{
        padding:'16px 24px',
        marginBottom:'24px',

        '& .form_row':{
            width:'100%'
        }
    }
})


@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){

    }

    componentDidMount(){

    }

    state = {
        roleChecked:{},
        roleList:[// maintainer / developer / reportor / guest
            {key:'owner',text:'owner'},
            {key:'maintainer',text:'maintainer'},
            {key:'reportor',text:'reportor'},
            {key:'guest',text:'guest'}
        ],
        projects:[
            {name:'buzzy-web'} //,{name:'buzzy-core'},{name:'buzzy-store'},{name:'buzzy-k8s'}
        ]
    }

    changeCheck(item,key){
        const sc = this;
        return ()=>{
            let {roleChecked} = sc.state;
            let _checked = roleChecked[item.name]||'';
            if(_checked.indexOf(key)>-1){
                roleChecked[item.name] = _checked.replace(key,'').replace(',,',',');
            }else{
                roleChecked[item.name] = _checked+','+key;
            }
            sc.state.roleChecked = roleChecked;
            sc.forceUpdate();
        }
    }

    render(){
        const { classes } = this.props;
        const { projects,roleChecked,roleList } = this.state;
        window.sc = this;
        return (
            <div className={classes.root}>

                {
                    projects.map((one)=>{
                        let _checked = roleChecked[one.name]||'';
                        return (
                            <Paper className={clsx(classes.paper)}>
                                <Typography variant="body2">服务 :</Typography>
                                <Typography variant="body1">{one.name}</Typography>
                                <br/>
                                <Typography variant="body2">授权 :</Typography>
                                {
                                    roleList.map((v)=>{
                                        return (
                                            <FormControl component="fieldset" >
                                                <FormControlLabel
                                                    control={
                                                      <Checkbox
                                                        checked={_checked.indexOf(v.key)>-1}
                                                        onChange={this.changeCheck(one,v.key)}
                                                        value={v.key}
                                                        color="primary"
                                                      />
                                                    }
                                                    label={v.text}
                                                />
                                                <FormHelperText style={{paddingLeft:'28px'}}>Product Designers to come aboard and help us build succesful businesses through software.</FormHelperText>
                                            </FormControl>
                                        )
                                    })
                                }
                                <div className="split">
                                    <Button variant="outlined" color="primary" size="small" >保存</Button>
                                </div>
                            </Paper>
                        )
                    })
                }
            </div>
        )
    }
}

export default Index;
