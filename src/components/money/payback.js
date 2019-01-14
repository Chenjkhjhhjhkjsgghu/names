import React from 'react';
import axios from './../../axios';
import { Input,Button,message} from 'antd';


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
     borrow:{
        sites:getUrl().sites,
        amount:'',
        memo:''
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
            case 'memo':
            value.memo = e.target.value;
            this.setState({
             borrow:value
            })
            break;
        }
    }
    componentDidMount(){
        this.props.onSubmit()
    }
    Submit()
    {
        if(this.state.borrow.amount==='')
        {
            message.info('请输入金额')
            return;
        }
        if(this.props.data.balance<this.state.borrow.amount*1)
        {
            message.error('额度不足')
            return;
        }
        let value = this.state.borrow;
        value.amount = parseFloat(value.amount)
        axios.post('/agent/repay_money',value).then(res=>{
                message.info('提交成功');
                this.setState({
                    borrow:{
                        sites:getUrl().sites,
                        amount:'',
                        memo:''
                     }
                })
                setTimeout(()=>{
                    this.props.onSubmit()
                },500)
        }).catch(error=>console.log(error))
    }

    render(){
        return (
        <div>
            <h2>还款</h2>
            <div className="borrow">
            <Input addonBefore='当前账户余额:' value={(this.props.data.balance?this.props.data.balance:0)/100} readOnly disabled/>
            <Input addonBefore='当前账户欠款:' value={(this.props.data.debt?this.props.data.debt:0 )/100} readOnly disabled/>
            <Input onChange={this.setDate.bind(this)} name='amount' addonBefore='还款金额:'value={this.state.borrow.amount} />
            <Input onChange={this.setDate.bind(this)} name='memo' addonBefore='备注:' value={this.state.borrow.memo}/>
            <Button onClick={this.Submit.bind(this)}>提交</Button>
            </div>
        </div>
        )
    }
}





export default App;