import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    index:{
        color:'white',
        margin:"0 16px",
        '&:before':{
            display:'none'
        },
        '& .MuiSelect-icon':{
            color:'white'
        }
    },
    login:{
        float: "right",
        '&:before':{
            display:'none'
        }
    }
}));
//
export default function (props) {
    let language = _.local('language');
    let classes = useStyles();
    //
    const [lan, setLan] = React.useState(language);
    const changeLan = (e)=>{
        let language = e.target.value;
        setLan(language);
        //
        window.setI18n(language);
        props.callback && props.callback({language:language});
    }

    return (
        <Select
            className={clsx(classes[props.className])}
            value={lan}
            onChange={changeLan}
        >
            <MenuItem value="zh-CN" > 中文 </MenuItem>
            <MenuItem value="en-US" > en </MenuItem>
        </Select>
    )
}
