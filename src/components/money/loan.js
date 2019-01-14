import React from 'react';
import { Table, Icon ,Button , DatePicker } from 'antd';
import axios from './../../axios'; 
import moment from 'moment';

import 'moment/locale/zh-cn';
const { RangePicker } = DatePicker;
 
function getDate(arr)
{
    if(arr===''||arr===null)
    {
        return '';
    }
  var time = new Date(arr)
 var s = '';
 s += time.getFullYear() + '-';          // 获取年份。
 if (time.getMonth() < 9) {
     s += '0' + (time.getMonth() + 1) + "-";         // 获取月份。
 } else {
     s += (time.getMonth() + 1) + "-";         // 获取月份。
 }
 if (time.getDate() < 10) {
     s += '0' + time.getDate()+' ';                 // 获取日。
 } else {
     s += time.getDate() +' ';                 // 获取日。
 }
 if (time.getHours() < 10) {
     s += '0' + time.getHours()+ ":";                 // 获取小时。
 } else {
     s += time.getHours()+ ":";                 // 获取小时。
 }
 if (time.getMinutes() < 10) {
     s += '0' + time.getMinutes()+ ":";                 // 获取分钟。
 } else {
     s += time.getMinutes()+ ":";                 // 获取分钟。
 }
 if (time.getSeconds() < 10) {
     s += '0' + time.getSeconds();                 // 获取秒。
 } else {
     s += time.getSeconds();                 // 获取秒。
 }
 return (s);                          // 返回时间。
}
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
var types = ['借款','后台借款','还款','后台还款']
const columns = [{
  title: '订单号',
  dataIndex: 'order_id',                              
},{
  title: '用户id',
  dataIndex: 'user_id',
},{
  title: '操作金额',
  dataIndex: 'amount',
  render:(text)=>{
    return `${text/100}`
}
},{
  title: '操作前余额',
  dataIndex: 'balance_before',
  render:(text)=>{
    return `${text/100}`
}
},{
  title: '操作后余额',
  dataIndex: 'balance_after',
  render:(text)=>{
    return `${text/100}`
}
},{
    title: '操作前欠款',
    dataIndex: 'debt_before',
    render:(text)=>{
        return `${text/100}`
    }
 },{
    title: '操作后欠款',
    dataIndex: 'debt_after',
    render:(text)=>{
        return `${text/100}`
    }
},{
    title: '类型',
    dataIndex: 'type',
},{
    title: '备注',
    dataIndex: 'memo',
},{
    title: '发生时间',
    dataIndex: 'create_time',
}

];

class App extends React.Component{
   constructor(...args){
       super(...args)
   }
   state ={
      pagination: {},
      loading:false,
       params:{
        sites:getUrl().sites,
        start_time:'',
        end_time:'',
        current:1
       },
       data:[],
   }
  
   componentDidMount()
   {
       this.fn({sites:getUrl().sites,current:1})
   }

   current(params)
   {
        var value = this.state.params;
        value.current = params.current
         this.fn(value)
   }
   fn(params={}){
       this.setState({
           loading:true
       })
    axios.get('/agent/borrow_money_log',params).then(res=>{
        res.output.map((i,index)=>{
           i.key = index;
           i.type =types[i.type*1]
           i.create_time = getDate(i.create_time)
        })
        let pagination ={};
        pagination.total = res.count*1;
        pagination.current = res.page*1;
        pagination.pageSize = 20;
        this.setState({
            data:res.output,
            pagination:pagination,
            loading:false
        })
    }).catch(error=>console.log(error))
   }
   searchBar()
   {
       let value = this.state.params;
       value.current = 1;
       this.fn(value)
   }
   setType2(e,string)
   {
    let data = this.state.params;
    data.end_time = string[1] + '23:59:59';
    data.start_time = string[0]+ '00:00:00';
    this.setState({
        params:data
    })
   }
  
    render(){
        return(
            <div>
                <div style={{margin:'20px 0'}}>
                <RangePicker format="YYYY-MM-DD  " onChange={this.setType2.bind(this)}  placeholder={['开始时间','结束时间']} name='time'/>
                <Button onClick={this.searchBar.bind(this)} style={{marginLeft:'5px'}}><Icon type="search"/>搜索</Button>
                </div>
                <Table scroll={{x:true}} pagination={this.state.pagination} columns={columns} loading={this.state.loading} dataSource={this.state.data} bordered  size='small' onChange={this.current.bind(this)}/>
            </div>
        )
    }
}

export default App; 