import React, { PureComponent } from 'react';

class Index extends PureComponent {
  toLink(url){
    return ()=>{
      url && window.open(url,"_blink")
    }
  }

  toUrl(url){
    return ()=>{
      History.push(url);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }

  initParams(){
    const { match } = this.props;
    this.params =  _.extend({},getParams(),match && match.params);
  }

  renderRoute(url){
    const params = this.params;
    const keys = Object.keys(params);
    url || (url = this.props.match.path);
    keys.map((v)=>{
      url = url.replace(':'+v,params[v]);
    })
    History.push(url);
  }


  ///
  projectsMenuChange = (e,val)=>{
    let url = this.props.match.path;
    let arr = url.split('/');
    arr[3] = val;
    if(val == 'setting'){
      arr[4] = 'common'
    }
    this.renderRoute(arr.join('/'));
  }
}

function getParams(){
  let search = window.location.search;
  let params = {};
  search = search.replace(/^\?/,'')
  search.split("&").map((v)=>{
    let arr = v.split('=');
    arr[0] && (params[arr[0]] = arr[1])
  })
  return params;
}

export default Index;
