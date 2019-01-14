import React from 'react';

import { Card, Col, Row ,Button} from 'antd';

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
            <div style={{ background: '#68adde', padding: '30px' ,borderRadius:'10px'}}>
            <a ref='redict' style={{display:'none'}} target='_blank'></a>
            <Row>
              <Col span="8">
                <Card style={{height:'130px'}} title="当前账户欠款" bordered={true}>
                {isNaN(this.props.data.debt)?0:this.props.data.debt/100}
                </Card>
              </Col>
              <Col span="8" >
                <Card style={{height:'130px'}} title="本月销售总额" bordered={true}>{isNaN(this.props.data.month)?0:this.props.data.month/100}</Card>
              </Col>
              <Col span="8">
                <Card style={{height:'130px'}} title="账户可用余额" bordered={true}>{isNaN(this.props.data.balance)?0:this.props.data.balance/100}<Button type="primary" style={{marginLeft:'10px',height:'25px',fontSize:'13px'}} onClick={this.redirect.bind(this)}>充值</Button></Card>
              </Col>
            </Row>
          </div>
        )
    }
}

export default App;