import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const useSortStyles = makeStyles({
    box:{
        height:'21px',
        cursor:'pointer',
        display:'flex',
        alignItems:'center',
        '& .top':{
            flex:1
        },
        '& .bottom':{
            flex:1
        },
        '& .active':{
            color:'red'
        }
    }
})

const position = ['asc','desc',''];

export default function (props) {
    const text = props.text;
    const styles = useSortStyles();
    const handle = props.handle;
    let [order, setOrder] = React.useState(props.data);
    let clickSort = function () {
        let index = (position.indexOf(order)+1)%3;
        let val = position[index];
        setOrder(val);
        handle(val);
    };
    //
    return (
        <div className={styles.box} onClick={clickSort}>
            {text}
            {order=='asc' && <ArrowUpwardIcon />}
            {order=='desc' && <ArrowDownwardIcon />}
        </div>
    )
};
