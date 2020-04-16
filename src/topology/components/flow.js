import Go from '@/components/Gojs/go';
import ServerImg from '@static/img/server.png'
import AddImg from '@static/img/add.png'
import TaskImg from '@static/img/task.png'
import OkImg from '@static/img/ok.png'
import CloseImg from '@static/img/close.png'

const styles = {
    icon:{width:16,height:16,margin:4},
    pod:{width:130,background:"rgba(114, 125, 144,.9)",shadowVisible:true,},
    pod_header:{width:130,height:30,background:'#eef1f7',shadowVisible:true},
    pod_vertion:{height:40},
    pod_status:{height:30},
    pod_new:{width:130,background:"rgba(114, 125, 144,.3)"},
    pod_sim:{width:130,background:"rgba(114, 125, 144,.9)"},
    pod_sim_vertion:{height:80}
}

// init
let $ = go.GraphObject.make;
function graph(sc){
    let dg = $(go.Diagram, "flow-diagram", {
        "isReadOnly":false,
        "allowDrop": false,
        allowZoom:true,
        "scale":1,
        "initialContentAlignment": new go.Spot(.5,.5,150,0),//go.Spot.Center,
        "layout":$(go.TreeLayout, {
            angle: 0,
            arrangement: go.TreeLayout.ArrangementVertical,
            isRealtime: false,
            layerSpacing: 80,
            setsPortSpot: false,
            setsChildPortSpot: false
        }),
        click:function(e,node){
            loopFlagData();
            if(eventIsFirst(e)){
                dg.sc.clickGraph('diagram','')
            }
        }
    })

    dg.sc = sc; //{ clickGraph:function(){} };
    window.dg = dg;
    //
    loadTemplate();
    loop(300);
    dg.loadModel = function(nodes,links){
        loadModel.call(dg,nodes,links)
    }
    return dg;
}

var GeneratorEllipseSpot1 = new go.Spot(0.156, 0.156);
var GeneratorEllipseSpot2 = new go.Spot(0.844, 0.844);
go.Shape.defineFigureGenerator("CircleLine", function(shape, w, h) {
    var rad = w/2;
    var geo = new go.Geometry()
        .add(new go.PathFigure(w, w / 2, false)  // clockwise
            .add(new go.PathSegment(go.PathSegment.Arc, 0, 360, rad, rad, rad, rad).close()));
    geo.spot1 = GeneratorEllipseSpot1;
    geo.spot2 = GeneratorEllipseSpot2;
    geo.defaultStretch = go.GraphObject.Uniform;
    return geo;
})

