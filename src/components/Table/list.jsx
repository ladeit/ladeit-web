import React from 'react';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import {
    withStyles,Typography,
    Table,TableBody,TableCell,TableHead,TableRow,
    Toolbar,Checkbox
} from '@material-ui/core';


const styles = theme => ({

})

//{ id: 'name', disablePadding: true, label: '名称',style:{width:'180px'} },
@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        const { data } = this.props;
        this.data = _.extend({
            rows:[],
            title:' ',
            key:'id'
        },data);
        this.handle = data.event || function(){}
    }

    state = {
        selects:[]
    }

    onSelectAllClick = ()=>{
        const { columns,rows,title,key } = this.data;
        const { selects } = this.state;
        let all = rows.length == selects.length;
        let res = [];
        if(all){
            //this.setState({selects:[]})
        }else{
            res = rows.map((v)=>{return v[key]});
        }
        this.setState({selects:res});
        this.handle('select',res)
    }

    onSelectClick = (v)=>{
        const { key } = this.data;
        const { selects } = this.state;
        let id = v[key];
        let index = selects.indexOf(id);
        if(index>-1){
            selects.splice(index,1)
        }else{
            selects.push(id);
        }
        this.setState({selects: [...selects]})
        this.handle('select',selects);
    }

    htmlToolbar(){
        const { classes } = this.props;
        const { columns,rows,title } = this.data;
        const { selects } = this.state;
        return (
            <Toolbar
                className={clsx(classes.root)}
            >
                <Typography variant="h5" style={{flex: '1 1 100%',}}>
                    {title}
                </Typography>
                <div className="flex-right">{selects.length}</div>
            </Toolbar>
        )
    }

    htmlHeader(){
        const { columns,rows } = this.data;
        const { selects } = this.state;
        return columns.map((v)=>{
            return <TableCell>{v.label}</TableCell>
        })
    }

    htmlContent(){
        const { columns,rows,key } = this.data;
        const { selects } = this.state;
        //
        return rows.map((v,i)=>{
            let checked = selects.indexOf(v[key])>-1;
            return (
                <TableRow selected={i%2>0?true:false} onClick={()=>{this.onSelectClick(v)}}>
                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={checked}
                            padding="default"
                            inputProps={{ 'aria-label': 'select row' }}
                        />
                    </TableCell>
                    {
                        columns.map((column)=>{
                            let value = column.render ? column.render(v,column) : v[column.id];
                            return <TableCell>{value}</TableCell>
                        })
                    }
                </TableRow>
            )
        })
    }

    render = ()=>{
        const { columns,rows,key } = this.data;
        const { selects } = this.state;
        let numSelected = selects.length;
        let rowsCount = rows.length;
        return (
            <>
                {this.htmlToolbar()}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={numSelected>0 && numSelected === rowsCount}
                                    onChange={this.onSelectAllClick}
                                    padding="default"
                                    inputProps={{ 'aria-label': 'select all desserts' }}
                                />
                            </TableCell>
                            {this.htmlHeader()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.htmlContent()}
                    </TableBody>
                </Table>
            </>
        )
    }
}

export default Index;
