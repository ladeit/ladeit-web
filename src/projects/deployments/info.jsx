import React from 'react';
import {
    withStyles,Typography,IconButton,Divider,
    Paper
} from '@material-ui/core';

import Component from '@/Component.jsx'
import Layout from '@/layout1/dashboard.jsx'
import MenuLayout from '@/layout1/NavBar.jsx'
import Service from '../Service'
import intl from 'react-intl-universal'
//import LabelGrid from '@/components/Grid/label_grid.jsx'
import TableT from '@/components/Table/table.jsx'
import Icons from 'components/Icons/icons.jsx'
import Inputs from 'components/Form/inputs.jsx'
import Moment from 'moment'

let STATUS = []
const styles = theme => ({
});

@withStyles(styles)
class Index extends Component{

  componentWillMount(){
      STATUS = [intl.get('services.deploy.status.1'),intl.get('services.deploy.status.2'),intl.get('services.deploy.status.3'),intl.get('services.deploy.status.4')];
      //
    const sc = this;
    this.initParams();
    this.tab = Store.project.headerTabList;
    this.$table = {
      noChecked:true,
      dense:true,
      columns:[
        { id: 'createBy', disablePadding: true, label: intl.get('services.deploy.releaseCreateBy'),render(row){
            return <span className="link2" onClick={sc.toUrl(`/profile/${row.createBy}`)}>{row.createBy}</span>
        }},
        { id: 'target', label: intl.get('services.deploy.releaseType') },// service / candidate / release / image / service_group
        { id: 'eventLog', label: intl.get('services.deploy.releaseDetail') }, // 操作事件
        { id: 'createAt', label: intl.get('services.deploy.releaseTime'), render:(row)=>{
          return <Icons.TimeT data={row.createAt} />
        }},//
      ]
    }
  }

  componentDidMount(){
    let sc = this;
    let params = this.params;
    Service.releaseMap({ReleaseId:params.id,ReleaseName:''},(res)=>{
      let one = res;
      let format = "YYYY-MM-DD HH:mm:SS";
      one.status_text = STATUS[one.status];
      one.deployStartAt = one.deployStartAt && Moment(one.deployStartAt).format(format);
      one.serviceStartAt = one.serviceStartAt && Moment(one.serviceStartAt).format(format);
      one.serviceFinishAt = one.serviceFinishAt && Moment(one.serviceFinishAt).format(format);
      sc.refs.$form.setData(one);
      sc.setState({data:one});
    })
  }

  state = {
    data:{},
    form:[
        {label:intl.get('services.deploy.labelName'),name:'name',size:12,inputProps:{disabled:true,value:' '}},
        {label:intl.get('services.deploy.labelStatus'),name:'status_text',inputProps:{disabled:true,value:' '}},
        {label:intl.get('services.deploy.labelChannel'),name:'operChannel',inputProps:{disabled:true,value:' '}},
        {label:intl.get('services.deploy.labelCreateBy'),name:'createBy',inputProps:{disabled:true,value:' '}},
        {label:intl.get('services.deploy.labelCreateAt'),name:'deployStartAt',inputProps:{disabled:true,value:' '}},
        {label:intl.get('services.deploy.labelWorkStart'),name:'serviceStartAt',inputProps:{disabled:true,value:' '}},
        {label:intl.get('services.deploy.labelWorkEnd'),name:'serviceFinishAt',inputProps:{disabled:true,value:' '}}
    ]
  }

  render(){
    const { classes } = this.props;
    const { data,form } = this.state;
    const params = this.params;
    return (
        <Layout
            crumbList={[
              {text:params._group,url:`/group/${params._group}`},
              {text:params._name,url:`/summary/${params._group}/${params._name}/${params._memo}`},
              {text:"Releases",url:`/deployments/${params._group}/${params._name}/common`},
              {text:params._release}
            ]}
            menuT={<MenuLayout params={params} />}
            contentT={
              <div>
                <Inputs.Form data={form} className="small" ref="$form"/>
                <br/>
                <TableT
                  rows={data.operations||[]}
                  onRef={this.$table}
                />
              </div>
            } >
        </Layout>

    )
  }
}

export default Index;
