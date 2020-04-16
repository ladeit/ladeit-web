import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import Icons from 'components/Icons/icons'
import Inputs from 'components/Form/inputs'
//
import SubjectIcon from '@material-ui/icons/Subject';
//
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import NativeSelect from '@material-ui/core/NativeSelect';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

//[
//             {
//                 name:'buzzy-git-ms-5662',
//                 children:[
//                     {
//                         name:'buzzy-git-ms-5662-75c9f677c9-g5wgp',
//                         children:[
//                             {name:'buzzy-git-ms'},
//                             {name:'istio-proxy'}
//                         ]
//                     }
//                 ]classes
//           }
//]

const useStyles = makeStyles(theme =>({
    filter:{
        padding:'16px 24px',
        '&>div':{
            width:'120px',
            padding:'0'
        }
    },
    row1:{
        '& span':{
            color:'#94a4ab'
        }
    },
    row2:{
        paddingLeft:'24px',
        '& span':{
            color:'#94a4ab'
        }
    },
    row3:{
        paddingLeft:'48px'
    }
}));

export default function(props){
    const classes = useStyles();
    const list = props.data;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    //
    function rowHtml(){
        let arr = [];
        list.map(function (v1) {
            arr.push(rowText(v1.name,{className:classes.row1}));
            if(v1.children){
                v1.children.map(function (v2) {
                    arr.push(rowText(v2.name,{className:classes.row2}));
                    if(v2.children){
                        v2.children.map(function (v3) {
                            arr.push(rowText(v3.name,{
                                className:classes.row3,
                                button:true,
                                onClick:clickRow({deploy:v1.name,pod:v2.name,container:v3.name,action:v3.name})
                            }));
                        })
                    }
                })
            }
        })
        return arr;
    }

    function clickRow(data){
        return ()=>{
            props.onChange(data);
            //
            setOpen(false);
            setAnchorEl(null);
        }
    }

    function triggerPopover(event){
        let open_val = !open;
        let open_el = open ? '' : event.target;
        setOpen(open_val);
        setAnchorEl(open_el);
    }

    return (
        <React.Fragment>
            <IconButton size="small" onClick={triggerPopover}>
                <SubjectIcon />
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
                <List dense={true}>
                    {rowHtml()}
                </List>
            </Popover>
        </React.Fragment>
    )

}

function rowText(text,props){
    return (
        <ListItem {...props}>
            <ListItemText primary={text} />
        </ListItem>
    )
}