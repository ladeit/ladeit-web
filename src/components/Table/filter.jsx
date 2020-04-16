import React from 'react';
import ReactDOM from 'react-dom';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import FilterListIcon from '@material-ui/icons/FilterList';

export default function index(props){

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    function triggerPopover(event){
        let open_val = !open;
        let open_el = open ? '' : event.target;
        setOpen(open_val);
        setAnchorEl(open_el);
    }
    //
    return (
        <React.Fragment>
            <IconButton onClick={triggerPopover}>
                <FilterListIcon />
            </IconButton>
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
                {props.children}
            </Popover>
        </React.Fragment>
    )
}
