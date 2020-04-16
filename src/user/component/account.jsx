import React from 'react';
import {
    AttachFile
} from '@material-ui/icons'
import {
    withStyles,Typography,Button,IconButton,Divider,TextField,
    Card,CardHeader,CardContent,
    DialogTitle,DialogContent,DialogActions,
    Avatar
} from '@material-ui/core';
import Inputs from 'components/Form/inputs.jsx'
import Component from '@/Component.jsx'
import Icons from 'components/Icons/icons.jsx'
import ConfirmPassword from './ConfirmPassword.jsx'
import intl from 'react-intl-universal'
// template
import CustomFileInput from "components/CustomFileInput/CustomFileInput.js";

const styles = theme => ({
    root:{
        paddingBottom:'80px'
    },
    card:{
        display:'flex',
        '& .header':{
            width:'300px',
            alignItems:'flex-start'
        },
        '& .content':{
            flex:1
        }
    },
    delUser:{
        color:'white',
        backgroundColor:'#ed462f'
    }
});

@withStyles(styles)
class Index extends Component{

    componentWillMount(){
    }

    state = {}

    clickDel = ()=>{
        const sc = this;
        const user = window.Store.global.user;
        sc.refs.$del.setState({open:true,title:intl.get('user.tipsDeleteTitle'),text:user.username,disabled:true})
    }

    clickDel_ok = ()=>{

    }

    render(){
        const { classes } = this.props;
        const params = this.params;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <div className="header">
                        <CardHeader
                            title={<Typography variant="h4" compoonent="b" ><span className="danger">Logout</span></Typography>}
                        />
                    </div>
                    <CardContent className="content">
                        <Button variant="contained" className="danger_button" onClick={()=>{this.clickDel()}} >{intl.get('user.tipsDeleteTitle')}</Button>
                    </CardContent>
                </Card>
                <ConfirmPassword ref="$del" onOk={this.clickDel_ok}/>
            </div>
        )
    }
}

export default Index;
