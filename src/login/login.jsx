import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import LoginJsx from './components/login_form'
import RegisterJsx from './components/register_form'

import {
    withStyles,Paper,Divider,Tabs,Tab
} from '@material-ui/core';

import Service from './Service'

const styles = theme => ({
    box:{
        position: 'fixed',
        width: '100%',
        height: '100%',
        boxSizing: "border-box",
        overflow: "auto",

        '& .logo':{
            width:'400px',
            marginTop:'-80px'
        },
        '& .login':{
            width:'500px',
            paddingTop:'180px',
            paddingRight:'140px'
        },
    },
})

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        let user = _.local('user')
        if(user.id){
            History.push('/')
        }else{
            this.validToGuide();
        }
    }

    state = {
        tabIndex:0
    }

    validToGuide(){
        Service.adminFirstLogin()
    }

    handleChange = (e,index)=>{
        this.setState({tabIndex:index});
    }

    render = ()=>{
        const { classes } = this.props;
        const { tabIndex } = this.state;
        return (
            <div className={clsx(classes.box,'flex-r')}>
                <div className="flex-box flex-center">
                    <img className="logo" src="/logo/cover.png" />
                </div>
                <div className="flex-one login">
                    <Paper>
                        <Tabs variant="fullWidth"  value={tabIndex} onChange={this.handleChange} aria-label="login">
                            <Tab label="Sign in" />
                            <Tab label="Register" />
                        </Tabs>
                        <Divider light={true}/>
                        { tabIndex == 0 && <LoginJsx /> }
                        { tabIndex == 1 && <RegisterJsx /> }
                    </Paper>
                </div>
            </div>
        )
    }
}

export default Index;
