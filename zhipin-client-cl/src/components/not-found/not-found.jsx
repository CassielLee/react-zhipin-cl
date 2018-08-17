/*提示页面没找到的主路由组件*/
import React from 'react'
import {Button} from 'antd-mobile'


class NotFound extends React.Component {
  render () {
    return (
      <div>
        <h2>抱歉，找不到该页面……</h2>
        <Button type="primary" onClick={() => this.props.history.replace('/')}>返回首页</Button>
      </div>
    );
  }
}


export default NotFound;