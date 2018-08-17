/*
* 主界面路由组件
*/
import React from "react";
import {Switch,Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'

import LaobanInfo from '../laoban_info/laoban_info'
import DashenInfo from '../dashen_info/dashen_info'
import Laoban from '../dashen/dashen'
import Dashen from '../laoban/laoban'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import Chat from '../chat/chat'

import {getRedirectPath} from "../../utils";
import {getUser} from "../../redux/actions";
import NavFooter from "../../components/nav-footer/nav-footer";

class Main extends React.Component{
  //给组件对象添加属性，如果加上static就是给组件类添加属性，就不属于任何一个组件实例，不会被继承，只能通过类来调用
  navList = [//包含所有导航组件的相关信息
    {
      path:'/laoban',
      component:Laoban,
      title:'大神列表',//显示顶部标题
      icon:'dashen',//底部图标名称，和图标资源应该相对应
      text:'大神'//图标下面的文字
    },
    {
      path:'/dashen',
      component:Dashen,
      title:'Boss列表',
      icon:'laoban',
      text:'老板'
    },
    {
      path:'/message',
      component:Message,
      title:'消息列表',
      icon:'message',
      text:'消息'
    },
    {
      path:'/personal',
      component:Personal,
      title:'用户中心',
      icon:'personal',
      text:'个人'
    }
  ]
  componentDidMount(){
    // 1) 登陆过(cookie中有userid),但还没有登陆(redux管理的user中没有_id)，发送请求获取对应的user
    const userid = Cookies.get('userid')
    const {_id} = this.props.user
    if(userid && !_id){
      //发送异步请求,获取user信息
      //console.log("发送异步请求，获取user信息");
      this.props.getUser()
    }
  }
  render(){
    //在渲染之前检查用户是否登陆，若没有重定向到登陆页面
   /* //检查redux中的user，或者是浏览器中的cookie
    const {user} = this.props
    if(!user._id){
      const path = '/login'
      return <Redirect to={path}/>
    }*/
   //读取cookie中的userid
    const userid = Cookies.get('userid')
    if(!userid){
      //如果没有，则重定向到登陆界面
      return <Redirect to='/login'/>
    }
    //如果有，读取redux中user的状态
    const {user,unReadCount} = this.props
    //如果user没有_id，返回空，不做任何显示
    if(!user._id){
        return null
    }else{//如果有，显示对应的界面
      let path = this.props.location.pathname
      if(path === '/'){
        //根据user的type和header来计算出一个重定向的路由路径，并自动重定向
        path = getRedirectPath(user.type,user.header)
        return <Redirect to={path}/>
      }
    }
    const {navList} = this
    const path = this.props.location.pathname //当前页面请求的路径
    const currentNav = navList.find(nav => nav.path === path)//得到当前的nav,可能没有
    if(currentNav){
      //决定哪个路由需要隐藏
      if(user.type === 'laoban'){
        //隐藏数组第二个
        navList[1].hide = true
      }else {//隐藏第一个
        navList[0].hide = true
      }
    }

    return(
      <div>
        {currentNav ? <NavBar className="stick-header">{currentNav.title}</NavBar> : null}
        <Switch>
          {
            navList.map((nav,index) => <Route path={nav.path} component={nav.component} key={index}></Route>)
          }
          <Route path='/laobaninfo' component={LaobanInfo}/>
          <Route path='/dasheninfo' component={DashenInfo}/>
          <Route path='/chat/:userid' component={Chat}/>
          <Route component={NotFound}/>
        </Switch>
        {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/> : null}
      </div>
    )
  }
}
export default connect(
  state => ({user:state.user,unReadCount:state.chat.unReadCount}),
  {getUser}//将getUser函数传入main组件
)(Main);
/*
* main完成的工作：
*   1、实现自动登陆
*      1) 登陆过(cookie中有userid),但还没有登陆(redux管理的user中没有_id)，发送请求获取对应的user:componentDidMount()
*       render():
*           2) 如果cookie中没有userid，则自动进入login界面
*           3) 判断redux管理的user中有没有_id，如果没有，暂时不做任何显示，如果有说明当前已经登陆，显示对应的界面
*           4) 如果已经登陆，如果请求根路径：
*                 根据user的type和header来计算出一个重定向的路由路径，并自动重定向
*
*/