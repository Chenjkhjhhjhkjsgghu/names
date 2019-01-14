import React from 'react';
import { Table, Icon ,Button , Input ,Popconfirm , message , DatePicker ,Select} from 'antd';
import axios from './../../axios'; 
import moment from 'moment';


import 'moment/locale/zh-cn';
 
const Option = Select.Option;

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
var types = ['','代客直充','第三方充值','后台生成']

function setStatus(obj)
{
    if(obj)
    {
        return '使用'
    }
    return '未使用'
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
function setStatus2(obj)
{
    if(obj)
    {
        return '已付款'
    }
    return '未付款'
}
 

const columns = [{
  title: '卡号',
  dataIndex: 'card_number',                              
},{
  title: '卡密',
  dataIndex: 'password',
},{
  title: '类型',
  dataIndex: 'type',
},{
    title: '充卡会员',
    dataIndex: 'user_id',
},{
    title: '价值',
    dataIndex: 'amount',
    render:(text)=>{
        return text/100
    }
},{
    title: '币',
    dataIndex: 'coin',
    render:(text)=>{
        return text/100
    }
},{
    title: '使用状态',   // ，true为使用
    dataIndex: 'use_status',
},{
    title: '生成时间',
    dataIndex: 'create_time',
},{
    title: '备注',
    dataIndex: 'memo',
},{
    title: '客户付款状态',  //true
    dataIndex: 'pay_status',
}];

class App extends React.Component{
   constructor(...args){
       super(...args)
   }
   state ={
    card_number:'',
    loading:false,
    pagination:{},
    order_list:[],
       params:{
        sites:getUrl().sites,
        id:'',
        type:'',
        start_time:'',
        end_time:'',
        current:1
       },
       data:[],
   }
   componentWillMount()
   {
       this.fn(this.state.params)
   }
   setCard(e){
    this.setState({
        card_number:e.target.name
    })
   }
   confirm()
   {
       axios.post('/agent/confirm_pay',{sites:getUrl().sites,card_number:this.state.card_number}).then(res=>{
               message.info('确定到账成功')
               this.fn(this.state.params)
       }).catch(error=>console.log(error))
   }
   cancel()
   {
       message.error('取消操作')
   }
   fn(params={}){
       this.setState({
           loading:true
       })
    axios.get('/agent/get_point_card_log',params).then(res=>{
        res.output.map((i,index)=>{
           i.key = index;
           if(!i.pay_status===true)
           {
               i.todo = (
                <Popconfirm title={`是否为卡号${i.card_number}确认到账?`} onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="是" cancelText="否">
                  <Button type="primary" onClick={this.setCard.bind(this)} name={i.card_number} >
                      确认到账
                  </Button>
                  </Popconfirm>
               )
           }
           i.use_status = setStatus(i.use_status)
           i.type=types[i.type*1]
           i.create_time = getDate(i.create_time)
           i.pay_status = setStatus2(i.pay_status)
        })
        let pagination = {};
        pagination.total = res.count*1;
        pagination.current = res.page*1;
        pagination.pageSize = 20;
        this.setState({
            data:res.output,
            loading:false,
            pagination:pagination
        })
    }).catch(error=>console.log(error))
   }
   searchBar()
   {
       let value = this.state.params;
       value.current = 1;
       this.fn(value)
   }
   setType(e)
   {
     let date =this.state.params;
     date.type = e;
     this.setState({
         params:date
     })
   }
   setType1(e)
   {
     let data = this.state.params;
     data[e.target.name] = e.target.value;
     this.setState({
         params:data
     })
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
  current(e)
  {
      let value = this.state.params;
      value.current = e.current;
      this.fn(value)
  }
    render(){
        return(
            <div>
                <div style={{margin:'20px 0'}}>
                <span>兑换状态：</span>
                <Select defaultValue={this.state.params.type} style={{ width: 120 }} onChange={this.setType.bind(this)} name='type'>
                <Option value={'true'}>已付款</Option>
                <Option value={'false'}>未付款</Option>
                <Option value={''} >全部</Option>
                </Select>
                <Input placeholder='用户ID' style={{width:'200px',margin:'0 5px'}} name='id' onChange={this.setType1.bind(this)} name='id' onPressEnter={this.searchBar.bind(this)}/>
                <RangePicker format="YYYY-MM-DD  " onChange={this.setType2.bind(this)}  placeholder={['开始时间','结束时间']} name='time'/>
                <Button onClick={this.searchBar.bind(this)} style={{marginLeft:'5px'}}><Icon type="search"/>搜索</Button>
                </div>
                <Table scroll={{x:true}} columns={columns} loading={this.state.loading} dataSource={this.state.data} bordered size='small' pagination={this.state.pagination} onChange = {this.current.bind(this)}/>
            </div>
        )
    }
}

export default App; 