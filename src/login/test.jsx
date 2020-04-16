import React from 'react';
import ReactDOM from 'react-dom';
import {
    Menu as MenuIcon,
    Edit as EditIcon
} from '@material-ui/icons'
import {
    withStyles,Typography,Paper,Button
} from '@material-ui/core'
import Inputs from 'components/Form/inputs.jsx'
import Icons from 'components/Icons/icons.jsx'
//import T from '../projects/components/create_strategy_rule.jsx'
//import Pagination from 'components/Table/list_page.jsx'
import Selects from '@/components/Form/selects.jsx'

import Form from 'components/Form/form.jsx'
import Terminal from '@/cluster/component/terminal_mutiple'


class Index extends React.PureComponent {
    componentWillMount(){
        //
    }

    componentDidMount(){
    }

    state = {
        form:[
            {name:'name',label:'姓名1',valid:['require'], inputProps:{placeholder:'用户名',endAdornment: <EditIcon />}},
            {name:'name1',label:'姓名1',valid:['require'],type:'select',options:[{key:'',text:'NONE'},'select1','select2','select3']},
            {name:'name3',label:'姓名2',inputProps:{disabled:true}},
            {name:'name',valid:['require'], inputProps:{placeholder:'用户名',endAdornment: <EditIcon />}},
            {name:'name1',label:'姓名1',valid:['require'],type:'select',options:[{key:'',text:'NONE'},'select1','select2','select3']},
            {name:'name3',label:'姓名2',type:'checked',inputProps:{disabled:true}},
        ]
    }

    download = ()=>{
        _.download({url:'/api/v1/yaml/download?YamlId=12312',fileName:"yaml.zip"})
    }

    render = ()=>{
        const form = this.state.form;
        //<Terminal />
        return (
            <Paper style={{margin:'16px',padding:'16px'}}>
                <Terminal />
            </Paper>
        )
    }
}

export default Index;
