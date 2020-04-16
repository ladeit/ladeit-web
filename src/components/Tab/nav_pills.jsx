import React from 'react';
import clsx from 'clsx';
import {
    withStyles,Typography,Paper
} from '@material-ui/core';

class Index extends React.PureComponent {
    componentWillMount(){
        this.tabData = this.props.data||[];
        this.tabActive = this.props.active||0;
        this.onTab = this.props.onTab||(function(){return true})
    }

    componentDidMount(){
        this.initState();
        this.onActive(this.tabActive)
    }

    initState(){
        let sc = this;
        let tabData = this.tabData;
        sc.state.tabWidth = Math.floor(sc.refs.$box.offsetWidth / tabData.length);
    }

    state = {
        tabWidth:'',
        tabActive:''
    }

    onActive = (num)=>{
        if(this.onTab(num)){
            this.setState({tabActive:num});
        }
    }

    render(){
        const sc = this;
        const { classes,className } = this.props;
        const { tabActive,tabWidth } = this.state;
        const tabData = this.tabData;
        const liW = Math.floor(10000/tabData.length)/100 + '%';
        const itemShow = tabData[tabActive];
        //
        return (
            <div className={clsx(classes.root,className)} ref="$box" >
                <ul className={classes.ul}>
                    {
                        tabData.map(function (v,index) {
                            return (
                                <li className={classes.li} style={{width:liW}}>
                                    <a onClick={()=>{sc.onActive(index)}}>{v.text}</a>
                                </li>
                            )
                        })
                    }
                </ul>
                {
                    itemShow && (
                        <div className="moving-tab" style={{width:`${tabWidth+16}px`,transform:`translate3d(${tabActive*tabWidth - 8}px, 0px, 0px)`}}>
                            { itemShow.text }
                        </div>
                    )
                }
            </div>
        )
    }
}


const styles = theme => ({
    root:{
        position:'relative',
        "& .moving-tab":{
            position: 'absolute',
            textAlign: 'center',
            padding: '12px',
            fontSize: '12px',
            textTransform: 'uppercase',
            WebkitFontSmoothing: "subpixel-antialiased",
            backgroundColor: '#00bcd4',
            top: '-2px',
            left: "0px",
            transition: 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1) 0s',
            borderRadius: '4px',
            color: "#FFFFFF",
            cursor: "pointer",
            fontWeight: 500,
            boxShadow: '0 16px 26px -10px rgba(0, 188, 212, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 188, 212, 0.2)',
        }
    },
    ul:{
        margin:0,
        padding:0,
        backgroundColor: 'rgba(200, 200, 200, 0.2)'
    },
    li:{
        listStyle:'none',
        textAlign:'center',
        display:'inline-block',
        '& a':{
            cursor:'pointer',
            position:'relative',
            padding:'10px 15px',
            display:'block',
            border:'0 !important',
            borderRadius: 0,
            lineHeight: '18px',
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 500,
            minWidth: '100px',
            textAlign: 'center',
            color: '#555555 !important'
        }
    }
})

export default withStyles(styles)(Index);
