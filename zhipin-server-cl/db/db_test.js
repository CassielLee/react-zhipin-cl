const md5 = require("blueimp-md5")
//引入mongoose
const mongoose = require('mongoose')
//连接指定数据库
mongoose.connect("mongodb://localhost:27017/zhipin",{useNewUrlParser:true})
//获取连接对象
const conn = mongoose.connection
conn.on("connected",function () {
    console.log("连接成功~~");
})

//得到对应特定集合的Model
//定义Schema
const Schema = mongoose.Schema
const userSchema = new Schema({//指定文档结构
  username:{type:String,require:true},//用户名的要求
  password:{type:String,require:true},//密码要求
  type:{type:String,require:true}
})
//定义Model,使用之前定义的Schame(约束)
const UserModel = mongoose.model("user",userSchema)
//添加数据
function testSave() {
  //user数据
  const user = {
    username:"sunwukong",
    password:md5("123456"),
    type:"dashen"
  }
  const userModel = new UserModel(user)
  userModel.save(function (err,user) {
    if(!err){
      console.log("save successfully!",user);
    }
  })
}
//testSave();

//查找数据
function testFind() {
  //查找多个文档
}

