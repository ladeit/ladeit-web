import React from 'react';
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import Icons from 'components/Icons/icons'
import AuthFilter from '@/AuthFilter'
//
import Typography from '@material-ui/core/Typography';

@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){}

    render(){
        let params = this.params;
        return (
            <Layout
                menuT={<MenuLayout params={params}  type="namespace"/>}
                crumbList={[
                    {text:`${params._name}`,url:`/cluster/${params._name}/setting`},
                    {text:`${params._namespace}`},
                    {text:'Services'}
                ]}
                contentT={<Icons.NodataT className="split" text={
                    <div className="split">
                        <Typography variant="h3" >Coming</Typography>
                    </div>
                } />}
            />
        )
    }
}

export default Index;
