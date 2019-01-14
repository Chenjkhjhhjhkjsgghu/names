import React from 'react';

import { Menu, Icon} from 'antd';

import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

class System extends React.Component{
 constructor(...args)
 {
     super(...args)
     this.state = {
         arr:['sub1'],
         index:''
     }
 }
 fn(e)
 {
     
     let arr = [];
     arr.push(e.key)
     if(arr[0] == this.state.arr[0])
     {
         arr=[];
     }
     this.setState({
         arr:arr
     })
 }
 fnn(e)
 {
     this.setState({
        index:e.key
     })
 }
    render(){
    const str =  <Menu
    openKeys={this.state.arr}
    mode="inline"
    onClick={this.fnn.bind(this)}
    style={{ height: '100%' }}
   >
   <SubMenu onTitleClick={this.fn.bind(this)} key='sub1' title={<span><Icon type="credit-card" /><span>充值管理</span></span>}>
       <Menu.Item><Link to='auto_pay'>代客直充</Link></Menu.Item>
       <Menu.Item>购买VIP卡</Menu.Item>
       <Menu.Item><Link to='get_point_card_log'>点卡查询</Link></Menu.Item>
       <Menu.Item>搬家卡查询</Menu.Item>
   </SubMenu>
   <SubMenu onTitleClick={this.fn.bind(this)} key='sub2' title={<span><Icon type="pay-circle" /><span>财务管理</span></span>}>
       <Menu.Item><Link to='borrow_money'>借款</Link></Menu.Item>
       <Menu.Item><Link to='payback'>还款</Link></Menu.Item>
       <Menu.Item><Link to='loan'>借款明细</Link></Menu.Item>
       <Menu.Item><Link to='balance_excheng_log'>资金流水</Link></Menu.Item>
   </SubMenu>
   <SubMenu onTitleClick={this.fn.bind(this)} key='sub3' title={<span><Icon type="search" /><span>信息查询</span></span>}>
       <Menu.Item><Link to='records'>开号记录查询</Link></Menu.Item>
       <Menu.Item><Link to='exchange'>主持兑换查询</Link></Menu.Item>
       <Menu.Item>主持在线情况</Menu.Item>
   </SubMenu>
    </Menu>
      return(
        <div>
         {str}
       </div>
        )
    }
}


export default  System;
