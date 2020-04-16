import React from 'react';
import clsx from 'clsx';
import {
    withStyles,Typography,Paper,IconButton,Divider,
} from '@material-ui/core';

const styles = theme =>({
    info:{
        width:'380px',
        margin:'8px',
        padding:'16px 20px 16px',
        '& .divider':{
            backgroundColor:'#e8e8e8'
        },
        '& .text':{
            maxWidth:'65px',
            float:'right',
            fontWeight:600
        },
        '& .label-text':{
            width:'80px'
        },
        '& .label':{
            width:'80px'
        },
        '& .button':{
            float:'right',
            fontWeight:600
        },
        '& .toolbar':{
            height:'50px',
            textAlign:'center'
        },
        '& .link1':{
            padding:'0 3px',
            transition: 'transform .3s',
            fontWeight:600,
            display: 'inline-block'
        },
        '& .link1:hover':{
            transform:"translate3d(0, 1px, 0)"
        }
    },
})


@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        this.handle = this.props.handle || function(){};
    }

    state = {}

    render(){
        const { classes,className,data } = this.props;
        //
        return (
            <div className={clsx("diagram_info",classes.info,classes.pod,className)}>
                <p>
                    <span className="label overflow-text">运行时长</span>: <span className="label-text overflow-text">1day</span>
                    <span className="label overflow-text">运行状态</span>: <span className="label-text overflow-text">正常</span>
                </p>
                <p>
                    <span className="label overflow-text">pod数</span>: <span className="label-text overflow-text">1/1</span>
                </p>
                <Divider className="divider"/>
                <div style={{lineHeight:'1.5rem'}} >
                    <p>若测试成功, 你可 :</p>
                    <span style={{paddingLeft:'2em',display:'inline-block'}}>
                        <span className="link1">滚动升级</span> 此版本至正式环境<br/>
                        部署此版本<span className="link1"> 绿色环境 </span>进行<span className="link1"> 蓝色发布 </span>通过<span className="link1"> ABTEST </span>进行更深度的用户试用.
                    </span>
                    <p>若测试失败, 你可 :</p>
                    <span style={{paddingLeft:'2em',display:'inline-block'}}>
                        <span className="link1" onClick={()=>{this.handle('delete')}}> 删除 </span> 此节点.
                    </span>
                </div>
            </div>
        )
    }
}

export default Index;
