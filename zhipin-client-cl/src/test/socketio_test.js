/*
import io from 'socket.io-client'

//连接服务器,得到代表连接的socket对象
const socket = io('ws://localhost:4000')

//绑定receiveMsg的监听，来接收服务器发送的消息
socket.on('receiveMsg',function (data) {
    console.log("浏览器端接受到消息：",data);
})

//向服务器端发送消息
socket.emit('sendMsg',{name:'tom',date:Date.now()})
console.log("浏览器端向服务器端发送消息：",{name:'tom',date:Date.now()});*/
