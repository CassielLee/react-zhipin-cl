/*
对话聊天的路由组件
 */

import React, {Component} from 'react'
import {NavBar, List, InputItem,Icon,Grid} from 'antd-mobile'
import {connect} from 'react-redux'

import {sendMsg,readMsg} from '../../redux/actions'


const Item = List.Item

class Chat extends Component {

  state = {
    content: '',
    isShow:false//是否显示表情列表
  }
  componentWillMount(){
    this.emojis = ["😊","😀","😁","😂","🤣","😃","😄","😅","😆","😉","😋","😎","😍","😘","😗","😚","🤗","🙂","🤩",
                   "🤔","🤨","😐","😑","😶","🙄","😏","😣","😥","😮","😪","😌","😕","🙃","🤑","😲","☹️","😖","😞",
                   "😤","😢","😱","😰","😵","🤬","😇","😳","😭","😡","🤢","🤫","😷","🤭","💩","👌","✌","💪","✊",
                   "👋","🤚","👀","❤","🙈","🙉","🙊","🌹","🌚","🌝"
    ]
    this.emojis = this.emojis.map(value => ({text:value}))
    //console.log(this.emojis);
  }
  //在第一次渲染之后，自动显示到列表的底部
  componentDidMount(){
    window.scrollTo(0,document.body.scrollHeight)
   // console.log(document.body.scrollHeight);
  }
  //在每一次更新之后，也要自动显示到消息的最底部
  componentDidUpdate(){
    window.scrollTo(0,document.body.scrollHeight)
    //console.log(document.body.scrollHeight);
  }
  componentWillUnmount(){
    if(this.props.chat.unReadCount){
      //发请求更新未读消息的数量
      const fromId = this.props.match.params.userid
      const targetId = this.props.user._id
      this.props.readMsg(fromId,targetId)
    }
  }
  handleSend = () => {
    const content = this.state.content.trim()
    const from = this.props.user._id
    const to = this.props.match.params.userid
    this.props.sendMsg({from,to,content})
    this.setState({content:'',isShow:false})
  }
  toggleShow = () =>{
    const isShow = !this.state.isShow
    this.setState({isShow})
    if(isShow){//解决组件显示表情列表的bug,异步手动派发一个resize事件
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'))
        },0)
    }
  }
  render() {
    const user = this.props.user
    const {users, chatMsgs} = this.props.chat

    // 计算当前聊天的chatId
    const meId = user._id
    if(!users[meId]) { // 如果还没有获取数据, 直接不做任何显示
      return null
    }
    const targetId = this.props.match.params.userid
    const chatId = [meId, targetId].sort().join('_')

    // 对chatMsgs进行过滤
    const msgs = chatMsgs.filter(msg => msg["chat_id"]===chatId)

    // 得到目标用户的header图片对象
    const targetHeader = users[targetId].header
    const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null

    return (
      <div id='chat-page'>
        <NavBar
          icon={<Icon type='left'/>}
          className='stick-header'
          onLeftClick={()=> this.props.history.goBack()}
        >
          {users[targetId].username}
        </NavBar>
        <List style={{marginBottom: 50}}>
          {/*注意此处加了动画之后，无法读取整个文档的高度，也就是说无法自动滑倒列表底部显示，因此此处不加动画了 */}
          {
            msgs.map(msg => {
              if(targetId===msg.from) {// 对方发给我的
                return (
                  <Item
                    wrap
                    key={msg._id}
                    thumb={targetIcon}
                  >
                    {msg.content}
                  </Item>
                )
              } else { // 我发给对方的
                return (
                  <Item
                    wrap
                    key={msg._id}
                    className='chat-me'
                    extra='我'
                  >
                    {msg.content}
                  </Item>
                )
              }
            })
          }
        </List>

        <div className='am-tab-bar'>
          <InputItem
            placeholder="请输入"
            value={this.state.content}
            onChange={val => this.setState({content: val})}
            onFocus = {() => this.setState({isShow:false})} //当输入框获取焦点的时候，表情列表应该隐藏
            extra={
              <span>
                <span className='emoji' onClick={this.toggleShow} style={{marginRight:8}}>😊</span>
                <span onClick={this.handleSend}>发送</span>
              </span>
            }
          />
          {
            this.state.isShow ? (
              <Grid
                data={this.emojis}
                columnNum={7}
                carouselMaxRow={4}
                isCarousel
                onClick={(item) => {
                  this.setState({content:this.state.content + item.text})
                }}
              />
            ): null
          }
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {sendMsg,readMsg}
)(Chat)