/*
* 使用axios封装的ajax请求函数
* 函数返回的是promise对象
*/
import axios from "axios"

function ajax(url='',data={},type='GET') {
  if(type === 'GET'){
    //传入的数据data:{username:"Jack".password:"123"}
    //最终的请求数据形式dataStr:username=Jack&password=123
    let dataStr = '';
    //获取data中所有的属性名
    Object.keys(data).forEach(key => {
      //拼串
      dataStr += key + "=" + data[key] + "&";
    })
    //拼串之后，最后会多出一个&，对字符串进行处理，去掉最后的&
    if(dataStr){
      dataStr = dataStr.substring(0,dataStr.lastIndexOf("&"));
      //得到最终的url
      url = url + "?" + dataStr;
    }
    //发送GET请求
    return axios.get(url);
  }else{
    //发送POST请求
    return axios.post(url,data);
  }
}

export default ajax