function loadTemplate(){
    let $ = go.GraphObject.make;

    // pod
    dg.nodeTemplateMap.add("server",
        $(go.Node,{
                name:'POD',
                selectionAdorned: false,
            }, nodeStyle(),
            $(go.Panel, "Vertical",
                {
                    width:120,
                    height:100,
                    click:function(e,node){
                        loopFlagData(node);
                        if(eventIsFirst(e)){
                            dg.sc.clickGraph('pod',node.part.data)
                        }
                    }
                },
                $(go.Panel,"Auto",{height:16}),
                $(go.Panel,
                    {
                        fromSpot: go.Spot.RightSide,
                        toSpot: go.Spot.LeftSide
                    },
                    $(go.Shape,'CircleLine',
                        {name: "SHAPE",width:60,height:60,stroke:'#d0d0d0'}
                    ),
                    $(go.Panel, "Spot",
                        { width: 30,height:30 ,margin:new go.Margin(15,0,0,15)}, // ,alignment:go.Spot.Center
                        $(go.Picture, ServerImg)
                    )
                ),
                $(go.Panel,"Auto",{height:4}),
                $(go.TextBlock,
                    {
                        margin:new go.Margin(0,0,0,0),
                        font: "10pt helvetica, bold arial, sans-serif",
                        stroke: "#2b2b2b"
                    },
                    new go.Binding("text", "text")
                )
            ),
            new go.Binding('opacity','',function(row){return [1,0.05,1][row.selected||0]})
        )
    )

    dg.nodeTemplateMap.add("pod",
        $(go.Node,'Spot',
            { selectionAdorned: false },
            nodeStyle(),
            $(go.Panel, "Vertical",
                {
                    width:100,
                    height:100,
                    click:function(e,node){
                        loopFlagData(node);
                        if(eventIsFirst(e)){
                            dg.sc.clickGraph('pod',node.part.data)
                        }
                    }
                },
                $(go.Panel,"Auto",{height:16}),
                $(go.Panel,
                    {
                        fromSpot: go.Spot.RightSide,
                        toSpot: go.Spot.LeftSide
                    },
                    $(go.Shape,'CircleLine',
                        {name: "SHAPE",width:60,height:60,stroke:'#d0d0d0'}
                    ),
                    $(go.Panel, "Spot",
                        { width: 30,height:30 ,margin:new go.Margin(15,0,0,15)}, // ,alignment:go.Spot.Center
                        $(go.Picture, TaskImg)
                    )
                ),
                $(go.Panel,"Auto",{height:4}),
                $(go.TextBlock,
                    {
                        margin:new go.Margin(0,0,0,0),
                        font: "10pt helvetica, bold arial, sans-serif",
                        stroke: "#2b2b2b"
                    },
                    new go.Binding("text", "text")
                )
            ),
            new go.Binding('opacity','',function(row){return [1,0.05,1][row.selected||0]})
        )
    )

    dg.nodeTemplateMap.add("newPod",
        $(go.Node,'Spot',
            { selectionAdorned: false},
            nodeStyle(),
            $(go.Panel, "Vertical",
                {
                    width:100,
                    height:100,
                    click:function(e,node){
                        loopFlagData(node);
                        if(eventIsFirst(e)){
                            dg.sc.clickGraph('pod',node.part.data)
                        }
                    }
                },
                $(go.Panel,"Auto",{height:16}),
                $(go.Panel,
                    {
                        fromSpot: go.Spot.RightSide,
                        toSpot: go.Spot.LeftSide
                    },
                    $(go.Shape,'CircleLine',
                        {name: "SHAPE",width:60,height:60,stroke:'#d0d0d0'}
                    ),
                    $(go.Panel, "Spot",
                        { width: 30,height:30 ,margin:new go.Margin(15,0,0,15)}, // ,alignment:go.Spot.Center
                        $(go.Picture, AddImg)
                    )
                ),
                $(go.Panel,"Auto",{height:4}),
                $(go.TextBlock,
                    {
                        margin:new go.Margin(0,0,0,0),
                        font: "10pt helvetica, bold arial, sans-serif",
                        stroke: "#2b2b2b"
                    },
                    new go.Binding("text", "text")
                )
            ),
            new go.Binding('opacity','',function(row){return [.6,0.05,1][row.selected||0]})
        )
    )

    dg.nodeTemplateMap.add("pod1",
        $(go.Node,'Spot',
            { selectionAdorned: false },
            nodeStyle(),
            $(go.Panel, "Vertical",
                {
                    width:100,
                    height:100,
                    click:function(e,node){
                        loopFlagData(node);
                        if(eventIsFirst(e)){
                            dg.sc.clickGraph('pod',node.part.data)
                        }
                    }
                },
                $(go.Panel,"Auto",{height:16}),
                $(go.Panel,
                    {
                        fromSpot: go.Spot.RightSide,
                        toSpot: go.Spot.LeftSide
                    },
                    $(go.Shape,'CircleLine',
                        {name: "SHAPE",width:60,height:60,stroke:'#d0d0d0'}
                    ),
                    $(go.Panel, "Spot",
                        { width: 30,height:30 ,margin:new go.Margin(15,0,0,15)}, // ,alignment:go.Spot.Center
                        $(go.Picture, TaskImg)
                    )
                ),
                $(go.Panel,"Auto",{height:4}),
                $(go.TextBlock,
                    {
                        margin:new go.Margin(0,0,0,0),
                        font: "10pt helvetica, bold arial, sans-serif",
                        stroke: "#2b2b2b"
                    },
                    new go.Binding("text", "text")
                )
            ),
            new go.Binding('opacity','',function(row){return [1,0.05,1][row.selected||0]})
        )
    )

    // group
    dg.groupTemplate = $(go.Group, "Auto",
        {
            selectionAdorned: false,
            isSubGraphExpanded: true,
            layout: $(go.TreeLayout, { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal, isRealtime: false }),
            subGraphExpandedChanged: function(group) {
                if (group.memberParts.count === 0) {
                    randomGroup(group.data.key);
                }
            }
        },
        $(go.Shape, "Rectangle", { isPanelMain: true, fill: null, stroke: "#d0d0d0", strokeWidth: 1 ,strokeWidth: 1,strokeDashArray:[2,2]}),
        $(go.Panel, "Vertical",
            { defaultAlignment: go.Spot.Left, margin: 4 },
            $(go.Panel, "Horizontal",
                { defaultAlignment: go.Spot.Top },
                $("SubGraphExpanderButton"),
                $(go.TextBlock,{ font: "Bold 13px Sans-Serif", margin: new go.Margin(2,0,0,4) },
                    new go.Binding("text", "text"))
            ),
            $(go.Placeholder, { padding: new go.Margin(0, 10) })
        )
    )

    // link
    dg.linkTemplate = $(go.Link,
        {
            routing: go.Link.Orthogonal,
            corner: 5,
        },
        $(go.Shape , { isPanelMain: true, stroke: "#1a65fb", strokeWidth: 1.5 },
            new go.Binding("stroke", "", function(row){
                if(row.selected!=1 && row.name == 'line'){
                    return '#ddd'
                }else{
                    return 'rgb(26, 101, 251)'
                }
            }),
            new go.Binding("name", "name", function(name){return name}),
            new go.Binding("strokeDashArray", "name", function(name){return name=='dot'?[10,10]:''})
        ),
        $(go.Shape, { toArrow:'Line',stroke:'rgba(0,0,0,0)'}),
        $(go.TextBlock, { segmentIndex: 3, segmentFraction: 0.7,segmentOffset: new go.Point(0, -10) },
            new go.Binding("text", "text")
        ),
        new go.Binding('opacity','',function(row){return [1,0.05,1][row.selected||0]})
    )
}

