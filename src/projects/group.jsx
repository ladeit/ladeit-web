import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import {
    withStyles,Typography,Button,IconButton,Divider,
    Paper
} from '@material-ui/core';

const styles = theme => ({
    root:{
        height:'1000px !important',
        padding:'16px 24px'
    },
    bg:{
        width:'100%',
        height:'100%',
        backgroundColor:'#fbfcfe'
    },
    header:{
        textAlign:'right',
        padding:'8px 0'
    },
    group:{
        width:'770px',
        margin:'0 auto',
        '& .title':{
            lineHeight:'26px',
            padding:'0 8px',
            fontSize:'.8rem',
            fontWeight: '600',
            color:'white',
            background:'#0071fb',
            borderTopLeftRadius:'4px',
            borderTopRightRadius:'4px',
            display:"inline-block"
        },
        '& .content':{
            lineHeight:'30px',
            padding:'16px 24px',
            border:'1px solid #0071fb',
            '&>div':{
                height:'60px',
            }
        },
        '& .row_text':{lineHeight:'28px',fontSize:'1rem'},
        '& .cell_icon':{width:'50px',textAlign:'center'},
        '& .cell_name':{width:'250px'},
        '& .cell_statu1':{width:'80px',textAlign:'center'},
        '& .cell_statu2':{width:'80px',textAlign:'center'},
        '& .cell_statu3':{width:'80px',textAlign:'center'},
        '& .cell_statu4':{width:'80px',textAlign:'center'}
    }
});

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        //
    }

    componentDidMount(){
        //
    }

    render = ()=>{
        const { classes } = this.props;
        return (
            <div className={clsx(classes.bg,classes.root)}>
                <div className={classes.group}>
                    <div className="title">Recomended</div>
                    <Paper className="content">
                        <div className="flex-r">
                            <div className="flex-one">
                                <div className="cell_icon overflow-text">
                                </div>
                            </div>
                            <div className="flex-one">
                                <div className="cell_name overflow-text">
                                    <Typography variant="h5" className="row_text">buzzy-web</Typography>
                                    <div className="row_text">
                                        <a>holding</a>
                                    </div>
                                </div>
                            </div>
                            <Divider light={true} orientation={'vertical'} />
                            <div className="flex-one">
                                <div className="cell_statu1 overflow-text">
                                    <Typography variant="body2" className="row_text">1 year</Typography>
                                    <div className="row_text">-7,5%</div>
                                </div>
                            </div>
                            <Divider light={true} orientation={'vertical'} />
                            <div className="flex-one">
                                <div className="cell_statu2 overflow-text">
                                    <Typography variant="body2" className="row_text">3 year</Typography>
                                    <div className="row_text">-7,5%</div>
                                </div>
                            </div>
                            <Divider light={true} orientation={'vertical'} />
                            <div className="flex-one">
                                <div className="cell_statu3 overflow-text">
                                    <Typography variant="body2" className="row_text">4 year</Typography>
                                    <div className="row_text">-7,5%</div>
                                </div>
                            </div>
                            <Divider light={true} orientation={'vertical'} />
                            <div className="flex-one">
                                <div className="cell_statu4 overflow-text">
                                    <Typography variant="body2" className="row_text">Cost</Typography>
                                    <div className="row_text">-7,5%</div>
                                </div>
                            </div>
                            <Divider light={true} orientation={'vertical'} />
                            <div className="flex-box flex-right">
                                <div className="cell_action">
                                    <Button variant="outlined" color="primary" size="small">Views</Button>
                                </div>
                            </div>
                        </div>
                    </Paper>
                </div>
            </div>
        )
    }
}

export default Index;




