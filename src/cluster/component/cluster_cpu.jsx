import G2 from '@antv/g2';
import { DataSet } from '@antv/data-set';
import React from "react";
import _ from 'lodash'

const colors = [ '#67b7dc', '#84b761', '#fdd400', '#cc4748', '#cd82ad', '#2f4074', '#448e4d', '#b7b83f', '#b9783f' ];

function getPercentage(val){
    return Math.floor(Number(val) * 10000) / 100
}

function renderChart(id,row) {
    let colorIndex = 0;
    let data = [];
    let option = {occupyCpuReq:false,occupyCpuLimit:false,requestFree:0,limitFree:0,limitSize:row.cpuLimit||0,requestSize:row.cpuRequest||0};
    // if(!row || row.occupyCpuLimit.length<1){
    //     document.getElementById(id).innerHTML = `<div class="flex-center"> 一 </div>`;
    //     return;
    // }
    //
    // let usedMax = 0;
    // row.occupyCpuUsed.map(function (one) {
    //     usedMax += one.num;
    // })
    // row.occupyCpuUsed.map(function (one) {
    //     one.State = "used";
    //     one.value =  getPercentage(one.num / usedMax);
    //     data.push(one);
    // })
    row.occupyCpuLimit.map(function (one) {
        if(one.name == "free"){
            option.limitFree = one.num;
            return;
        }else{
            option.occupyCpuLimit = true;
        }
        one.State = "limit";
        one.value = getPercentage(one.percentage);
        data.push(one);
    })
    row.occupyCpuReq.map(function (one) {
        if(one.name == "free"){
            option.requestFree = one.num;
            return;
        }else{
            option.occupyCpuReq = true;
        }
        one.State = "request";
        one.value =  getPercentage(one.percentage);
        data.push(one);
    })
    if(!option.occupyCpuLimit){// 占位元素
        data.push({State:"limit",name:'none',value:0.1});
    }
    if(!option.occupyCpuReq){// 占位元素
        data.push({State:"request",name:'none',value:0.1});
    }

    // start init chart
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    const chart = new G2.Chart({
        container: id,
        forceFit: true,
        height: 60,
        padding: [ 0, 30, 0, 80 ]
    });
    chart.source(dv, {
        value: { min: 0, max: 100 },
    });
    chart.coord().transpose();
    chart.axis('State', {
        label: {
            offset: 10
        }
    });
    chart.tooltip({
        useHtml:true,
        htmlContent:function(title,items){
            let arr = [];
            let freeSize = option[title+'Free'];
            let totalSize = option[title+'Size'];
            if(title == "used"){
                items.map((one)=>{
                    if(one.name == "none"){return;}
                    let item = _.find(data,(v)=>{return v.name == one.name && v.State == title;});
                    arr.push(`
                        <p>
                            <span style="background-color:${one.color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
                            ${item.name}: <b>${item.num}</b>m
                        </p>
                    `)
                })
                return `
                    <div class="g2-tooltip1 g2-tooltip-position" style="transform:translateX(280px)">
                        <div class="g2-tooltip-title" >${title}</div>
                        ${arr.join('\n')}
                    </div>
                `
            }
            // request / limit
            items.map((one)=>{
                if(one.name == "none"){return;}
                let item = _.find(data,(v)=>{return v.name == one.name && v.State == title;});
                arr.push(`
                    <p>
                        <span style="background-color:${one.color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
                        &nbsp;&nbsp; ${item.name}: <div><b>${item.num}</b>m  &nbsp;&nbsp; <b>${item.value}%</b></div>
                    </p>
                `)
            })
            return `
                <div class="g2-tooltip1 g2-tooltip-position" style="transform:translateX(280px)">
                    <div class="g2-tooltip-title">${title}</div>
                    ${arr.join('\n')}
                    <hr class="MuiDivider-root MuiDivider-light">
                    <p>
                        free : <b>${freeSize}</b>m  &nbsp;&nbsp; total : <b>${totalSize}</b>m  
                    </p>
                </div>
            `
        }
    })
    chart.intervalStack().position('State*value').color('name');
    // chart.intervalStack()
    //     .position('State*value')
    //     .color('name', function (name) {
    //         if(name == 'none'){
    //             return 'rgba(0,0,0,0)';
    //         }
    //         colorIndex++ > colors.length -1  && (colorIndex = 0);
    //         return colors[colorIndex];
    //     })
    //     .style({
    //         lineWidth: .1,
    //         stroke: '#fff'
    //     });
    chart.render();
}

export default class Index extends React.PureComponent {
    constructor(props){
        super(props);
        this.data = this.props.data;
        this.id = "cluster_chart_"+_.udid();
    }

    componentDidMount(){
        renderChart(this.id,this.data);
    }

    render(){
        return (
            <div id={this.id} style={{width:"400px"}}></div>
        )
    }
}