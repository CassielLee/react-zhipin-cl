module.exports = function (server) {
  //得到IO对象
  const io = require('socket.io')(server)
  io.on('connection',function (socket) {
      console.log('socket connected');
      //自定义事件机制
      //绑定sendMsg监听，接收客户端发送的消息
      socket.on('sendMsg',function (data) {
        console.log("服务器接收到浏览器的消息",data);
        //向客户端发送消息(名称，数据)
        data.name = data.name.toUpperCase()
        io.emit('receiveMsg',data)//发送给所有连接上服务器的客户端
        //socket.emit('receiveMsg',data.name + '_' + data.date)//发送给当前socket对应的客户端
        console.log('服务器像浏览器发送消息',data);
      })
  })
}