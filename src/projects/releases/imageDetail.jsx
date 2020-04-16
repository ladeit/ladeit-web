import React from 'react'
import clsx from 'clsx'
import Icons from '@/components/Icons/icons.jsx'
import Service from '../Service'
import AuthFilter from '@/AuthFilter'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import ImageInfoT from '@/projects/components/versionList_ImageInfo.jsx'
//
import {
    withStyles,Typography,Paper,IconButton,Divider,Button,
    CardHeader,CardContent
} from '@material-ui/core';


@AuthFilter
class Index extends React.PureComponent {
    componentWillMount(){
        this.initParams();
    }

    componentDidMount(){
        this.loadImage();
    }

    loadImage(){
        const sc = this;
        const p = sc.params;
        Service.serviceMap({ServiceId:'',ServiceGroup:p._group,ServiceName:p._name},(res)=>{
            Service.imageMap({ServiceGroup:'',ServiceName:'',ImageVersion:'',ServiceId:res.id,ImageId:p.id},function (res) {
                res.loaded = true;
                res.releaseAO || (res.releaseAO = []);
                sc.setState({item:res})
            })
        })
    }

    state = {
        item:{
            loaded:false
        }
    }

    clickSaveVersion = (item,val)=>{
        const sc = this;
        Service.imagePut({version:val,id:item.id},(res)=>{
            item.version = val;
            sc.forceUpdate();
        })
    }

    render(){
        const sc = this;
        const { item } = this.state;
        const params = this.params;
        return (
            <Layout
                crumbList={[
                    {text:params._group,url:`/group/${params._group}`},
                    {text:params._name,url:`/summary/${params._group}/${params._name}/common`},
                    {text:'Images',url:`/releases/${params._group}/${params._name}/common`},
                    {text:params._memo}
                ]}
                menuT={<MenuLayout params={params} />}
                contentT={
                    content.call(sc,item)
                }
            />
        )
    }
}

export default Index;


function content(item){
    const sc = this;
    if(!item.loaded){
        return <Icons.Loading />
    }
    return (
        <div className={clsx("list-info")}>
            <CardHeader className="list-info-header"
                        title={
                            <div>
                                <b className="overflow-text version">V{item.version}</b>
                                <span className="overflow-text time"><Typography variant="body2"><Icons.TimeT data={item.createAt} /></Typography></span>
                            </div>
                        } >
            </CardHeader>
            <Divider light={true} />
            <CardContent className={clsx("list-info-content",'active_content')}>
                <ImageInfoT data={item} handle={sc.clickSaveVersion}/>
            </CardContent>
        </div>
    )
}