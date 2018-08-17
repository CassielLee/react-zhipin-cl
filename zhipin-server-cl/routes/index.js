var express = require('express');
var router = express.Router();
const {UserModel,ChatModel} = require("../db/models");
//加密数据库
const md5 = require("blueimp-md5")
//指定查询时过滤的属性
const filter = {password:0,_v:0}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/*注册自己的路由都写在这个页面*/
//注册(定义)一个路由：用户注册
/*
* 1) 需求:
*       a. 后台应用运行端口指定为 4000
*       b. 提供一个用户注册的接口
*           a) path 为:/register
*           b) 请求方式为:POST
*           c) 接收 username 和 password 参数
*           d) admin 是已注册用户
*           e) 注册成功返回:{code:0,data:{_id:'abc',username:‘xxx’,password:’123’}
*           f) 注册失败返回:{code:1,msg:'此用户已存在'}
*/

/*
* 步骤：req 请求 res 响应
*   1、获取请求参数；
*   2、处理请求；
*   3、返回响应数据；
*/
/*router.post('/register',function (req,res,next) {
  //1、获取请求参数；
  const {username,password} = req.body
  console.log("register()",username,password);
  //2、处理
  if(username === 'admin'){//注册失败
    //返回响应数据(注册失败)
    res.send({code:1,msg:'此用户已存在!'} )
  }else{
    //返回响应数据(注册成功)
    res.send({code:0,data:{_id:'abc123',username,password}})
  }
})*/
//需要两个路由，注册和登陆
//注册的路由，参照API文档
router.post('/register',(req,res,next) => {
  //1、获取请求参数(username,password,type)
  const {username,password,type} = req.body
  //2、处理：判断用户是否存在，如果存在，则返回提示错误信息，如果不存在，则保存
  //3、返回响应数据
    //查询(根据username)
  UserModel.findOne({username},(err,user) => {
    if(user){
        res.send({code:1,msg:'此用户已存在！'})
    }else{
      //用户不存在,将user保存到数据库中
      new UserModel({username,password:md5(password),type}).save((err,user) => {
          //生成一个cookie(userid:user._id),并交给浏览器保存
        //持久化cookie，浏览器会保存在本地文件，maxAge设置数据 有效的最大期限，以毫秒为单位
        res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
        //返回成功的响应数据
        res.send({code:0,data:{_id:user._id,username,type}})
      })
    }
  })

})
//登陆的路由
router.post('/login',(req,res,next) => {
  //1 获取请求参数
  const {username,password} = req.body
  //2 处理:在数据库中查询
  //3 返回响应数据
  UserModel.findOne({username,password:md5(password)},filter,(err,user) => {
    if(!user){//如果用户不存在
      res.send({code:1,msg:"用户名或密码错误!"})
    }else {//用户存在
      //生成一个cookie，交由浏览器保管
      res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
      //返回成功信息
      res.send({code:0,data:user})//注意：user中不能带有密码
    }
  })
})
//更新用户路由
router.post('/update',function (req,res,next) {
  //从请求的cookies中获取userid
  const userid = req.cookies.userid
  //如果不存在userid，直接返回提示信息
  if(!userid){
    return res.send({code:1,msg:'请先登陆！'})
  }
  //根据userid更新数据库中对应的文档
  //1 获取参数信息
  //得到提交的用户信息
  const user = req.body
  UserModel.findByIdAndUpdate({_id:userid},user,function (err,oldUser) {
      if(!oldUser){
        // 如果旧的数据不存在，则说明userid有问题，通知浏览器删除userid cookie
        res.clearCookie('userid')
        //返回提示信息
        res.send({code:1,msg:'请先登陆！'})
      }else {
        const {_id,username,type} = oldUser
        //将旧目标的_id,username,type 复制给返回的数据，因为返回的数据中没有_id,username,type
        const data = Object.assign(user,{_id,username,type})
        res.send({code:0,data})
      }
  })
  //2 处理
  //3 返回相应数据
  //UserModel.updateOne({})
})

//获取用户信息
router.get('/user',function (req,res,next) {
  const userid = req.cookies.userid
  if(!userid){
      return res.send({code:1,msg:'请先登陆！'})
  }
  UserModel.findOne({_id:userid},filter,function (err,user) {
      return res.send({code:0,data:user})
  })
})

//获取用户列表路由
router.get('/userlist',function (req,res,next) {
  const {type} = req.query
  UserModel.find({type},filter,function (err,users) {
      res.send({code:0,data:users})
  })
})

//获取消息列表
router.get('/msglist',function (req,res,next) {
  //获取当前登陆的userid，从cookie中获得
  const userid = req.cookies.userid
  //查询得到所有的user文档
  UserModel.find(function (err,userDocs) {
    //用对象存储所有user信息:key是user的id，val是name和header组成的user对象
    const users = {}//对象容器
    userDocs.forEach(doc => {
      users[doc._id] = {username:doc.username,header:doc.header}
    })
    /*
    * 查询userid相关的所有聊天信息
    *   参数1：查询条件
    *   参数2：过滤条件
    *   参数3：回调函数
    */
    ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function (err,chatMsgs) {
        if(!err){
          //返回包括所有用户与当前用户相关的所有聊天的消息的数据
          res.send({code:0,data:{users,chatMsgs}})
        }
    })
  })
})

//修改聊天消息为已读
router.post('/readmsg',function (req,res,next) {
  //得到请求中的from,to
  const {from} = req.body
  const to = req.cookies.userid
  ChatModel.update({from,to,read:false},{$set:{read:true}},{multi:true},function (err,doc) {
    //console.log('/readmsg',doc);
    res.send({code:0,data:doc.nModified})
  })
})

module.exports = router;
