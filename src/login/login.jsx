import React from 'react';
import ReactDOM from 'react-dom';

import {
    withStyles,Paper
} from '@material-ui/core';

import LoginT from './components/login.jsx'

import BgImg from 'assets/img/bg2.jpg'

const styles = theme => ({
    box:{
        background:`url(${BgImg})`,
        position: 'fixed',
        width: '100%',
        height: '100%',
    },
    root:{
        margin:'0 auto'
    }
})

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        let user = _.local('user')
        if(user.id){
            History.push('/')
        }
    }

    componentDidMount(){
        //
    }

    render = ()=>{
        const { classes } = this.props;
        return (
            <div className={classes.box}>
                <LoginT className={classes.root} />
            </div>
        )
    }
}

export default Index;
