import G2 from '@antv/g2';
import { DataSet } from '@antv/data-set';

// arc diagram layout
const ds = new DataSet();

function createView(id,data){
    const dv = ds.createView().source(data, {
        type: 'graph',
        edges: d => d.links
    });
    dv.transform({
        type: 'diagram.sankey'
    });


    const chart = new G2.Chart({
        container: id,
        forceFit: true,
        height: 500,
        padding: [ 40, 80 ]
    });
    chart.legend(false);
    chart.tooltip({
        showTitle: false
    });
    chart.axis(false);
    chart.scale({
        x: { sync: true },
        y: { sync: true }
    });

// edge view
    const edgeView = chart.view();
    edgeView.source(dv.edges);
    edgeView.edge()
        .position('y*x')
        .shape('arc')
        .color('#bbb')
        .opacity(0.6)
        .tooltip('target*source*value', (target, source, value) => {
            return {
                name: source.name + ' to ' + target.name + '</span>',
                value
            };
        });

// node view
    const nodeView = chart.view();
    nodeView.source(dv.nodes);
    nodeView.polygon()
        .position('y*x') // nodes数据的x、y由layout方法计算得出
        .color('name')
        .label('name', {
            textStyle: {
                fill: '#545454',
                textAlign: 'start'
            },
            offset: 0,
            formatter: val => {
                return '  ' + val;
            }
        })
        .tooltip(false)
        .style({
            stroke: '#ccc'
        });
    chart.render();
}

export default createView;
