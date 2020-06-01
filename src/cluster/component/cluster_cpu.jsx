import G2 from '@antv/g2';
import { DataSet } from '@antv/data-set';
import React from "react";

function renderChart(id,row) {
    let keys = [];
    let occupyCpuLimit = {State:'limit'};
    if(!row || row.occupyCpuLimit.length<1){
        document.getElementById(id).innerHTML = `<div class="flex-center"> 一 </div>`;
        return;
    }
    //
    row.occupyCpuLimit.map(function (one) {
        keys.push(one.name);
        occupyCpuLimit[one.name] = one.num;
    })
    let occupyCpuReq = {State:'cpu'};
    row.occupyCpuReq.map(function (one) {
        occupyCpuReq[one.name] = one.num;
    })

    const data = [
        occupyCpuLimit,
        occupyCpuReq
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: 'fold',
        fields: keys, // 展开字段集
        key: 'cpu', // key字段
        value: 'value', // value字段
        retains: [ 'State' ] // 保留字段集，默认为除fields以外的所有字段
    });
    const chart = new G2.Chart({
        container: id,
        forceFit: true,
        height: 60,
        padding: [ 0, 20, 0, 50 ]
    });
    chart.source(dv);
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
        formatter(val) {
            return val + '%';
        }
    });
    chart.intervalStack().position('State*value').color('cpu');
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