import G2 from '@antv/g2';
import { DataSet } from '@antv/data-set';
import _ from "lodash";
import intl from 'react-intl-universal'

function getData(pod){
    const data = [// Running:0,Pending:0,Succeeded:0,Failed:0,Unknown:0,SUM:0
        { item: intl.get('services.pipeChart.status1'), type: intl.get('services.pipeChart.status1'),value:pod.Running, percent: pod.Running/pod.SUM },
        { item: intl.get('services.pipeChart.status2'), type: intl.get('services.pipeChart.status2'),value:pod.Pending, percent: pod.Pending/pod.SUM },
        { item: intl.get('services.pipeChart.status3'), type: intl.get('services.pipeChart.status3'),value:pod.Unknown, percent: pod.Unknown/pod.SUM },
        { item: intl.get('services.pipeChart.status4'), type: intl.get('services.pipeChart.status4'),value:pod.Succeeded, percent: pod.Succeeded/pod.SUM },
        { item: intl.get('services.pipeChart.status5'), type: intl.get('services.pipeChart.status5'),value:pod.Failed, percent: pod.Failed/pod.SUM },
    ];
    const sum = pod.SUM;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
        type: 'map',
        callback(row) {
            return row;
        }
    });
    return dv;
}

function createView(name,info,numDom,options){
    let chartDom = document.getElementById(name);
    let chart = chartDom.chart;
    if(chart){
        try{
            chart.destroy();// TODO  待定: 无法动态修改guide
        }catch (e) {
            // end
            console.log('service-pipe',e);
        }
    }
    let opt = _.extend({
        height:200,
        legend:{
            position: 'left-center',
            offsetX: 0
        }
    },options);
    //
    chart = new G2.Chart({
        container: name,
        forceFit: true,
        height: opt.height,
        padding: {right:-16},
    })
    chart.source(getData(info));
    chart.legend(opt.legend);
    chart.coord('theta', {
        innerRadius: 0.85
    });
    //chart.tooltip(false);
    chart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });
    chart.intervalStack().position('percent').color('type', [ '#0a7aca','#0a9afe', '#8ed1ff' ,'#4ecb73','#f2637b'])
        .opacity(1)
        .style({})
        .label('percent', {
            offset: -16,
            textStyle: {
                fill: 'white',
                fontSize: 12,
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)'
            },
            rotate: 0,
            autoRotate: false,
            formatter: (text, item) => {
                window.item = item;
                return '';
            }
        })
        .tooltip('item*value', (item, percent) => {
            percent = percent + '个';
            return {
                name: item,
                value: percent
            };
        })
    chart.guide().html({
        position: [ '50%', '50%' ],
        html: numDom
    });
    chart.render();
    chartDom.chart = chart;
    // window.createView = createView;
    // window.chart = chart;
}

export default createView;