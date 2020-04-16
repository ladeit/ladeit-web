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
    let id = sc.state.id;
    let dg = $(go.Diagram,id, {
        "isReadOnly":false,
        "allowDrop": false,
        allowZoom:true,
        allowMove:false,
        "scale":.9,
        "initialContentAlignment": new go.Spot(.5,.5,100,0),//go.Spot.Center,
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
        $(go.Node,"Auto",{
                selectionAdorned: false,
                selectionObjectName: "BODY",
                fromSpot: go.Spot.RightCenter,
                toSpot: go.Spot.LeftCenter
                //isShadowed:true,
                //shadowOffset:new go.Point(1,1),
                //shadowColor:'red',
            }, nodeStyle(),
            $(go.Panel, "Vertical",
                {
                    width:62,
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
                        name:'BODY',
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
            makePort("R", "R", go.Spot.RightCenter, true, true)
        )
    )

    dg.nodeTemplateMap.add("pod",
        $(go.Node,"Auto",{
                selectionAdorned: false,
                selectionObjectName: "BODY",
                fromSpot: go.Spot.RightCenter,
                toSpot: go.Spot.LeftCenter
                //isShadowed:true,
                //shadowOffset:new go.Point(1,1),
                //shadowColor:'red',
            }, nodeStyle(),
            $(go.Panel, "Vertical",
                {
                    width:62,
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
                        name:'BODY',
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
            new go.Binding('opacity','',function(row){return [1,0.05,1][row.selected||0]}),
            makePort("L", "L", go.Spot.LeftCenter, true, true)
        )
    )

    // link
    dg.linkTemplate = $(go.Link,
        {
            routing: go.Link.Normal, // routing: go.Link.Orthogonal,
            curve: go.Link.Bezier,
            adjusting: go.Link.Stretch,
            relinkableFrom: true,
            relinkableTo: true,
        },
        $(go.Shape , { isPanelMain: true, stroke: "#1a65fb"},
            new go.Binding("stroke", "", function(row){
                if(row.selected!=1 && row.name == 'line'){
                    return '#ddd'
                }else{
                    return 'rgb(26, 101, 251)'
                }
            })
        ),
        $(go.Shape, { toArrow:'Line',stroke:'rgba(0,0,0,0)'}),
        $(go.TextBlock,"default", {
                background:'white',
                editable: true  // editing the text automatically updates the model data
            },
            new go.Binding("text", "text")
        ),
        new go.Binding('opacity','',function(row){return [1,0.05,1][row.selected||0]})
    )
}

function makePort(name, alignName, spot, output, input) {
    let horizontal = false;
    let align = '';
    switch (alignName){
        case "T":{
            horizontal = true;
            align = new go.Spot(0.5, 0, 0, 5);
        }
            break;
        case "B":{
            horizontal = true;
            align = new go.Spot(0.5, 1, 0, -5);
        }
            break;
        case "R":
            align = new go.Spot(1, 0.5, 0, 0);
            break;
        case "L":
            align = new go.Spot(0, 0.5, 0, 0);
            break;
    }
    return $(go.Shape,
        {
            fill: "transparent",  // changed to a color in the mouseEnter event handler
            strokeWidth: 0,  // no stroke
            width: 8,  // if not stretching horizontally, just 8 wide
            height: 16,  // if not stretching vertically, just 8 tall
            alignment: align,  // align the port on the main Shape
            stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
            portId: name,  // declare this object to be a "port"
            fromSpot: spot,  // declare where links may connect at this port
            fromLinkable: output,  // declare whether the user may draw links from here
            toSpot: spot,  // declare where links may connect at this port
            toLinkable: input,  // declare whether the user may draw links to here
            cursor: "pointer",  // show a different cursor to indicate potential link point
            mouseEnter: function(e, port) {  // the PORT argument will be this Shape
                if (!e.diagram.isReadOnly) port.fill = "blue";
            },
            mouseLeave: function(e, port) {
                port.fill = "transparent";
            }
        });
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

export default graph;
