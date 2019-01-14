import axios from 'axios';

import {message} from 'antd';

import Web from './web'

axios.defaults.withCredentials = true;

function getUrl()
  {
      var json = {}
      var url = window.location.href;
      if(url.match(/\?/gi)===null)
      {
          alert('找不到网站标识符')
          return false;
      }
      var nUrl = url.split('?')[1].split('&');
      for(var i = 0;i<nUrl.length;i++)
      {
        let arr = [];
        arr = nUrl[i].split('=')
        arr[1] = arr[1].split('#')[0]
        json[arr[0]] = arr[1]
      }
     return json;
  }
const Axios = {
    get:(urls,data)=>{
      return new Promise((resolve,reject)=>{
        axios({url:urls,params:data,baseURL:Web[getUrl().sites].url}).then(function(res){
            if(res.data.code===100)
            {
                message.error('您的登陆信息已过期，请重新登陆')
                window.location.href = `/?sites=${getUrl().sites}#/login`;
                reject()
                return false;
            }
            if(res.data.code!==200)
            {
                message.error(res.data.msg)
                reject()
                return false;
            }
            if(res.data.code===200)
            {
                resolve(res.data.msg);
                return ;
            }
        })
     
      })
    },
    post:(urls,datas)=>{
     return new Promise((resolve,reject)=>{
        if(datas==='')
        {
            message.error('请填写必填项')
            reject()
        } 
        axios({method: 'post',url:urls,data:datas,baseURL:Web[getUrl().sites].url}).then(function(res){
            if(res.data.code===200)
            {
                resolve(res.data.msg);
                return;
            }
           if(res.data.code===100)
            {
                message.error('您的登陆信息已过期，请重新登陆')
                window.location.href = `/?sites=${getUrl().sites}#/login`;
                reject()
                return;
            }
           if(res.data.code!==200)
            {
                message.error(res.data.msg)
                reject(res.data.msg)
                return
            }
        })
       })
    },
    all:([],callback)=>{
        axios.all([]).then(callback)
    }
}

export default Axios;