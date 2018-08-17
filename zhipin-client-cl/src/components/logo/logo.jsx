import React from "react"
import logo from "./logo.png"
import "./logo.less"

class Logo extends React.Component {
  render () {
    return (
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo-img"/>
      </div>
    );
  }
}

/*
也可以写成函数组件
  function Logo() {
      return (
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo-img"/>
        </div>
      )
  }
*/

export default Logo;