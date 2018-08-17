/*消息的主路由模块*/
import React from 'react'
import {connect} from "react-redux";
import {List,Badge} from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

const Item = List.Item
const Brief = Item.Brief

/*
* 对chatMsgs按chat_id进行分组，并得到每组的lastMsg组成的数组
*   1 找出每个聊天的lastMsg，并用一个对象来保存{chat_id:lastMsg}
*   2 得到所有lastMsg的数组
*   3 对数组按create_time进行降序排序
* */
const getLastMsgs = (chatMsgs,userid) => {
  //1 找出每个聊天的lastMsg，并用一个对象来保存{chat_id:lastMsg}
  const lastMsgsObj = {}
  chatMsgs.forEach(msg => {
    //对msg进行未读数量的统计，有可能是0(我发给别人的，就不用算成未读消息)，也有可能是1(别人发给我的未读消息)
    //满足条件：1 别人发给我；2 未读的消息
    if(msg.to === userid && !msg.read ){
      msg.unReadCount =  1
    }else{
      msg.unReadCount =  0
    }
    //得到msg的chat_id
    const chatId = msg.chat_id
    //获取已保存的lastMsgsOb所对应的当前chat_id的lastMsg
    let lastMsg = lastMsgsObj[chatId]
    if(!lastMsg){//不存在,说明当前msg就是所在组的lastMsg
      lastMsgsObj[chatId] = msg
    }else {//如果存在，则要看当前msg是不是比已有的lastMsg还要新，如果是的话，则保存，不是的话就不保存
      //保存已经统计的未读数量
      //累加unReadCont = 原有的unReadCount + 当前msg的unReadCount
      const unReadCont = lastMsg.unReadCount + msg.unReadCount
      if(msg.create_time > lastMsg.create_time){
        lastMsgsObj[chatId] = msg
      }
      //统计每个组最新的未读消息的数量，并保存
      lastMsgsObj[chatId].unReadCount = unReadCont
    }
  })
  //2 得到所有lastMsg的数组
  const lastMsgs = Object.values(lastMsgsObj)
  //3 对数组按create_time进行降序排序
  lastMsgs.sort((m1,m2) => {
    return m2.create_time - m1.create_time
  })
  return lastMsgs
}

class Message extends React.Component {
  render () {
    const {user} = this.props
    const {users,chatMsgs} = this.props.chat
    //对chatMsgs按chat_id进行分组，找出每组最后一条记录(最新消息),显示在消息列表上
    const lastMsgs = getLastMsgs(chatMsgs,user._id)
    return (
      <div>
        <List className='msg-list'>
          <QueueAnim type='scale' delay={100}>
            {
              lastMsgs.map(msg => {
                const targetId = user._id === msg.from ? msg.to : msg.from
                return (
                  <Item
                    key={msg._id}
                    thumb={users[targetId].header ? require(`../../assets/images/${users[targetId].header}.png`) : null}
                    arrow="horizontal"
                    onClick={() => this.props.history.push(`/chat/${targetId}`)}
                    extra={<Badge text={msg.unReadCount} hot/>}
                  >
                    {users[targetId].username}
                    <Brief>{msg.content}</Brief>
                  </Item>
                )
              })
            }
          </QueueAnim>
        </List>
      </div>
    );
  }
}


export default connect(
  state => ({user:state.user,chat:state.chat}),//需要用户信息和聊天信息，其中聊天信息中包含了用户列表和消息记录
)(Message) ;