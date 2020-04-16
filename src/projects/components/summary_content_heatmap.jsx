import G2 from '@antv/g2';
import Moment from 'moment'
import intl from 'react-intl-universal'

const Shape = G2.Shape;
const Util = G2.Util;
Shape.registerShape('polygon', 'boundary-polygon', {
    draw(cfg, container) {
        if (!Util.isEmpty(cfg.points)) {
            const attrs = {
                stroke: '#fff',
                lineWidth: 1,
                fill: cfg.color,
                fillOpacity: cfg.opacity
            };
            const points = cfg.points;
            const path = [
                [ 'M', points[0].x, points[0].y ],
                [ 'L', points[1].x, points[1].y ],
                [ 'L', points[2].x, points[2].y ],
                [ 'L', points[3].x, points[3].y ],
                [ 'Z' ]
            ];
            attrs.path = this.parsePath(path);
            const polygon = container.addShape('path', {
                attrs
            });

            if (cfg.origin._origin.lastWeek) {
                const linePath = [
                    [ 'M', points[2].x, points[2].y ],
                    [ 'L', points[3].x, points[3].y ]
                ];
                // 最后一周的多边形添加右侧边框
                container.addShape('path', {
                    zIndex: 1,
                    attrs: {
                        path: this.parsePath(linePath),
                        lineWidth: 1,
                        stroke: '#404040'
                    }
                });
                if (cfg.origin._origin.lastDay) {
                    container.addShape('path', {
                        zIndex: 1,
                        attrs: {
                            path: this.parsePath([
                                [ 'M', points[1].x, points[1].y ],
                                [ 'L', points[2].x, points[2].y ]
                            ]),
                            lineWidth: 1,
                            stroke: '#404040'
                        }
                    });
                }
            }
            container.sort();
            return polygon;
        }
    }
});

// let data = [{"date":"2017-05-01","commits":1,"month":4,"day":1,"week":"0",lastWeek:true,lastDay:true}]
function setLastLine(arr){
    let len = arr.length;
    let max = len>7 ? 7 : len;
    for(var i=0;i<max;i++){
        let index = len - 1 - i;
        if(i==0){
            arr[index]['lastDay'] = true;
        }
        arr[index]['lastWeek'] = true;
    }
}
function dataFilter(data,startDate,endDate){ // {"num":1, "date":"2019-12-09T06:00:00.000+0000"}
    let res = [];
    let dataMap = {};
    data.map((v) =>{
        let mement = Moment(v.date);
        dataMap[mement.dayOfYear()] = v.num;
    })
    // TODO 跨年
    let len = 180;
    let monthOffset = startDate.months();
    let weekOffset = 0;
    for(var i = 0;i<len;i++){
        let one = {"date":"","commits":1,"month":0,"day":0,"week":0};
        let oneDate = startDate.add(1,'days');
        let num = dataMap[oneDate.dayOfYear()] || 0;
        one.date = oneDate.format('YYYY-MM-DD');
        one.month = oneDate.months();
        one.day = oneDate.days();
        one.week = weekOffset;
        one.commits = num;
        //
        if(monthOffset != one.month){
            monthOffset = one.month;
            setLastLine(res);
        }
        if(one.day == 6){
            weekOffset++;
        }
        res.push(one);
    }
    return res;
}

function createView(name,list,start,end){
    if(!list){return;}
    const chart = new G2.Chart({
        container: name,
        forceFit: true,
        height: 300,
        padding: [ 50, 20, 50, 80 ]
    });
    let startDate = Moment(start);
    let endDate = Moment(end);
    let weekText = {
        '3':intl.get('services.heatmapChart.January'),
        '7':intl.get('services.heatmapChart.February'),
        '11':intl.get('services.heatmapChart.March'),
        '16':intl.get('services.heatmapChart.April'),
        '20':intl.get('services.heatmapChart.May'),
        '25':intl.get('services.heatmapChart.June'),
        '29':intl.get('services.heatmapChart.July'),
        '33':intl.get('services.heatmapChart.August'),
        '37':intl.get('services.heatmapChart.September'),
        '42':intl.get('services.heatmapChart.October'),
        '46':intl.get('services.heatmapChart.November'),
        '50':intl.get('services.heatmapChart.December')
    }
    let week = startDate.week();
    let data = dataFilter(list,startDate,endDate);
    chart.source(data, {
        day: {
            type: 'cat',
            values: [ intl.get('services.heatmapChart.Sunday'), intl.get('services.heatmapChart.Monday'), intl.get('services.heatmapChart.Tuesday'),intl.get('services.heatmapChart.Wednesday'),intl.get('services.heatmapChart.Thursday'),intl.get('services.heatmapChart.Friday'),intl.get('services.heatmapChart.Saturday') ]
        },
        week: {
            type: 'cat'
        },
        commits: {
            sync: true
        }
    });

    chart.axis('week', {
        position: 'top',
        tickLine: null,
        line: null,
        label: {
            offset: 12,
            textStyle: {
                fontSize: 12,
                fill: '#666',
                textBaseline: 'top'
            },
            formatter: (val) => {
                val = Number(val) + week;
                val > 52 && (val -= 52);
                return weekText[String(val)] || '';
            }
        }
    });
    chart.axis('day', {
        grid: null
    });
    chart.legend(false);
    chart.tooltip({
        title: 'date',
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>operation: {value}</li>'
    });
    chart.coord().reflect('y');
    chart.polygon().position('week*day*date')
        .color('commits', '#BAE7FF-#1890FF-#0050B3')
        .shape('boundary-polygon');
    chart.render();
}

export default createView;