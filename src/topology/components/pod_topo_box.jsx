import React from 'react';
import clsx from 'clsx';
import {
    withStyles,Typography,Paper,IconButton,Divider,
    Grid,TextField
} from '@material-ui/core';

const styles = theme =>({
    info:{
        width:'380px',
        margin:'8px',
        padding:'15px 20px 10px',
        '& .divider':{
            backgroundColor:'#e8e8e8'
        },
        '& .text':{
            maxWidth:'65px',
            float:'right',
            fontWeight:600
        },
        '& .button':{
            float:'right',
            fontWeight:600
        },
        '& .toolbar':{
            height:'30px'
        },
        '& .link1':{
            padding:'0 3px',
            transition: 'transform .3s',
            fontWeight:600,
            display: 'inline-block'
        },
        '& .link1:hover':{
            transform:"translate3d(0, 1px, 0)"
        }
    },
})


@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        //
    }

    render(){
        const { classes,className } = this.props;
        return (
            <div className={clsx('diagram_info',classes.info,className)}>
                <Typography component="b">服务详情</Typography>
                <br/><br/>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className={classes.input}>
                            <TextField fullWidth label="版本" value="V 3.0.1" variant="outlined" readonly/>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.input}>
                            <TextField fullWidth label="操作人" value="Mr Ladeit" variant="outlined" readonly/>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.input}>
                            <TextField fullWidth label="pod数" value="4" variant="outlined" readonly/>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.input}>
                            <TextField fullWidth label="规则" value="yaml" variant="outlined" readonly/>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Index;
