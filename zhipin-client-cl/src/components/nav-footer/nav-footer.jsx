/*底部导航组件*/
import React from 'react'
import {TabBar} from 'antd-mobile'
import PropTypes from 'prop-types'
//希望在非路由组件中使用路由库的api
import {withRouter} from 'react-router-dom'

const Item = TabBar.Item

class NavFooter extends React.Component {
  static propTypes = {
    navList: PropTypes.array.isRequired,
    unReadCount:PropTypes.number.isRequired
  }

  render (){
    const navList = this.props.navList.filter(nav => !nav.hide) //函调函数只会返回为true的项
    const {pathname} = this.props.location
    const {unReadCount} = this.props
    //过滤掉hide为true的nav

    return (
      <TabBar>
        {
          navList.map((nav) => (
            <Item key={nav.path}
                  badge={nav.path === '/message'? unReadCount : 0}
                  title={nav.text}
                  icon={{uri:require(`./images/${nav.icon}.png`)}}
                  selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
                  selected={pathname===nav.path}
                  onPress={() => this.props.history.replace(nav.path)}
            />
          ))
        }
      </TabBar>
    );
  }
}

export default withRouter(NavFooter);