/*
* 包含所有action的type名称常量的模块
*/
//定义注册/登陆操作成功的action的type
export const AUTH_SUCCESS = 'auth_success' //注册/登陆 成功
export const ERROR_MSG = 'error_msg' //请求之前，数据错误也会出错，请求之后也会出错
export const RECEIVE_USER = 'receive_user'
export const RESET_USER = 'reset_user'
export const RECEIVE_USER_LIST = 'receive_user_list'//接收用户列表
export const RECEIVE_MSG_LIST = 'receive_msg_list'//接收消息列表
export const RECEIVE_MSG = 'receive_msg'//接收一条消息
export const MSG_READ = 'msg_read'//标识消息已读