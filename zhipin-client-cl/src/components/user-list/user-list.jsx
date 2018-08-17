/*用户列表的UI组件*/
import React from 'react'
import PropTypes from 'prop-types'
import {Card,WingBlank,WhiteSpace} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';

const Header = Card.Header
const Body = Card.Body

class UserList extends React.Component {
  static propTypes = {
    userList:PropTypes.array.isRequired
  }

  render () {
    const {userList} = this.props
    return (
      <WingBlank style={{marginBottom:50,marginTop:50}}>
        <QueueAnim type='scale' delay={100}>
          {
            userList.map(user => (
              <div key={user._id}>
                <WhiteSpace/>
                <Card onClick = {() => this.props.history.push(`/chat/${user._id}`)}>
                  <Header
                    //要判断用户头像是否存在，因为有些 用户只是注册了，并没有完善信息，所以会没有头像
                    thumb={user.header ? require(`../../assets/images/${user.header}.png`):null}
                    extra={user.username}
                  />
                  <Body>
                  <div>职位：{user.post}</div>
                  {user.company? <div>公司：{user.company}</div> : null}
                  {user.company? <div>月薪：{user.salary}</div> : null}
                  <div>描述：{user.info}</div>
                  </Body>
                </Card>
              </div>
            ))
          }
        </QueueAnim>
      </WingBlank>
    );
  }
}

export default withRouter(UserList);