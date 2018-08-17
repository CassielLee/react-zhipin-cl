/*
* 登陆路由组件
*/
import React from "react";
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Button
} from "antd-mobile"
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {login} from "../../redux/actions";
import Logo from "../../components/logo/logo"

class Login extends React.Component{
  state={
    username:'',
    password:''
  }
  //处理输入框/单选按钮的状态变化
  handleChange = (name,value) => {
    this.setState({
      [name]:value
    })
  }
  //点击“还没有账户”按钮，跳转到注册界面
  toRegister = () => {
    this.props.history.replace('/register')
  }
  //登陆函数
  login = () => {
    //console.log(JSON.stringify(this.state));
    this.props.login(this.state)
  }
  render(){
    const {msg,redirectTo} = this.props.user
    if(redirectTo){
        return <Redirect to={redirectTo}/>
    }
    return(
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
              密&nbsp;&nbsp;&nbsp;码：
            </InputItem>
            <Button type="primary" onClick={this.login}>登&nbsp;&nbsp;&nbsp;&nbsp;陆</Button>
            <WhiteSpace/>
            <Button onClick={this.toRegister}>还没有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}
export default connect(
  state => ({user:state.user}),
  {login}
)(Login);