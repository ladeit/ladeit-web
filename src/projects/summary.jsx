import React from 'react';
import ReactDOM from 'react-dom';
import Component from '@/Component.jsx'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'

import Content from './components/summary_content.jsx'

class Index extends Component {
    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){}

    render = ()=>{
        const { classes } = this.props;
        let params = this.params;
        return (
            <Layout
                crumbList={[{text:params._group,url:`/group/${params._group}`},{text:params._name},{text:'Dashboard'}]}
                menuT={<MenuLayout params={params} />}
                contentT={<Content params={params}/>}
            />
        )
    }
}

export default Index;
