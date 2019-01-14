import React from 'react';

import { Route, Link } from 'react-router-dom';

import Login from './login'

import axios from './axios'

import Menus from './components/menu'

import Borrow from './components/money/borrow_money'

import Payback from './components/money/payback'

import Loan from './components/money/loan'

import Recharge from './components/money/balance_excheng_log'

import AutoPay from './components/Recharge/auto_pay'

import Records2 from './components/Recharge/get_point_card_log'

import Records from './components/search/records'

import Exchange from './components/search/exchange'

import crypto from 'crypto'

import Axios from 'axios'

import Web from './web'

import Index from './components/index'

import './style.css'

import { Layout, Menu, Breadcrumb, Icon, Row, Col, Dropdown,message,Input,Button} from 'antd';
const { Header, Content, Sider } = Layout;

var styles = false;

function hash(obj){
  if(obj===''||typeof obj ==='undefined')
  {
      return ''
  }
  const hash = crypto.createHash('md5');
  hash.update(obj);
 return hash.digest('hex')
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

function logout(){
  axios.get('/logout',{sites:getUrl().sites}).then(res=>{
    message.info('退出成功')
    window.location.href = `/?sites=${getUrl().sites}#/login`;
  }).catch(error=>console.log(error))
}
class App extends React.Component {
  constructor(...args)
  {
    super(...args)
 
    this.state = {
      display:{display:'none'},
     overflow:{span:'0'},
     data:{},
    };
  }
  setUser(e)
  {
      this.user[e.target.name]=e.target.value;
  }
  
 componentDidMount()
 { 
   document.title = Web[getUrl().sites].name+'--多人视频代理后台管理系统'
   this.fn()
 }

 fn(){
  Axios({url:`${Web[getUrl().sites].url}/agent/get_agent_info`,params:{sites:getUrl().sites}}).then((res) =>{
    if(res.data.code===100)
    {
      window.location.href = `/?sites=${getUrl().sites}#/login`;
      return;
    }
    if(res.data.code!==200)
    {
      message.error(res.data.msg)
      return;
    }
    res.data.msg.sites=getUrl().sites;
      this.setState ({
        data:res.data.msg
      });
  }).catch(error=>console.log(error))
 }

 hidden()
 {
  styles = !styles
  if(styles)
  {
    this.setState({
      overflow:{
        span:'2'
      }
    })
  }
  else{
    this.setState({
      overflow:{
        span:'0'
      }
    })
  }
 }
 autoPay = ()=>{
  return <AutoPay data ={this.state.data} onSubmit={this.fn.bind(this)}/>
 } 
 Borrow = ()=>{
   return <Borrow data ={this.state.data} onSubmit={this.fn.bind(this)}/>
 }
 Payback = ()=>{
  return <Payback data ={this.state.data} onSubmit={this.fn.bind(this)}/>
 }
Index = ()=>{
  return <Index data ={this.state.data}/>
 }

 setPass()
 {
   this.setState({
     display:{display:'block'}
   })
 }
 Submit(value)
 {
   if(value.oldpass==='')
   {
      delete value.oldpass
      delete value.newpass
   }
   if(value.newpass==='')
   {
      delete value.oldpass
      delete value.newpass
   }
   
   value.oldpass = hash(value.oldpass)
   value.newpass = hash(value.newpass)
   axios.post('/agent/redact_my_info',value).then(res=>{
        message.info('修改成功')
        this.setState({
          display:{display:'none'}
        })
   }).catch(error=>console.log(error))

 }
  render() {

    return (
      <Layout>
        
        <Header className="header">
        <Route path='/set_info' component={({match,history})=>{return <Myinfo {...match} {...history} data={this.state.data} onSubmit={this.Submit.bind(this)}/>}}/>
        <Row style={{color:'#fff'}}>
        <Col  md={10} lg={10} xl={10} xs={{ span:0}}><Icon type="global" style={{color:'#fff',marginLeft:'15px'}}/> {Web[getUrl().sites].name}--多人视频代理管理系统</Col>
        <Col onClick={this.hidden.bind(this)} md={0} lg={0} xl={0}  xs={{ span:3}} style={{color:'black'}}><Icon type="bars" style={{color:'#fff',marginLeft:'15px'}} /></Col>
        <Col md={{span:4,offset:10}}  xs={{ span:3, offset:17}} style={{fontSize:"15px",textAlign:'center'}}><Icon type="user" />
        <Dropdown overlay={
        <Menu>
        <Menu.Item key="2">
        <Link to='/set_info' ><span onClick={this.setPass.bind(this)} ><Icon type="lock" />修改密码</span></Link>
        </Menu.Item>
        <Menu.Item key="1" onClick={logout}>
        <span><Icon type="poweroff" />退出</span>
        </Menu.Item>
        </Menu>
        } placement="bottomCenter">
        <span className="ant-dropdown-link" >
        {Object.keys(this.state.data).length?this.state.data.userId:<a style={{color:'#fff'}} href={`?sites=${getUrl().sites}#/login`}>登陆</a>}<Icon type="down" />
        </span>
        </Dropdown>
        </Col>
        </Row>
        </Header>
        <Layout style={{marginTop:'10px'}}>
        <Row>
        <Col md={5} lg={5} xl={5} xs={this.state.overflow} >
          <Sider width={189} style={{background:'#fff',fontSize:'13px',color:'black',fontWeight:'blod'}}>
          {Object.keys(this.state.data).length?<Menus name={this.state.data}/>:false}
          </Sider>
         </Col>
          </Row>
          <Layout style={{ padding: '10px',paddingTop:'0',overflowX:'scroll'}}>
            <Breadcrumb style={{ margin: '2px 0' }}>
              <Breadcrumb.Item><Link style={{fontSize:'14px',lineHeight:'30px',color:'block'}} to={`/?sites=${getUrl().sites}`}>首页</Link></Breadcrumb.Item>
            </Breadcrumb>
            <Content style={{ background: '#fff', padding:12, margin: 0, minHeight: 280 }}>
            <Route exact path='/' component={this.Index} />
            <Route path='/login' component={Login} />
            <Route path='/auto_pay' component={this.autoPay}/>
            <Route path='/borrow_money' component={this.Borrow}/>
            <Route path='/payback' component={this.Payback} />
            <Route path='/loan' component={Loan}/>
            <Route path='/balance_excheng_log' component={Recharge}/> 
            <Route path='/records' component={Records}/>
            <Route path='/get_point_card_log' component={Records2}/>
            <Route path='/exchange' component={Exchange}/>
        </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

class Myinfo extends React.Component
{
  state={
      user : {
      sites:getUrl().sites,
      true_name:'',
      bank_account:'',
      phone:'',
      provinces:'',
      alipay:'',
      bank_address:'',
      qq:'',
      id_card:'',
      oldpass:'',
      newpass:''
    }
  }
 componentDidMount()
 {
   console.log(this.props)
    this.setState({
      user:this.props.data
    })
 }   

 setUser(e)
 {
   let value = this.state.user;
   value[e.target.name] = e.target.value;
   this.setState({
     user:value
   })
 }
 Submit()
 {
   this.props.onSubmit(this.state.user)
   this.props.goBack()
 }
  render()
  {
    return (
      <div className='get_my_info'>
           <h3 style={{textAlign:'center'}}>编辑个人信息</h3>
           <Input addonBefore='用户名'  value={this.state.user.userId}  disabled/>
           <Input addonBefore='姓名' name='true_name' value={this.state.user.true_name} onChange={ this.setUser.bind(this)}/>
           <Input addonBefore='旧密码' name='oldpass'  onChange={ this.setUser.bind(this)} type='password'/>
           <Input addonBefore='新密码' name='newpass'  onChange={ this.setUser.bind(this)} type='password'/>
           <Input addonBefore='银行账号' name='bank_account' value={this.state.user.bank_account} onChange={ this.setUser.bind(this)}/>
           <Input addonBefore='电话' name='phone' value={this.state.user.phone} onChange={ this.setUser.bind(this)}/>
           <Input addonBefore='省份' name='provinces' value={this.state.user.provinces} onChange={ this.setUser.bind(this)}/>
           <Input addonBefore='支付宝' name='alipay' value={this.state.user.alipay} onChange={ this.setUser.bind(this)}/>
           <Input addonBefore='银行地址' name='bank_address' value={this.state.user.bank_address} onChange={ this.setUser.bind(this)}/>
           <Input addonBefore='qq' name='qq' value={this.state.user.qq} onChange={ this.setUser.bind(this)}/>
           <Input addonBefore='身份证' name='id_card' value={this.state.user.id_card} onChange={ this.setUser.bind(this)}/>
           <br/>
           <Button type='primary' onClick={this.Submit.bind(this)}>提交</Button>
           <Button style={{marginLeft:'20px'}} onClick={()=>{this.props.goBack()}}>关闭</Button>
        </div>
    )
  }
}
export default App;