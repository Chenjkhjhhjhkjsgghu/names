import React from 'react';
import { Table, Icon ,Button , Input , DatePicker ,Select,Alert} from 'antd';
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
var types = ['','普通兑换','积分兑换']
function status(arr)
{
    let tx = '';
    switch(arr){
        case 1:
        tx = '待审核'
        break;
        case 2:
        tx = '审核通过—待支付'
        break;
        case 3:
        tx = '已支付'
        break;
        case -1:
        tx = '已取消'
        break;
    }
    return tx;
}
const columns = [{
  title: '兑换编号',
  dataIndex: 'order_id',                              
},{
  title: '提交时间',
  dataIndex: 'create_time',
},{
  title: '金额',
  dataIndex: 'amount',
  render:(text)=>{
      return text/100
  }
},{
    title: '积分',
    dataIndex: 'socre',
    render:(text)=>{
        return text/100
    }
},{
    title: '支付状态',
    dataIndex: 'pay_status',
},{
    title: '兑换主持ID',
    dataIndex: 'user_id',
},{
    title: '兑换代理',
    dataIndex: 'exchange_agent',
},{
    title: '兑换方式',
    dataIndex: 'exchange_type',
},{
    title: '备注',
    dataIndex: 'memo',
}];

class App extends React.Component{
   constructor(...args){
       super(...args)
   }
   state ={
    pagination:{},
    json:{
        num_amount:0,
        no_amount:0,
        await_isno:0,
        is_amount:0,
        await_amount:0
    },
       params:{
        loading:false,
        sites:getUrl().sites,
        id:'',
        exchange_type:'',
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
   fn(params={}){
       this.setState({
           loading:true
       })
    axios.get('/agent/get_score_exchange_log',params).then(res=>{
        if(res.output.length===0)
        {
            this.setState({
                loading:false,
                data:[]
            })
        }
            let json ={
                num_amount:0, //总兑换
                no_amount:0, //已取消
                await_isno:0,//待支付
                is_amount:0,//已支付
                await_amount:0 //待审核
            }
            res.output.map((i,index)=>{
                switch(i.pay_status)
                {
                    case 1:
                    json.await_amount+=i.amount*1/100;
                    break;
                    case 2:
                    json.await_isno+=i.amount*1/100;
                    break;
                    case 3:
                    json.is_amount+=i.amount*1/100;
                    break;
                    case -1:
                    json.no_amount+=i.amount*1/100;
                    break;
                }
                i.key = index;
                i.pay_status = status(i.pay_status)
                i.exchange_type=types[i.exchange_type*1]
                i.create_time = getDate(i.create_time)
             })
             let pagination = {};
             pagination.total = res.count*1;
             pagination.current = res.page*1;
             pagination.pageSize = 20;
             this.setState({
                 json:json,
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
                <Select defaultValue="" style={{ width: 120 }} onChange={this.setType.bind(this)} name='type'>
                <Option value="1">普通兑换</Option>
                <Option value="2">积分换卡</Option>
                <Option value="" >全部</Option>
                </Select>
                <Input placeholder='主持ID' style={{width:'200px',margin:'0 5px'}} name='id' onChange={this.setType1.bind(this)} name='id' onPressEnter={this.searchBar.bind(this)}/>
                <RangePicker format="YYYY-MM-DD  " onChange={this.setType2.bind(this)}  placeholder={['开始时间','结束时间']} name='time'/>
                <Button onClick={this.searchBar.bind(this)} style={{marginLeft:'5px'}}><Icon type="search"/>搜索</Button>
                <div style={{margin:'20px 0'}}>
                <Alert message={`“总计兑换金额 ${this.state.json.await_isno+this.state.json.await_amount+this.state.json.is_amount} 元，其中 已支付兑换 ${this.state.json.is_amount}元，待支付兑换 ${this.state.json.await_isno} 元，待审核兑换${this.state.json.await_amount} 元，已取消兑换${this.state.json.no_amount} 元，已还原兑换 0 元”`} type="info" />
                </div>
                </div>
                <Table scroll={{x:true}} columns={columns} dataSource={this.state.data} loading={this.state.loading} bordered size='small' pagination={this.state.pagination} onChange = {this.current.bind(this)}/>
            </div>
        )
    }
}

export default App; 