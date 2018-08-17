/*老板信息完善的路由容器组件*/
import React from 'react'
import {connect} from 'react-redux'
import {
  Button,
  NavBar,
  InputItem,
  TextareaItem,
  List
} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import HeaderSelector from '../../components/header-selector/header-selector'
import {updateUser} from "../../redux/actions";

class LaobanInfo extends React.Component {
  state = {
    header:'',
    post:'',
    info:'',
    company:'',
    salary:''
  }
  handleChange = (name,value) => {
    this.setState({[name]:value})
    //console.log(this.state);
  }
  save = () => {
    //console.log(this.state);
    this.props.updateUser(this.state)
  }
  //更新header状态函数
  setHeader = (header) => {
    this.setState({header})
  }
  render () {
    const {header} = this.props.user
    if(header){//信息已经完善
      //const path = type === 'laoban' ? '/laoban' : '/dashen'
      return <Redirect to='/laoban'/>
    }
    return (
      <div>
        <NavBar type="primary">老板信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <List>
          <InputItem placeholder="请输入招聘职位" onChange={val => {this.handleChange('post',val)}}>招聘职位：</InputItem>
          <InputItem placeholder="请输入公司名称" onChange={val => {this.handleChange('company',val)}}>公司名称：</InputItem>
          <InputItem placeholder="请输入职位薪资" onChange={val => {this.handleChange('salary',val)}}>职位薪资：</InputItem>
          <TextareaItem title="职位要求:" rows="3" placeholder="请输入职位要求" onChange={val => {this.handleChange('info',val)}}></TextareaItem>
          <Button type="primary" onClick={() => {this.save(this.state)}}>保&nbsp;&nbsp;&nbsp;存</Button>
        </List>
      </div>
    );
  }
}

export default connect(
  state => ({user:state.user}),
  {updateUser}
)(LaobanInfo);