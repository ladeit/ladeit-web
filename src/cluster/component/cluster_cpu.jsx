import G2 from '@antv/g2';
import { DataSet } from '@antv/data-set';
import React from "react";
import _ from 'lodash'

function renderChart(id,row) {
    let data = [];
    if(!row || row.occupyCpuLimit.length<1){
        document.getElementById(id).innerHTML = `<div class="flex-center"> 一 </div>`;
        return;
    }
    //
    row.occupyCpuLimit.map(function (one) {
        one.State = "cpulimit";
        one.value = one.percentage;
        data.push(one);
    })
    row.occupyCpuReq.map(function (one) {
        one.State = "cpureq";
        one.value = one.percentage;
        data.push(one);
    })

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    const chart = new G2.Chart({
        container: id,
        forceFit: true,
        height: 60,
        padding: [ 0, 30, 0, 80 ]
    });
    chart.source(dv, {
        value: { min: 0, max: 1 },
    });
    chart.coord().transpose();
    chart.axis('State', {
        label: {
            offset: 10
        }
    });
    chart.axis('value', {
        position: 'right',
        title: null,
        tickLine: null,
        formatter(val,a,b) {
            return val + '%';
        }
    });
    chart.tooltip({
        useHtml:true,
        htmlContent:function(title,items){
            let arr = [];
            items.map((one)=>{
                let item = _.find(data,(v)=>{return v.name == one.name});
                arr.push(`
                    <p>
                        <span style="background-color:${one.color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
                        ${item.name}: ${item.num}m
                    </p>
                `)
            })
            return `
                <div class="g2-tooltip g2-tooltip-position" style="transform:translateX(280px)">
                    <div class="g2-tooltip-title" style="margin-bottom: 4px;">${title}</div>
                    ${arr.join('\n')}
                </div>
            `
        }
    })
    //chart.intervalStack().position('State*value').color('cpu');
    chart.intervalStack()
        .position('State*value')
        .color('name', [ '#67b7dc', '#84b761', '#fdd400', '#cc4748', '#cd82ad', '#2f4074', '#448e4d', '#b7b83f', '#b9783f' ])
        .style({
            lineWidth: .1,
            stroke: '#fff'
        });
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
            <div id={this.id} style={{width:"380px"}}></div>
        )
    }
}