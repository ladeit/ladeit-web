import React,{ Component,PureComponent,useState,useEffect } from 'react';
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
//
import FormType from './form/input'

const styles = theme => ({
    root:{
        '& .MuiGrid-item':{
            paddingTop:0,
            paddingBottom:0
        }
    }
})

@withStyles(styles)
@formHOC
class Index extends PureComponent{
    componentWillMount(){
        this.options = _.extend({
            spacing:2,
            size:12
        },this.props.options);
        this.state.form = this.props.data;
    }

    state = {
        form:[],
        error:{}
    }

    renderInput(column){
        let html = [];
        switch (column.type) {
            default:
                html.push(<FormType.input column={column} key={column.name}></FormType.input>);
        }
        //
        return html;
    }

    render = ()=>{
        const sc = this;
        const { classes } = this.props;
        const { form } = this.props;
        const opt = this.options;
        return (
            <div ref="$form">
                <Grid container className={classes.root} spacing={opt.spacing}>
                    {
                        form.map(function (one,index) {
                            return <Grid item xs={opt.size} key={index}>{sc.renderInput(one)}</Grid>;
                        })
                    }
                </Grid>
            </div>
        )
    }
}

export default Index;

// function ： logic
function formHOC(WrappedComponent) {
    return class extends WrappedComponent {



        render(){
            return super.render()
        }
    }
}
