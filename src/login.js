import React from 'react'
import './login.css'
import axios from './axios'
import { Form, Icon, Input, Button,message} from 'antd';
import crypto from 'crypto'
import Web from './web'
const FormItem = Form.Item;
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
class NormalLoginForm extends React.Component {
  constructor(...args){
    super(...args)
    this.fn()
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const hash = crypto.createHash('md5');
        const object2 = Object.assign({sites:getUrl().sites},values)
        hash.update(object2.password);
        object2.password = hash.digest('hex')
        axios.post('/agent_login',object2).then(res=>{
        message.info('登陆成功')
        window.location.href = '/?sites='+getUrl().sites
        }).catch(error=>console.log(error))
      }
    });
  }
  fn()
  {
    const oParent = document.createElement('div');
    oParent.style.width="100%";
    oParent.style.height="100%";
    oParent.style.position='absolute';
    oParent.style.top="0";
    oParent.style.background = '#6fb3e0';
    document.body.append(oParent); 
  }
  render() {

    const { getFieldDecorator } = this.props.form;
    return (
      <div className="data_bj">
      <div className="login_box">
      <Form onSubmit={this.handleSubmit} className="login-form">
          <h2 style={{textAlign:"center",color:"black"}}>{Web[getUrl().sites].name}</h2>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入您的用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入您的密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登陆
          </Button>
          <a href={`/register?sites=${getUrl().sites}`}>代理商注册</a>
        </FormItem>
      </Form>
          </div> 
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);


export default WrappedNormalLoginForm;