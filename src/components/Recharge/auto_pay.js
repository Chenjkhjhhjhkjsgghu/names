import React from 'react';
import axios from './../../axios';
import { Input,Button,message,Switch ,Radio,Icon} from 'antd';

const RadioGroup = Radio.Group;
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
class App extends React.Component{
    constructor(...args)
    {
        super(...args)
    }
    state ={
     display:{display:'none'},
     balance:'',
     nickName:'',
     coin:'',
     dialog:{
        amount: 50,
        coin: 50000,
        coin_after: 5228000,
        coin_before: 228000
     },
     borrow:{
        sites:getUrl().sites,
        amount:'',
        memo:'',
        is_pay:true,
        client_id:''
     }
    }
  
    setDate(e)
    {
        let value = this.state.borrow;
        switch(e.target.name)
        {
            case 'amount':
            value.amount = e.target.value;
            this.setState({
             borrow:value
            })
            break;
            case 'client_id':
            value.client_id = e.target.value;
            this.setState({
             borrow:value
            })
            break;
            case 'memo':
            value.memo = e.target.value;
            this.setState({
             borrow:value
            })
            break;
        }
    }
    Submit()
    {
        if(this.state.borrow.client_id==='')
        {
            message.error('您输入ID')
            return;
        }
        if(this.state.borrow.amount==='')
        {
            message.error('请输入金额')
            return;
        }
        if(this.props.data.balance/100<this.state.borrow.amount*1)
        {
            message.error('额度不足')
            return;
        }
        let value = this.state.borrow;
        axios.post('/agent/client_recharge',value).then(res=>{
                message.info('提交成功');
                this.setState({
                    dialog:res,
                    display:{display:'block'}
                })
                setTimeout(()=>{
                    this.props.onSubmit()
                },500)
        }).catch(error=>console.log(error))
    }
    setAount(e)
    {
       if(!e.target.value)
       {
         this.refs['inp'].focus()
       }
       let value = this.state.borrow;
       value.amount = e.target.value;
       this.setState({
           borrow:value
       })
    }
    componentDidMount(){
        this.props.onSubmit()
    }
    Switch(e)
    {
        let value = this.state.borrow;
        value.is_pay = e;
        this.setState({
            borrow:value
        })
    }
    serachId(e)
    {
        if(e.target.value==='')
        {
            return;
        }
        axios.post('/agent/get_client_info',this.state.borrow).then(res=>{
            this.setState({
                nickName:res['nickname'],
                coin:res['coin']
            })
        }).catch(error=>console.log(error))
    }
    onClose()
    {
        this.setState({
            display:{
                display:'none'
            }, borrow:{
                sites:getUrl().sites,
                amount:'',
                memo:'',
                is_pay:true,
                client_id:''
             }
        })
    }
    redirect()
    {
      let url = `https://pay.fq98.com:88/pay/agent.html?userid=${this.props.data.userId}&sites=${getUrl().sites}`;
       this.refs['redict'].onclick=function(){
        window.open(url)
    }
    this.refs['redict'].click();
    }
    render(){
        return (
        <div>
            <a ref='redict' style={{display:'none'}} target='_blank'></a>
            <h2>代客直充</h2>
            <div className="borrow1">
            <div className='dialog' style={this.state.display}>
            <div>
            <h2><Icon type="check" style={{color:'green'}}/>充值成功</h2>
            <span>操作ID:<b>{this.state.borrow.client_id}</b></span>
            <span>操作金额:<b style={{color:'red'}}>{this.state.borrow.amount}</b></span>
            <span>操作币值:<b style={{color:'red'}}>{this.state.dialog.coin}</b></span>
            <span>操作前币值:<b>{this.state.dialog.coin_before}</b></span>
            <span>操作后币值:<b>{this.state.dialog.coin_after}</b></span>
            <Icon type="close" onClick={this.onClose.bind(this)}/>
             </div>
             </div>
            <Input addonBefore='当前账户余额:' style={{width:'320px'}} value={isNaN(this.props.data.balance)?0:this.props.data.balance*1/100} readOnly disabled/> 
            <Button type="primary" style={{height:'30px',fontSize:'13px',margin:'20px 0 0 10px'}} onClick={this.redirect.bind(this)} >充值</Button>
            <Input addonBefore='充值用户id:' value={this.state.borrow.client_id}  onChange = {this.setDate.bind(this)} name = 'client_id' onBlur={this.serachId.bind(this)} addonAfter={this.state.nickName}/>
            <Input addonBefore='用户币值:' value={this.state.coin} readOnly disabled/>
             <span>客户是否已付款:</span> <Switch defaultChecked={this.state.borrow.is_pay} onChange={this.Switch.bind(this)}  checkedChildren={'是'} unCheckedChildren={'否'}/>
            <Input ref='inp' value={this.state.borrow.amount} onChange={this.setDate.bind(this)} name='amount' addonBefore='充值金额:' addonAfter='元'/>
            <RadioGroup  defaultValue={this.state.borrow.amount} onChange={this.setAount.bind(this)}>
            <Radio value={50}>50元（500万币）</Radio>
            <Radio value={100}>100元（1000万币）</Radio>
            <Radio value={200}>200元（2000万币）</Radio>
            <Radio value={500}>500元（5000万币）</Radio>
            <Radio value={0}>自定义金额</Radio>
            </RadioGroup>
            <Input onChange={this.setDate.bind(this)} name='memo' addonBefore='备注:' />
            <Button onClick={this.Submit.bind(this)}>提交</Button>
            </div>
        </div>

        )
    }
}





export default App;