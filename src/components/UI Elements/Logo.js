import React, { Component } from "react";
import { Link } from "react-router-dom";
import BCKLG_Logo from "../../resources/BCKLG_Logo.svg";
import BCKLG_Logo_vertical from "../../resources/BCKLG_Logo_vertical.svg";

class Logo extends Component {
  state = {
    logoSrc: BCKLG_Logo,
    logoClasses: "logo-img",
    navClasses: "logo-img logo-img-link link logo-nav",
    vertClasses: "logo-login logo-img logo-vert",
    inlineClasses: "logo-img logo-inline"
  };

  componentDidMount() {
    if (this.props.currentPage !== undefined) {
      this.defineLogo(this.props.currentPage);
    } else if (this.props.navbarType !== undefined) {
      this.defineLogo(this.props.navbarType);
    }
  }

  defineLogo = i_Page => {
    if (i_Page === "Login") {
      this.setState({
        logoSrc: BCKLG_Logo_vertical
      });
    } else {
      this.setState({
        logoSrc: BCKLG_Logo
      });
    }
    this.defineLogoClasses(this.props.logoType, i_Page);
  };

  defineLogoClasses = (i_LogoType, i_Context) => {
    if (i_LogoType === "nav") {
      this.setState({
        logoClasses: this.state.navClasses
      });
    } else if (i_LogoType === "vert") {
      this.setState({
        logoClasses: this.state.vertClasses
      });
    } else if (i_LogoType === "inline") {
      if (i_Context === "Join") {
        const classes = `${this.state.inlineClasses} logo-join`;
        this.setState({
          logoClasses: classes
        });
      } else {
        this.setState({
          logoClasses: this.state.inlineClasses
        });
      }
    }
  };

  renderLogo = i_Context => {
    if (i_Context === "home") {
      return (
        <Link to="/">
          <img
            className={this.state.logoClasses}
            src={this.state.logoSrc}
            alt=""
          />
        </Link>
      );
    } else if (i_Context === "bcklg") {
      return (
        <Link to="/my-backlog">
          <img
            className={this.state.logoClasses}
            src={this.state.logoSrc}
            alt=""
          />
        </Link>
      );
    } else {
      return (
        <img
          className={this.state.logoClasses}
          src={this.state.logoSrc}
          alt=""
        />
      );
    }
  };

  render() {
    return this.renderLogo(this.props.navbarType);
  }
}

export default Logo;
