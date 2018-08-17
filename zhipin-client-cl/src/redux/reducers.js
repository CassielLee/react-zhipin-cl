/*
*包含n个reducer函数：根据老的state和指定的action返回一个新的state
*/
import {combineReducers} from "redux"
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER, RECEIVE_USER_LIST,
  RESET_USER,RECEIVE_MSG_LIST,RECEIVE_MSG,MSG_READ
} from "./action-types";

import {getRedirectPath} from "../utils";

//定义初始化的initUser
const initUser = {//注意，数据从后台返回回来并没有包含密码
  username:'',//用户名
  type:'',//类型
  msg:'',//错误提示信息
  redirectTo:''//需要自动跳转的路由path
}
//产生user状态的reducer
function user(state=initUser,action) {
  switch (action.type){
    case AUTH_SUCCESS://data是user
      //其实这里的redirectTo有四种情况
      // 分别对应于:大神登陆成功->老板列表界面，老板登录成功->大神列表界面，大神注册成功->大神完善信息界面，老板注册成功->老板完善信息界面
      const {type,header} = action.data
      const redirectTo = getRedirectPath(type,header)
      return {...action.data,redirectTo}
    case ERROR_MSG://data是msg
      return {...state,msg:action.data }
    case RECEIVE_USER:
      return action.data
    case RESET_USER:
      return {...initUser,msg:action.data}
    default:
      return state
  }
}

//产生userlist状态的reducer
const initUserList = []
function userList(state=initUserList,action) {
    switch (action.type){
      case RECEIVE_USER_LIST://data此时为userList
        return action.data
      default:
        return state
    }

}

//定义聊天的初始数据
const initChat = {
  users:{},  //所有用户集合对象{id1:user1,id2:user2}
  chatMsgs:[], //消息数组[{from:id1,to:id2}{content}]
  unReadCount:0  //总的未读消息的数量

}
//管理聊天对象信息数据的reducer
function chat(state=initChat,action) {
    switch (action.type){
      case RECEIVE_MSG://返回的data就是一个chatMsg，因此这里不需要解构赋值，否则就会报错
        const {chatMsg} = action.data
        return {
          users:state.users,
          chatMsgs:[...state.chatMsgs,chatMsg],
          unReadCount:state.unReadCount + (!chatMsg.read && chatMsg.to === action.data.userid ? 1 : 0)
        }
      case RECEIVE_MSG_LIST:
        var {users,chatMsgs,userid} = action.data
        return {
          users,
          chatMsgs,
          unReadCount:chatMsgs.reduce((preTotal,msg) => preTotal + (!msg.read && msg.to === userid ? 1 : 0),0)
        }
      case MSG_READ:
        const {from,to,count} = action.data
        return {
          users:state.users,
          chatMsgs:state.chatMsgs.map((msg) => {
            if(msg.from === from && msg.to === to && !msg.readMsg){//需要更新
              return {...msg,read:true}//相当于返回msg的一个副本，然后将read属性设置为true
            }else {//不需要更新
              return msg
            }
          }),
          unReadCount:state.unReadCount - count
        }
      default:
        return state
    }
}

export default combineReducers({//用于拆分的reducer
  user,
  userList,
  chat
})
//向外暴露的state的结构：{user:{},userList:[],chat:{}}

