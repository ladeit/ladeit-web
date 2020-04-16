import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';
import ClearIcon from '@material-ui/icons/Clear';
//
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Popover from '@material-ui/core/Popover';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme =>({
    filter:{
        padding:'16px 24px',
        '&>div':{
            width:'140px',
            padding:'8px'
        }
    }
}));

export default function index(props){
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState(props.form);
    const invisible = form[0].value || form[1].value;
    const selectChange = function (item) {
        return event => {
            item.value = event.target.value;
            setForm([...form])
            props.render(filterParam())
        }
    }
    const selectClear = function(){
        setForm(form.map(function (v) {
            v.value = '';
            return v;
        }))
        props.render(filterParam())
    }
    //
    function triggerPopover(event){
        let open_val = !open;
        let open_el = open ? '' : event.target;
        setOpen(open_val);
        setAnchorEl(open_el);
    }
    function filterParam(){
        let res = {};
        form.forEach(function (v) {
            res[v.name] = v.value;
        })
        return res;
    }
    //
    if(props.popover){
        return (
            <React.Fragment>
                <Badge color="error" variant="dot" invisible={!invisible}>
                    <IconButton size="small" onClick={triggerPopover}>
                        <FilterListIcon />
                    </IconButton>
                </Badge>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={()=>{setOpen(false)}}
                >
                    <div className={clsx(classes.filter,'flex-middle')}>
                        {
                            form.map(function(one){
                                return (
                                    <FormControl className={classes.formControl} variant="outlined">
                                        <NativeSelect
                                            value={one.value}
                                            className=""
                                            inputProps={{ 'aria-label': '' }}
                                            onChange={selectChange(one)}
                                        >
                                            {one.options.map(function (v) {
                                                return <option value={v.key}>{v.value}</option>
                                            })}
                                        </NativeSelect>
                                    </FormControl>
                                )
                            })
                        }
                        <IconButton size="medium"
                                    onClick={selectClear}
                                    onMouseEnter={iconRotate(true)}
                                    onMouseLeave={iconRotate(false)} >
                            <ClearIcon />
                        </IconButton>
                    </div>
                </Popover>
            </React.Fragment>
        )
    }else{
        return (
            <div className={clsx(classes.filter,'flex-middle')}>
                {
                    form.map(function(one){
                        return (
                            <FormControl className={classes.formControl} variant="outlined">
                                <NativeSelect
                                    value={one.value}
                                    className=""
                                    inputProps={{ 'aria-label': '' }}
                                    onChange={selectChange(one)}
                                >
                                    {one.options.map(function (v) {
                                        return <option value={v.key}>{v.value}</option>
                                    })}
                                </NativeSelect>
                            </FormControl>
                        )
                    })
                }
                <IconButton size="medium"
                            onClick={selectClear}
                            onMouseEnter={iconRotate(true)}
                            onMouseLeave={iconRotate(false)} >
                    <ClearIcon />
                </IconButton>
            </div>
        )
    }
}


function iconRotate(active){
    return (event)=>{
        if(active){
            event.target.classList.add('rotateIcon');
        }else{
            event.target.classList.remove('rotateIcon');
        }
    }
}