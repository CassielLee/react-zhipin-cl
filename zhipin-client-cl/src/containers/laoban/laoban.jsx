/*老板的主路由模块*/
import React from 'react'
import {connect} from 'react-redux'

import UserList from '../../components/user-list/user-list'
import {getUserList} from '../../redux/actions'


class Laoban extends React.Component {
  componentDidMount(){//在初始化的时候就显示
    this.props.getUserList('laoban')
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
)(Laoban);