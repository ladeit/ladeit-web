import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    index: {
        color: '#000',
        margin: "0 8px",
        '&:before': {
            display: 'none'
        },
        '& .MuiSelect-icon': {
            color: 'white'
        }
    },
    login: {
        float: "right",
        '&:before': {
            display: 'none'
        }
    }
}));

export default function (props) {
    let language = _.local('language');
    let classes = useStyles();
    const [lan, setLan] = React.useState(language);
    const changeLan = (value) => {
        let language = value;
        setLan(language);
        window.setI18n(language);
        props.callback && props.callback({ language: language });
    }
    const [isOpen, setOpen] = React.useState(false)

    return (
        <span onMouseEnter={() => { setOpen(true) }}>
            {!isOpen && <Select
                className={clsx(classes[props.className])}
                value={lan}
                open={isOpen}
                showArrow={false}
            >
                <MenuItem value="zh-CN"> 中文 </MenuItem>
                <MenuItem value="en-US"> en </MenuItem>
            </Select>}
            {isOpen &&
                <Select
                    className={clsx(classes[props.className])}
                    value={lan}
                    open={isOpen}
                    showArrow={false}
                >
                    <div onMouseLeave={() => {
                        setOpen(false)
                    }}>
                        <MenuItem value="zh-CN" onClick={changeLan.bind(this, 'zh-CN')}> 中文 </MenuItem>
                        <MenuItem value="en-US" onClick={changeLan.bind(this, 'en-US')}> en </MenuItem>
                    </div>
                </Select>}
        </span>
    )
}
