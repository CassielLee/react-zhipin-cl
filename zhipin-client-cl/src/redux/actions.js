/*
* 包含n个action creator
* 异步action
* 同步action
* */
import io from 'socket.io-client'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER, RECEIVE_USER_LIST,
  RESET_USER,RECEIVE_MSG_LIST,RECEIVE_MSG,MSG_READ
} from "./action-types";
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg
} from "../api";


/*
* 初始化客户端socketio
*   1 连接服务器
*   绑定用于接收服务器返回chatMsg的监听
*/
function initIO(dispatch, userid) {
  // 1. 创建对象之前: 判断对象是否已经存在, 只有不存在才去创建
  if(!io.socket) {
    // 连接服务器, 得到与服务器的连接对象
    io.socket = io('ws://localhost:4000')  // 2. 创建对象之后: 保存对象
    // 绑定监听, 接收服务器发送的消息
    io.socket.on('receiveMsg', function (chatMsg) {
      //console.log('客户端接收服务器发送的消息', chatMsg)
      // 只有当chatMsg是与当前用户相关的消息, 才去分发同步action保存消息
      // debugger
      if(userid===chatMsg.from || userid===chatMsg.to) {
        //debugger
        //console.log(userid===chatMsg.from || userid===chatMsg.to);
        //console.log(chatMsg);
        dispatch(receiveMsg(chatMsg,userid))
      }
    })

  }
}

//异步获取消息列表，在消息页面点开之前提前获取，但是不用暴露
//有三种情况，会提前获取消息，登陆成功 注册成功 获取用户信息成功
async function getMsgList(dispatch, userid) {
  initIO(dispatch, userid)
  const response = await reqChatMsgList()
  const result = response.data
  if(result.code===0) {
    const {users, chatMsgs} = result.data
    // 分发同步action
    dispatch(receiveMsgList({users, chatMsgs, userid}))
  }
}
//发送消息的异步action
export const sendMsg = ({from,to,content}) => {
  return async dispatch => {
    //console.log({from,to,content});
    io.socket.emit('sendMsg',{from,to,content})
  }
}
//读取消息的异步action
export const readMsg = (fromId,targetId) => {
  return async dispatch => {
    const response = await reqReadMsg(fromId)
    const result = response.data
    if(result.code === 0){
      const count = result.data
      const from = fromId
      const to = targetId
      dispatch(msgRead({from,to,count}))
    }
  }
}

//授权成功的同步action
const authSuccess = (user) => ({type:AUTH_SUCCESS,data:user})
//错误的同步action
const errorMsg = (msg) => ({type:ERROR_MSG,data:msg})
//接受用户的同步action
const receiveUser = (user) => ({type:RECEIVE_USER,data:user})
//重置用户的同步action
export const resetUser = (msg) => ({type:RESET_USER,data:msg})
//接收用户列表的同步action
export const receiveUserList = (userList) => ({type:RECEIVE_USER_LIST,data:userList})
//获取消息列表的同步action
export const receiveMsgList = ({users,chatMsgs,userid}) => ({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
//接收消息的同步action
export const receiveMsg = (chatMsg,userid) => ({type:RECEIVE_MSG,data:{chatMsg,userid}})
//读取了某个聊天消息的同步action
export const msgRead = ({from,to,count}) => ({type:MSG_READ,data:{from,to,count}})


//注册异步action
//注册/登陆操作的成功/失败发送的action的type是一样的
export const register = (user) => {
  const {username,password,password2,type} = user
  //进行前台表单验证，如果不合法返回一个同步action对象，显示提示信息
  if(!username || !password || !type){
    return errorMsg("用户名和密码必须输入！")
  }
  if(password !== password2){
    return errorMsg("密码和确认密码必须相同！")
  }
  //表单数据合法，返回一个发ajax请求的异步action函数
  return async dispatch => {
    //发送注册的异步ajax请求
    const response = await reqRegister({username,password,type})
    const result = response.data
    if(result.code === 0 ){//code为0，则成功
      //分发成功的action
      dispatch(authSuccess(result.data))
      //调用获取消息列表的工具函数
      getMsgList(dispatch,result.data._id)
    }else{//失败
      //分发提示错误信息的action
      dispatch(errorMsg(result.msg))
    }
  }
}

//登陆异步action
export const login = (user) => {
  //取出username,password用于前台表单验证
  const {username,password} = user
  //进行前台表单验证，如果不合法返回一个同步action对象，显示提示信息
  if(!username){
    return errorMsg("用户名必须输入！")
  }else if(!password){
    return errorMsg("密码必须输入！")
  }
  //表单数据合法，返回一个发ajax请求的异步action函数
  return async dispatch => {
    const response = await  reqLogin(user)
    const result = response.data
    if(result.code === 0){
      dispatch(authSuccess(result.data))
      getMsgList(dispatch,result.data._id)
    }
    else{
      dispatch(errorMsg(result.msg))
    }
  }
}

//更新用户信息的异步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user)
    const result = response.data
    if(result.code === 0){//更新成功
      dispatch(receiveUser(result.data))
    }else {
      dispatch(resetUser(result.data))
    }
  }
}

//获取用户信息的异步action
export const getUser = () => {
  return async dispatch => {
    const response = await reqUser()
    const result = response.data
    if(result.code === 0){
      dispatch(receiveUser(result.data))
      getMsgList(dispatch,result.data._id)
    }else{
      dispatch(resetUser(result.msg))
    }
  }
}

//获取用户列表的异步action
export const getUserList = (type) => {
  return async dispatch => {
    //执行异步action
    const response = await reqUserList(type)
    const result = response.data
    //分发同步action
    if(result.code === 0){
      dispatch(receiveUserList(result.data))
    }
  }
}


