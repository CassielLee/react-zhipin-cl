/*
*定义数据库操作模块:
*   包含n个能操作mongodb数据库集合的model模块*/
//1、链接数据库
//1.1 引 入 mongoose
const mongoose = require("mongoose")
//1.2. 连 接 指 定 数 据 库 (URL 只 有 数 据 库 是 变 化 的 )
mongoose.connect("mongodb://localhost:27017/zhipin",{useNewUrlParser:true})
//1.3.获 取 连 接 对 象
const conn = mongoose.connection
//1.4.绑 定 连 接 完 成 的 监 听 ( 用 来 提 示 连 接 成 功 )
conn.once("connected",() => {
    console.log("数据库连接成功~~~");
})
//2.定 义 出 对 应 特 定 集 合 的 Model并 向 外 暴 露
//2.1.字 义 Schema( 描 述 文 档 结 构 )
const userSchema = new mongoose.Schema({
  username:{type:String,required:true},//用户名
  password:{type:String,required:true},//密码
  type:{type:String,required:true},//用户类型 dashen/laoban
  header:{type:String},//头像
  post:{type:String},//投递职位
  info:{type:String},//个人或职位简介
  company:{type:String},//公司名称
  salary:{type:String}//工资
})

//定义聊天消息chats集合的文档结构
const chatSchema = new mongoose.Schema({
  from:{type:String,required:true},//发送消息用户的id
  to:{type:String,required:true},//接受消息用户的id
  chat_id:{type:String,required:true},//from和to组成的字符串
  content:{type:String,required:true},//内容
  read:{type:Boolean,default:false},//标识是否已读
  create_time:{type:Number}//创建时间
})

//2.2.定 义 Model( 与 集 合 对 应 ,可 以 操 作 集 合 )
const UserModel = mongoose.model("user",userSchema)
const ChatModel = mongoose.model('chat',chatSchema)
//2.3.向 外 暴 露 Model
exports.UserModel = UserModel
exports.ChatModel= ChatModel
//因为不止一个模块需要暴露，所以不能采用下面这种方式
//module.exports = UserModel

