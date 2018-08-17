/*
  注册路由组件
*/
import React from "react"
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button
} from "antd-mobile"
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'


import {register} from '../../redux/actions'
import Logo from "../../components/logo/logo"
const ListItem = List.Item;

class Register extends React.Component{
  //保存各项文本框的值
  state = {
    username:'',//用户名
    password:'',//密码
    password2:'',//确认密码
    type:'dashen'//用户类型 dashen/laoban
  }
  //处理输入框/单选框变化，将数据收集到state
  handleChange = (name,value) => {
    //更新相应的状态
    this.setState({[name]:value})
  }
  //定义点击监听函数
  register = () => {
    //console.log(JSON.stringify(this.state));
    this.props.register(this.state)
  }
  //点击已有账户跳转到登陆页面
  toLogin = () => {
    //console.log(this.props);
    this.props.history.push('/login')
  }
  render(){
    const {type} = this.state
    const {msg,redirectTo} = this.props.user
    //如果redirectTo有值，则需要跳转到指定页面
    if(redirectTo){
        return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {msg ? <div className="error-msg">{msg}</div>:null}
            <InputItem
              placeholder="请输入用户名"
              onChange={val => this.handleChange('username',val)}
            >
              用户名：
            </InputItem>
            <WhiteSpace/>
            <InputItem
              type="password"
              placeholder="请输入密码"
              onChange={val => this.handleChange('password',val)}
            >
              密&nbsp;&nbsp;&nbsp;码:
            </InputItem>
            <WhiteSpace/>
            <InputItem
              type="password"
              placeholder="请输入确认密码"
              onChange={val => this.handleChange('password2',val)}
            >
              确认密码：
            </InputItem>
            <WhiteSpace/>
            <ListItem>
              <span>用户类型：</span>
              <Radio
                className="my-radio"
                checked={type === 'dashen'}
                onClick={() => this.handleChange('type','dashen')}
              >大神</Radio>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio
                className="my-radio"
                checked={type === 'laoban'}
                onClick={() => this.handleChange('type','laoban')}
              >老板</Radio>
            </ListItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</Button>
            <WhiteSpace/>
            <Button onClick={this.toLogin}>已有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {register}
)(Register);