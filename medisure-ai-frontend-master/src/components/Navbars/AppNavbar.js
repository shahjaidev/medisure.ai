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
import React from "react"

class AppNavbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent",
    }
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor)
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor)
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white",
      })
    } else {
      this.setState({
        color: "navbar-transparent",
      })
    }
  }
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent",
      })
    } else {
      this.setState({
        color: "bg-white",
      })
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    })
  }
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch,
    })
  }
  render() {
    return null
  }
}

export default AppNavbar
