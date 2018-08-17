/*大神信息完善的路由容器组件*/
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


class DashenInfo extends React.Component {
  state = {
    header:'',
    post:'',
    info:'',
  }
  handleChange = (name,value) => {
    this.setState({[name]:value})
  }
  save = () => {
    //console.log(this.state);
    this.props.updateUser(this.state)
  }
  setHeader = (header) => {
    this.setState({header})
  }
  render () {
    //判断是否已经完成信息，如果已经完成，则跳转到相应的界面，如果没有完成，则跳转到信息完善界面
    const {header} = this.props.user
    if(header){//如果头像存在，则代表信息已经完善
      //const path  = type === 'dashen' ? '/dashen' : '/laoban'
      return <Redirect to='/dashen'/>
    }
    return (
      <div>
        <NavBar type="primary">大神信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader}/>
        <List>
          <InputItem placeholder="请输入求职岗位" onChange= {val => {this.handleChange('post',val)}}>求职岗位：</InputItem>
          <TextareaItem title="个人介绍:" rows="3" placeholder="请输入个人介绍" onChange={val => {this.handleChange('info',val)}}></TextareaItem>
          <Button type="primary" onClick={() => this.save(this.state)}>保&nbsp;&nbsp;&nbsp;存</Button>
        </List>
      </div>
    );
  }
}

export default connect(
  state => ({user:state.user}),
  {updateUser}
)(DashenInfo);