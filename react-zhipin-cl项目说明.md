#项目说明
  1 此项目是一个前后台分离的招聘的SPA，包括前端应用和后台应用
  2 包括用户注册/登录，大神/老板列表，实时聊天等模块
  3 前端:使用了React全家桶、ES6、Webpack等技术，构建页面主要是用到了antd-mobile库
  4 后端：使用了Node、express、mongoDB、socketIO等技术 
    这个项目是为了就业而练习的，从网上找的资源，如果涉及到侵权问题，请联系我及时删除。
    总的来说，这个项目使用的技术和相关的库都比较新，有兴趣的同学可以试试，这个项目涉及到的基础的HTML/CSS等知识不多，因为
  界面本来就比较简单，所以直接用了组件库，涉及到的少量的样式修改，使用的是less，通过这个项目可以对React技术栈有一个更深的
  了解，也能了解到Redux架构的工作流程，此外还能了解到一个应用的开发过程，能学到不少东西。做到这一步还是很有成就感的，上传
  至此，望能与同志之人共勉，如果对此项目有什么问题也可以联系我。
    到目前为止，这个项目还有几个小bug还没有解决：
      1、本来现在聊天界面加动画的，但是加入动画之后，没有办法得到正确的document.body.scrollHeight，所以消息不能自动显示到列表最后；
      2、关于未读消息的数量，如果通信双方都在聊天界面聊天，退出聊天界面后，但是会出现短暂的未读消息提醒；
      3、关于消息显示的问题，当一条消息有多行文本时，虽然可以显示，但是格式却不是很好看，还需要调整；
# 源码项目说明:
	zhipin-client-cl: 前台项目
	zhipin-server-cl:后台项目

# react项目-硅谷直聘的运行说明
## 1. 准备
	1) 确保安装了node环境
		查看是否已经安装: node -v
		如果没有安装: 可以根据网上教程去安装node

	2) 确保安装了mongodb, 并启动了对应的服务
		查看是否安装并启动了服务: 右键-->任务管理器-->服务-->MongoDB
		如果没有安装: 可以根据网上教程安装
	
## 2. 启动后台应用
	1). 进入zhipin-server-cl
	2). 执行命令: npm start

## 3. 启动前台应用并访问
	1). 进入zhipin-client-cl
	2). 执行命令: npm start
## 测试账号/密码
  大神账号：dashen1 密码：123
  老板账号：laoban1 密码：123


