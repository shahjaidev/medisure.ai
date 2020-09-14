/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { Component } from "react"

class FixedPlugin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classes: "dropdown show-dropdown",
    }
  }
  handleClick = () => {
    if (this.state.classes === "dropdown show-dropdown") {
      this.setState({ classes: "dropdown show-dropdown show" })
    } else {
      this.setState({ classes: "dropdown show-dropdown" })
    }
  }
  activateMode = (mode) => {
    switch (mode) {
      case "light":
        document.body.classList.add("white-content")
        break
      default:
        document.body.classList.remove("white-content")
        break
    }
  }
  render() {
    return null
  }
}

export default FixedPlugin
