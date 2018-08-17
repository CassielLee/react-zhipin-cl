/*大神的主路由模块*/
import React from 'react'
import {connect} from 'react-redux'

import {getUserList} from "../../redux/actions";
import UserList from '../../components/user-list/user-list'


class Dashen extends React.Component {
  componentDidMount(){//在初始化的时候就显示
    this.props.getUserList('dashen')
  }
  render () {
    return (
      <div>
        <UserList userList={this.props.userList}/>
      </div>
    );
  }
}


export default connect(
  state => ({userList:state.userList}),
  {getUserList}
)(Dashen) ;