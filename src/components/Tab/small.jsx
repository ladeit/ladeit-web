import React from 'react'
import clsx from 'clsx'
import {ArrowForwardIos as ArrowForwardIosIcon} from '@material-ui/icons'
import { withStyles,Tabs,Tab } from '@material-ui/core'

const styles = theme => ({
    root: {}
});

const AntTabs = withStyles({
    root: {
        minHeight:"35px",
        borderBottom: '1px solid #e8e8e8',
        "& .MuiTabs-scroller":{
            height:"35px",
        }
    },
    indicator: {
        backgroundColor: '#1890ff'
    },
    flexContainer:{
    }
})(Tabs);

const AntTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        minWidth: 16,
        minHeight: "30px",
        marginRight: 0,
        fontWeight: theme.typography.fontWeightRegular,
        //'&:not(:last-child)':{
        //    borderRight:'1px solid #ddd',
        //},
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&$selected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#40a9ff',
        },
        "&.Mui-disabled":{
            padding:0
        }
    },
    selected: {},
}))(props => <Tab disableRipple {...props} />);



class Index extends React.PureComponent {

    render() {
        const {classes,className,data,...props} = this.props;
        let list = data || [{value:'',label:'设置'}]
        return (
            <AntTabs
                className={clsx("AntTabs",className)}
                onChange={props.onChange}
                value={props.tabValue}
                indicatorColor="primary"
                textColor="primary"
                size="small"
            >
                {
                    list.map((v,i)=>{
                        return <AntTab value={v.value} label={v.label} key={i}/>
                    })
                }
            </AntTabs>
        )
    }
}

export default withStyles(styles)(Index);
