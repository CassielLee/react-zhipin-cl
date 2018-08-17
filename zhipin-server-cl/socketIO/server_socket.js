/*启动socket.io服务的函数*/
module.exports = function (server) {
  //引入操作chats的数据库Model
  const {ChatModel} = require('../db/models')
  //获得IO对象
  const io = require('socket.io')(server)
  io.on('connection',function (socket) {
    console.log("有客户端连接上了服务器");
    //绑定监听，接受客户端发送的信息
    socket.on('sendMsg',function ({from,to,content}) {
      console.log("服务器端接收到的消息：",{from,to,content});
      //服务器处理数据实际上就是保存消息
      const chat_id = [from,to].sort().join('_')
      const create_time = Date.now()
      const chatModel = new ChatModel({chat_id,from,to,create_time,content})
      chatModel.save(function (err,chatMsg) {
        //保存完成后，向所有连接的客户端发送信息
        io.emit('receiveMsg',chatMsg)
        console.log('服务端向所有连接的客户端发送信息：',chatMsg);
      })
    })
  })
}