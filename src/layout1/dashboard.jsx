import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx'
import {observer,inject} from "mobx-react";
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

import TopBar from './TopBar.jsx';
import NavBar from './NavBar.jsx';

const styles = (theme) => ({
    container: {
        minHeight: '100vh',
        display: 'flex',
        '@media all and (-ms-high-contrast:none)': {
            height: 0 // IE11 fix
        }
    },
    content: {
        paddingTop: 64,
        flexGrow: 1,
        maxWidth: '100%',
        overflowX: 'hidden',
        '&.open':{
            paddingLeft:'180px'
        },
        '&>div':{
            height:'calc(100% - 51px)',
            padding:'16px 24px',
            position:'relative'
        }
    }
});

@inject('store')
@observer
@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){}

    componentDidMount(){}

    setOpenNavBarMobile(){
        const {store} = this.props;
        return ()=>{
            store.global.triggerMobileOpen();
        }
    }

    toUrl(url){
        const his = window.History;
        return ()=>{
            his.push(url);
        }
    }

    htmlCrumb(){
        const { crumbList,crumbFooter } = this.props;
        if(!crumbList){
            return;
        }
        return (
            <>
                <Breadcrumbs aria-label="breadcrumb" className="crumbs" >
                    {
                        crumbList.map((v,i)=>{
                            if(i==crumbList.length-1){
                                return <div className="flex-middle"><span className="black text" key={i}>{v.text}</span>{crumbFooter}</div>
                            }else if(v.url){
                                return <Link className="link1 text" color="inherit" onClick={this.toUrl(v.url)} key={i}>{v.text}</Link>
                            }else{
                                return <span className="black text" key={i}>{v.text}</span>
                            }
                        })
                    }
                </Breadcrumbs>
                <Divider light={true} />
            </>
        )
    }

    render(){
        const { classes,menuT,contentT,store } = this.props;
        return (
            <>
                <TopBar onOpenNavBarMobile={this.setOpenNavBarMobile(true)} />
                { menuT }
                <div className={classes.container}>
                    <div className={clsx(classes.content,menuT && 'open')}>
                        {this.htmlCrumb()}
                        <div>
                            { contentT }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Index;