let PathPatterns = new go.Map();

function definePathPattern(name, geostr, color, width, cap) {
    if (typeof name !== 'string' || typeof geostr !== 'string') throw new Error("invalid name or geometry string argument: " + name + " " + geostr);
    if (color === undefined) color = "black";
    if (width === undefined) width = 1;
    if (cap === undefined) cap = "square";
    PathPatterns.set(name,
        $(go.Shape,
            {
                geometryString: geostr,
                fill: "transparent",
                name: 'PIPE',
                stroke: color,
                strokeWidth: width,
                strokeCap: cap
            }
        ));
}

definePathPattern("", "M0 0 L1 0");
definePathPattern("Dot", "M0 0 M4 0 L8 0", "black", 2, "round");

// ============== common
function nodeStyle() {
    return [
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(function(a){
            return Math.ceil(a.x.toString())+" "+Math.ceil(a.y.toString())
        })
    ];
}

function nodeLine(){
    return $(go.Panel,"Auto",{width:130,height:1,background:"#aaa"})
}

function linkPathPatternToShape(name) {
    return PathPatterns.get(name);
}

function eventIsFirst(e){
    return !(e.event.tag || !(e.event.tag = "only"))//
}


function loadModel(nodes,links){
    this.model = new go.GraphLinksModel(nodes,links)
}

function loadModel1(){
    dg.model = new go.GraphLinksModel([
        {"key":"group", "text":"", "isGroup":true},
        {"key":"group2", "text":"", "isGroup":true},
        {"key":"server", "text":"Buzzy.xxx.com", "category":"server", "pos":"254 -260"},
        {"key":"10", "name":"Don Meow" , "group":"group", "category":"server", "pos":"88 -95"},
        {"key":"11", "parent":"1", "name":"Demeter", "group":"group", "category":"pod_sim", "pos":"-44 2"},
        {"key":"12", "parent":"1", "name":"Copricat", "group":"group", "category":"pod_sim", "pos":"114 2"},
        {"key":"20", "name":"Don Meow", "group":"group2", "category":"server", "pos":"577 -86"},
        {"key":"21", "parent":"1", "name":"Demeter", "group":"group2", "category":"pod_sim", "pos":"445 11"},
        {"key":"22", "parent":"1", "name":"Copricat", "group":"group2", "category":"pod_sim", "pos":"603 11"}
    ],[
        {from: 'server', to: 'group'},
        {from: 'server', to: 'group2'},
        {from: '10', to: '11',text:'default'},
        {from: '10', to: '12',text:'default'},
        {from: '20', to: '21',text:'default'},
        {from: '20', to: '22',text:'default'},
    ]);
}

function loadModel2(){
    dg.model = new go.GraphLinksModel([
        { key: "1",              name: "Don Meow",   source: "cat1.png" ,category:'server',"pos":"0 0"},
        { key: "2", parent: "1", name: "Demeter",    source: "cat2.png" ,category:'newPod', "pos":"96 91"},
        { key: "3", parent: "1", name: "Copricat",   source: "cat3.png" ,category:'pod', "pos":"-172 95"},
    ],[
        {from: 1, to: 2 ,text:'default' },
        {from: 1, to: 3 ,text:'/k8s' },
    ]);
}

function loopFlagData(node){
    if(!node){
        dg.model.commit(function(m) {
            m.nodeDataArray.map(function(v){
                m.set(v, "selected", 0);
            })
            m.linkDataArray.map(function(v,i){
                m.set(v, "selected", 0);
            })
        }, "flash")
        return;
    }
    //
    let nodeData = node.part.data;
    let nodes = dg.model.nodeDataArray;
    let links = dg.model.linkDataArray;
    let activeNodes = [nodeData.key];
    let activeLinks = [];
    links.map(function(v,i){
        if(v.from == nodeData.key){
            activeLinks.push(i)
            activeNodes.push(v.to)
        }else if(v.to == nodeData.key ){
            activeLinks.push(i)
            activeNodes.push(v.from)
        }
    })
    //
    dg.model.commit(function(m) {
        m.nodeDataArray.map(function(v){
            m.set(v, "selected", activeNodes.indexOf(v.key)>-1?2:1);
        })
        m.linkDataArray.map(function(v,i){
            m.set(v, "selected", activeLinks.indexOf(i)>-1?2:1);
        })
    }, "flash");
}

function loop(time){
    let oldskips = dg.skipsUndoManager;
    dg.startTransaction("start");
    for(let key in loop.funs){
        loop.funs[key]();
    }
    dg.skipsUndoManager = oldskips;
    dg.commitTransaction("start");
    clearTimeout(loop.timer);
    if(time){
        loop.timer = setTimeout(function(){loop(time)},time);
    }
}

loop.funs = {
    links:function(){
        if(dg.scale<0.4){return;}
        dg.links.each(function(link) {
            var shape = link.findObject('dot');
            if(shape){
                var off = shape.strokeDashOffset - 4;
                shape.strokeDashOffset = (off <= 0) ? 20 : off;
            }
        });
    }
}

export default graph
