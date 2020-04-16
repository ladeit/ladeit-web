import React from 'react';
import ReactDOM from 'react-dom';
import {
    withStyles,Typography,IconButton,Divider,
    Paper,CardContent,Grid
} from '@material-ui/core';

const styles = theme => ({
    paper:{
        padding: '16px',
        lineHeight: '30px'
    },
    label:{
        width:'100px',
        display:'inline-block',
    },
    value:{
        display:'inline-block'
    }
})

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
    }

    componentDidMount(){
    }

    render(){
        const { classes,data } = this.props;
        //
        return (
            <React.Fragment>
                <Paper className={classes.paper}>
                    <Grid container spacing={1}>
                        {
                            data.map((v)=>{
                                return (
                                    <Grid item xs={4}>
                                        <span className={classes.label}>{v.label}:</span>
                                        <span className={classes.value}>{v.value}</span>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Paper>
            </React.Fragment>
        )
    }
}

export default Index;
