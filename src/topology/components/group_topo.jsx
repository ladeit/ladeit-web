import React from 'react';
import {
    withStyles,Typography,Paper,IconButton,Divider,
} from '@material-ui/core';

import Flow from '@/topology/flow/flow'

const styles = theme => ({
    box:{
        height:'100%',
        minHeight:'500px',
        background: '#f8f8f8',
        position:'relative'
    }
});

@withStyles(styles)
class Index extends React.PureComponent{

    componentDidMount(){
        this.loadRoute();
    }

    loadRoute(){
        const {topo} = this.props;
        this.dg = Flow({
            env:'true',
            list:topo
        }).zoom();
    }

    loadData(){
        const sc = this;
        setTimeout(function () {
            let data = {
                env:true,
                list:[
                    {
                        id:'1',
                        host:["dev.ladeit.io"],
                        match:[
                            {
                                id:'0default',
                                name:'default',
                                rule:[
                                    {
                                        name:'xx',
                                        stringMatch:[
                                            {
                                                type:'uri',
                                                expression:'exact',
                                                value:'xxx'
                                            }
                                        ]
                                    }
                                ],
                                redirect:'xxx'
                            },
                            {
                                id:'0default1',
                                name:'default',
                                rule:[
                                    {
                                        name:'xx',
                                        stringMatch:[
                                            {
                                                type:'uri',
                                                expression:'exact',
                                                value:'xxx'
                                            }
                                        ]
                                    }
                                ],
                                redirect:'xxx'
                            },
                            {
                                id:'0default2',
                                name:'default',
                                rule:[
                                    {
                                        name:'xx',
                                        stringMatch:[
                                            {
                                                type:'uri',
                                                expression:'exact',
                                                value:'xxx'
                                            }
                                        ]
                                    },
                                    {
                                        name:'xx',
                                        stringMatch:[
                                            {
                                                type:'uri',
                                                expression:'exact',
                                                value:'xxx'
                                            }
                                        ]
                                    }
                                ],
                                redirect:'xxx'
                            }
                        ],
                        route:[
                            {id:'01',host:'xxx',subset:'v0.3.1'},
                            {id:'02',host:'xxx',subset:'v0.3.2'},
                            {id:'03',host:'xxx',subset:'v0.3.2'}
                        ],
                        map:[
                            {matchId:'0default',routeId:'01',disabled:true,weight:8},
                            {matchId:'0default1',routeId:'01',disabled:true,weight:8},
                            {matchId:'0default2',routeId:'01',disabled:true,weight:8},
                            {matchId:'0default',routeId:'02',disabled:true,weight:92}
                        ]
                    },
                    {
                        id:'2',
                        host:['test.ladeit.io'],
                        match:[
                            {
                                id:'1default',
                                name:'default',
                                rule:[
                                    {
                                        name:'xx',
                                        stringMatch:[
                                            {
                                                type:'method',
                                                expression:'exact',
                                                value:'xxx'
                                            }
                                        ]
                                    }
                                ],
                                redirect:'xxx'
                            },
                            {
                                id:'2default',
                                name:'default',
                                rule:[
                                    {
                                        name:'xx',
                                        stringMatch:[
                                            {
                                                type:'method',
                                                expression:'exact',
                                                value:'xxx'
                                            }
                                        ]
                                    }
                                ],
                                redirect:'xxx'
                            }
                        ],
                        route:[
                            {id:'11',host:'xxx',subset:'v0.3.1'},
                            {id:'12',host:'xxx',subset:'v0.3.2'},
                        ],
                        map:[
                            {matchId:'1default',routeId:'11',disabled:true,weight:8},
                            {matchId:'1default',routeId:'12',disabled:true,weight:92}
                        ]
                    }
                ]
            }

            sc.dg = Flow(data).zoom();
        },500)
    }

    state = {}

    render(){
        const {classes} = this.props;
        window.sc = this;
        return (
            <div className={classes.box} >
                <div style={{width:'100%',height:'100%',position:'absolute'}}>
                    <svg className="flow-strategy" xmlns="http://www.w3.org/2000/svg" viewBox="0,-320,1000,660">
                        <defs joint-selector="defs">
                            <filter id="dropShadow" filterUnits="objectBoundingBox" x="-1" y="-1" width="3" height="3"><feDropShadow stdDeviation="2" dx="0" dy="2" flood-color="#000" flood-opacity="0.05"></feDropShadow></filter>
                        </defs>
                    </svg>
                    <div id="node_info"></div>
                </div>
            </div>
        )
    }
}

export default Index;


