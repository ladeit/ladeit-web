import Go from '@/components/Gojs/go';
import ServerImg from '@static/img/server.png'
import TaskImg from '@static/img/task.png'
import OkImg from '@static/img/ok.png'
import CloseImg from '@static/img/close.png'

const styles = {
    icon:{width:16,height:16,margin:4},
    pod:{width:130,background:"rgba(114, 125, 144,.9)"},
    pod_header:{height:30},
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
        "initialContentAlignment": go.Spot.Center,
        "layout":$(go.TreeLayout, {
            angle: 0,
            arrangement: go.TreeLayout.ArrangementVertical,
            isRealtime: false,
            layerSpacing: 80,
            setsPortSpot: false,
            setsChildPortSpot: false
        }),
        click:function(e){
            if(eventIsFirst(e)){
                dg.sc.clickGraph('diagram', e)
            }
        }
    })

    dg.sc = sc; //{ clickGraph:function(){} };
    window.dg = dg;
    //
    loadTemplate();
    loop(200);
    dg.loadModel = function(nodes,links){loadModel.call(dg,nodes,links)}
    return dg;
}

function loadTemplate(){
    let $ = go.GraphObject.make;
    // server
    dg.nodeTemplateMap.add("server",
        $(go.Node,{ selectionAdorned: false },nodeStyle(),
            $(go.Panel, "Vertical",
                $(go.Picture, ServerImg),
                $(go.TextBlock, "",
                    new go.Binding("text", "text")
                )
            )
        )
    );
    // pod
    dg.nodeTemplateMap.add("pod",
        $(go.Node,{
                selectionAdorned: false,
                click:function(e){
                    if(eventIsFirst(e)){
                        dg.sc.clickGraph('pod', e)
                    }
                }
            }, nodeStyle(),
            $(go.Panel, "Horizontal",
                $(go.Panel, "Vertical",
                    styles.pod, // panel properties
                    $(go.Panel, "Horizontal",
                        styles.pod_header,
                        {alignment:go.Spot.Center},
                        $(go.TextBlock, "Header")
                    ),
                    nodeLine(),
                    $(go.Panel,"Horizontal",
                        styles.pod_vertion,
                        {
                            alignment:go.Spot.Center
                        },
                        $(go.TextBlock,"V 3.3.1",{width:130,textAlign: 'center'})
                    ),
                    nodeLine(),
                    $(go.Panel, "Horizontal",
                        styles.pod_status,
                        {alignment:go.Spot.Center},
                        $(go.TextBlock, "滚动升级中")
                    )
                ),
                $(go.Panel, "Vertical",
                    {alignment:go.Spot.TopCenter},
                    {margin:new go.Margin(-4,0,0,0)},
                    $(go.Picture, CloseImg,styles.icon),
                    $(go.Picture, TaskImg,styles.icon)
                )
            )
        )
    );
    // new-pod
    dg.nodeTemplateMap.add("newPod",
        $(go.Node,{
                selectionAdorned: false,
                click:function(e){
                    if(eventIsFirst(e)){
                        dg.sc.clickGraph('pod', e)
                    }
                }
            }, nodeStyle(),
            $(go.Panel, "Horizontal",
                $(go.Panel, "Vertical",
                    styles.pod_new, // panel properties
                    $(go.Panel, "Horizontal",
                        styles.pod_header,
                        {alignment:go.Spot.Center},
                        $(go.TextBlock, "Header")
                    ),
                    nodeLine(),
                    $(go.Panel,"Horizontal",
                        styles.pod_vertion,
                        {
                            alignment:go.Spot.Center
                        },
                        $(go.TextBlock,"V 3.3.1",{width:130,textAlign: 'center'})
                    ),
                    nodeLine(),
                    $(go.Panel, "Horizontal",
                        styles.pod_status,
                        {alignment:go.Spot.Center},
                        $(go.TextBlock, "新建")
                    )
                ),
                $(go.Panel, "Vertical",
                    {alignment:go.Spot.TopCenter},
                    {margin:new go.Margin(-4,0,0,0)},
                    $(go.Picture, CloseImg,styles.icon),
                    $(go.Picture, TaskImg,styles.icon),
                    $(go.Picture, OkImg,styles.icon,{
                        click:function(e){
                            if(eventIsFirst(e)){
                                dg.sc.clickGraph('pod_save', e)
                            }
                        }
                    })
                )
            )
        )
    );
    // pod-simple
    dg.nodeTemplateMap.add("pod_sim_1",
        $(go.Node,{ selectionAdorned: false }, nodeStyle(),
            $(go.Panel, "Vertical",
                styles.pod_sim,
                {margin:new go.Margin(0,4,16,4)},
                $(go.Panel,"Horizontal",
                    styles.pod_sim_vertion,
                    {alignment:go.Spot.Center},
                    $(go.TextBlock,"V3.3.1",{})
                )
            )
        )
    );

    dg.nodeTemplateMap.add("pod_sim",
        $(go.Node, "Spot", { selectionAdorned: false,desiredSize: new go.Size(75, 75) ,background:'rgba(0,0,0,0)' },
            $(go.Shape, "Circle",
                {
                    fill:'rgba(114, 125, 144,.9)',
                    stroke: null,
                    cursor: "pointer",
                }),
            $(go.Shape, "Circle",
                { fill: 'rgba(114, 125, 144,.9)', desiredSize: new go.Size(65, 65), strokeWidth: 2, stroke: "whitesmoke" },
                new go.Binding('strokeDashArray', "",function(row){return [204*row.size,204*(1-row.size)]})
            ),
            $(go.TextBlock,
                {
                    font: "bold 12pt helvetica, bold arial, sans-serif",
                    stroke: "whitesmoke"
                },
                new go.Binding('text', "name")
            )
        )
    );

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
        $(go.Shape, "Rectangle", { fill: null, stroke: "gray", strokeWidth: 2 }),
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
        $(go.Shape , { isPanelMain: true, stroke: "rgba(23, 31, 44,.8)", strokeWidth: 1.5 },
            new go.Binding("name", "name", function(name){return name}),
            new go.Binding("strokeDashArray", "name", function(name){return name=='dot'?[10,10]:''})
        ),
        $(go.Shape, { toArrow: "Standard" }),
        $(go.TextBlock,{},
            new go.Binding("background", "text",function(text){return text?'#eaeff0':'none'}),
            new go.Binding("text", "text"))
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
