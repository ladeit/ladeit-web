import React from 'react';
import Inputs from 'components/Form/inputs.jsx'
import Icons from 'components/Icons/icons.jsx'
import {Button, Paper, withStyles} from "@material-ui/core";
import intl from 'react-intl-universal'
import Service from './Service'
import {
    VisibilityOff as VisibilityOffIcon,
    Visibility as VisibilityIcon,
} from "@material-ui/icons";

const styles = theme => ({
    root:{
        width:'40rem',
        fontSize: '1.3rem',
        lineHeight: '2rem',
        padding:'24px 32px',
        transform:'translateX(-20rem)',
        position:'absolute',
        left:'50%',
        top:'10rem'
    }
})

@withStyles(styles)
class Index extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            form:[
                {name:'newPassword', inputProps:{type:'text',placeholder:intl.get("login.password")}},
            ],
        }
    }

    handleSubmit = ()=>{
        let data = this.refs.$form.getData();
        data.username = 'admin';
        Service.adminPassword(data,(res)=>{
            History.push('/login')
        })
    }

    render(){
        const { classes } = this.props;
        const { form } = this.state;
        return (
            <Paper className={classes.root} elevation="1">
                The first deployment of the system requires initialization of the  <span className="danger"> admin </span>  password :
                <Inputs.Form data={form} size={12} ref="$form"/>
                <Button className="fr" color="primary" variant="contained" onClick={this.handleSubmit} >{intl.get('save')}</Button>
            </Paper>
        )
    }
}

export default Index;
