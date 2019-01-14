import React from 'react';
import { Table, Icon ,Button , DatePicker,Input } from 'antd';
import axios from './../../axios'; 
import moment from 'moment';
import 'moment/locale/zh-cn';

const { RangePicker } = DatePicker;
 
const options = [
    { 'label': '游客', 'value': 100 }, { 'label': '注册用户', 'value': 200 }, { 'label': 'VIP', 'value': 1300 }, { 'label': '终身VIP', 'value': 1310 }, { 'label': '大亨', 'value': 1320 }, { 'label': '超级大亨', 'value': 1330 }, { 'label': '财主', 'value': 1340 }, { 'label': '超级管理', 'value': 1350 }, { 'label': '紫尊', 'value': 1360 }, { 'label': '金尊', 'value': 1370 }, { 'label': '天尊', 'value': 1380 }, { 'label': '帝尊', 'value': 1390 }, { 'label': '天王', 'value': 1391 }, { 'label': '一星主持', 'value': 1710 }, { 'label': '二星主持', 'value': 1720 }, { 'label': '三星主持', 'value': 1730 }, { 'label': '四星主持', 'value': 1740 }, { 'label': '五星主持', 'value': 1750 }, { 'label': '超级主持', 'value': 1760 }, { 'label': 'MC主持', 'value': 1770 }, { 'label': '代理', 'value': 1780 }, { 'label': '巡管', 'value': 1900 }, { 'label': '客服', 'value': 1910 }, { 'label': '站长', 'value': 1920 },
  ];
  
  function ser_dengji(str)
  {
    str = parseInt(str)
    return options.map(i=>{
      if(i.value === str)
      {
        return i.label;
      }
    })
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
  function getDate(arr)
  {
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
var types = ['借','后台借','还','后台还']
const columns = [
{
   title: '开号时间',
   dataIndex: 'createTime',
},{
  title: '等级',
  dataIndex: 'level',                              
},{
  title: '用户id',
  dataIndex: 'userId',
},{
  title: '昵称',
  dataIndex: 'userName',
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
        id:'',
        sites:getUrl().sites,
        start_time:'',
        end_time:'',
        current:1
       },
       data:[],
   }
  
   componentWillMount()
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
    axios.get('/agent/get_create_user_log',params).then(res=>{
        if(res.output.length===0)
        {
            this.setState({
                loading:false,
                data:[]
            })
        }
        res.output.map((i,index)=>{
           i.key = index;
           i.type =types[i.type*1]
           i.createTime = getDate(i.createTime)
           i.level = ser_dengji(i.level)
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
   setType(e)
   {
    let data = this.state.params;
    data.id = e.target.value;
    this.setState({
        params:data
    })
   }
  
    render(){
        return(
            <div>
                <div style={{margin:'20px 0'}}>
                <Input onChange={this.setType.bind(this)} style={{width:'150px',marginRight:'10px'}} placeholder="用户ID" onPressEnter={this.searchBar.bind(this)}/>
                <RangePicker format="YYYY-MM-DD  " onChange={this.setType2.bind(this)}  placeholder={['开始时间','结束时间']} name='time'/>
                <Button onClick={this.searchBar.bind(this)} style={{marginLeft:'5px'}}><Icon type="search"/>搜索</Button>
                </div>
                <Table scroll={{x:true}} pagination={this.state.pagination} loading={this.state.loading} columns={columns} dataSource={this.state.data} bordered  size='small' onChange={this.current.bind(this)}/>
            </div>
        )
    }
}

export default App; 