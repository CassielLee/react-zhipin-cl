/*选择用户头像的UI组件*/
import React from 'react'
import {List, Grid,} from 'antd-mobile'
import PropTypes from 'prop-types'

class HeaderSelector extends React.Component {
  static propTypes = {
    setHeader: PropTypes.func.isRequired
  }
  state = {
    icon:null //图片对象，默认没有值，因为一开始并没有选择这个
  }

  constructor(props){
    super(props)
    this.headerList = []
    for (let i = 0; i < 20; i++) {
      this.headerList.push({
        text: '头像' + (i+1),
        icon:require(`../../assets/images/头像${i+1}.png`)
      })

    }
  }
  handleClick = ({text,icon}) => {
    //点击宫格中每一张图片，回调函数就会传一个对象，其中包括图片的地址(icon)和图片名称(text)
    //更新当前组件状态
    this.setState({icon})
    //更新父组件状态
    this.props.setHeader(text)
  }

  render () {
    const {icon} = this.state
    const listHeader = !icon ? "请选择头像":(
      <div>
        已选择头像：<img src={icon} alt="用户头像"/>
      </div>)
    return (
      <div>
        <List renderHeader={() => listHeader}>
          <Grid data={this.headerList} columnNum="5" onClick={this.handleClick}></Grid>
        </List>
      </div>
    );
  }
}

export default HeaderSelector;