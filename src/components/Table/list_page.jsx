import React from 'react';
import clsx from 'clsx'
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles'
import Typography  from '@material-ui/core/Typography'
import IconButton  from '@material-ui/core/IconButton'
import Fab  from '@material-ui/core/Fab'
//
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

const styles = theme => ({
    root:{
        '& .number':{
            width:'14px',
            fontSize:'14px',
            textAlign:'center',
            display:'inline-block'
        }
    }
})

const range = 3;
const setPage = function(p){
    p.pageNum<1 && (p.pageNum = 1)
    p.pageNum>p.pageCount && (p.pageNum = p.pageCount)
    //
    let offset = (range - 1) / 2;
    let startPage = p.pageNum - offset;
    let endPage = p.pageNum + offset;
    if(p.pageCount>offset*2){
        let reOffset = 0;
        if(startPage<1){
            reOffset = 1 - startPage;
        }else if(endPage > p.pageCount){
            reOffset = p.pageCount - endPage;
        }
        startPage += reOffset;
        endPage += reOffset;
    }else{
        startPage = 1;
        endPage = p.pageCount;
    }
    p.pageStart = startPage;
    p.pageEnd = endPage;
    return p;
}

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){// pageNum,pageSize,count
        const { classes,className,renderData,pagination } = this.props;
        let p = _.extend({},pagination)
        p.count = p.totalRecord;
        p.pageCount = Math.ceil(p.count / p.pageSize);
        this.state.pagination = setPage(p,3);
        this.renderData = renderData || function(){}
    }

    componentDidMount(){}

    state = {
        pagination:{
            pageNum:1,
            pageStart:1,
            pageEnd:1,
            pageSize:20,
            pageCount:1,
            count:0
        }
    }

    clickFirst = () => {
        let p = this.state.pagination;
        p.pageNum = 1;
        this.state.pagination = setPage(p)
        this.forceUpdate()
        this.renderData(p)
    }

    clickLast = () => {
        let p = this.state.pagination;
        p.pageNum = p.pageCount;
        this.state.pagination = setPage(p)
        this.forceUpdate()
        this.renderData(p)
    }

    clickNext = () => {
        let p = this.state.pagination;
        p.pageNum = p.pageNum + 1;
        this.state.pagination = setPage(p)
        this.forceUpdate()
        this.renderData(p)
    }

    clickPre = () => {
        let p = this.state.pagination;
        p.pageNum = p.pageNum - 1;
        this.state.pagination = setPage(p)
        this.forceUpdate()
        this.renderData(p)
    }

    clickPage = (num) => {
        const sc = this;
        return ()=>{
            let p = sc.state.pagination;
            p.pageNum = num;
            sc.state.pagination = setPage(p)
            sc.forceUpdate()
            sc.renderData(p)
        }
    }

    htmlNum(){
        const p = this.state.pagination;
        let res = [];
        for(let i= p.pageStart;i<= p.pageEnd;i++){
            if(i==p.pageNum){
                res.push(<Fab size="small" color="secondary" key={i}><span className="number">{i}</span></Fab>)
            }else{
                res.push(<IconButton onClick={this.clickPage(i)} key={i}><span className="number">{i}</span></IconButton>)
            }
        }
        return res;
    }

    render(){
        const { classes,className } = this.props;
        const p = this.state.pagination;
        //
        // return (
        //     <div className={clsx("flex-center1",className,classes.root)}>
        //         <IconButton onClick={this.clickFirst} disabled={p.pageStart == 1}><FirstPageIcon /></IconButton>
        //         <IconButton onClick={this.clickPre} disabled={p.pageNum == 1}><ChevronLeftIcon /></IconButton>
        //         {this.htmlNum()}
        //         <IconButton onClick={this.clickNext} disabled={p.pageNum == p.pageCount}><ChevronRightIcon /></IconButton>
        //         <IconButton onClick={this.clickLast} disabled={p.pageEnd == p.pageCount}><LastPageIcon /></IconButton>
        //     </div>
        // )

        return (
            <div className={clsx("flex-center1",className,classes.root)}>
                <IconButton onClick={this.clickPre} disabled={p.pageNum == 1}><ChevronLeftIcon /></IconButton>
                {
                    p.pageStart != 1 && (<IconButton onClick={this.clickPage(1)}><span className="number">1</span></IconButton>)
                }
                { p.pageStart > 2 && '...'}
                {this.htmlNum()}
                { p.pageEnd < p.pageCount-2 && '...'}
                {
                    p.pageEnd < p.pageCount && (<IconButton onClick={this.clickPage(p.pageCount)}><span className="number">{p.pageCount}</span></IconButton>)
                }
                <IconButton onClick={this.clickNext} disabled={p.pageNum == p.pageCount}><ChevronRightIcon /></IconButton>
            </div>
        )
    }
}

export default Index;
