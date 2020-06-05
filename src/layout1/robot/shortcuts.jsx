import React from 'react';
import clsx from 'clsx';
import Service from '@/projects/Service';
import intl from 'react-intl-universal'
import Outgoing from '../../assets/svg/outgoing.svg'
import Outgoings from '../../assets/svg/outgoings.svg'

const iconShortcutsImg = {
    position: "relative",
    top: "5px",
    marginRight:'10px',
    cursor:'pointer',
    marginLeft:'16px',
    color:'white',
}
const root = {
    minWidth:'280px',
    padding:'4px',
    lineHeight:'100%',
    display:'inline-block',
    background: 'white',
    position: "relative",
    top: "5px",
    marginLeft:'16px',
}
const iconImg = {
    margin:'0 4px',
    cursor:'pointer',
    width:'16px'
}
class Index extends React.PureComponent {

    state = {
        showShortcuts:false,
        srcList:{
            baiduFavic:'https://www.baidu.com/',
            googleFavic:'https://www.google.com/'
        }
    }
    ShortcutsHandle = (url)=>{
        if(url){
            window.open(url,"_blank")
            return
        }
        this.setState({
            showShortcuts:!this.state.showShortcuts
        })
    }
    ErrorHandle = ()=>{
        let  srcList  = {...this.state.srcList};
        srcList.baiduFavic = `https://www.gravatar.com/avatar/${parseInt(Math.random()*100+1)}?d=retro`
        this.setState({
            srcList
        })
    }
    render(){
        let { showShortcuts,srcList } = this.state;
        return (
            <React.Fragment>
                { !showShortcuts ?
                    <img style={iconShortcutsImg} src={Outgoing} onClick={this.ShortcutsHandle.bind(this,'')}/>
                    :
                    <div style={root}>
                            <img  style={iconImg} src={Outgoings} onClick={this.ShortcutsHandle.bind(this,'')}/>
                            <img  style={iconImg} onError={this.ErrorHandle} src={srcList.baiduFavic+'favicon.ico'} onClick={this.ShortcutsHandle.bind(this,srcList.baiduFavic)}/>
                            <img  style={iconImg}  onError={this.ErrorHandle} src={srcList.googleFavic+'favicon.ico'} onClick={this.ShortcutsHandle.bind(this,srcList.googleFavic)}/>
                    </div>
                }   
            </React.Fragment>
        )
    }
}

export default Index;
