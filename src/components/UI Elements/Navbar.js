import React, { Component } from "react";
import NavItem from "./NavItem";
import Logo from "./Logo";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";
import { loadUserDataFromProps } from "../../util/Utils";

class Navbar extends Component {
  state = {
    defaultClasses: "nav-link link",
    selectedClasses: "btn nav-selected",
    homePaths: ["/"],
    bcklgPaths: ["/account"],
    navbarType: null,
    popupVisible: false
  };

  componentDidMount() {
    this.setState({
      popupVisible: false
    });
    this.setNavPaths();
  }

  convertPageName = i_PageName => {
    let pageName = i_PageName;
    let convertedPageName = "";
    const splitPageName = pageName.split(" ");
    if (splitPageName.length === 1) {
      convertedPageName = splitPageName[0].toLowerCase();
    } else {
      for (let i = 0; i < splitPageName.length; i++) {
        if (i === splitPageName.length - 1) {
          convertedPageName += splitPageName[i].toLowerCase();
        } else {
          convertedPageName += splitPageName[i].toLowerCase() + "-";
        }
      }
    }

    return convertedPageName;
  };

  getNavbarType = () => {
    let type = null;
    const { pathname } = this.props.location;

    this.state.homePaths.forEach(path => {
      if (path === pathname) {
        type = "home";
      }
    });
    if (type === null) {
      this.state.bcklgPaths.forEach(path => {
        if (path === pathname) {
          type = "bcklg";
        }
      });
    }

    return type;
  };

  handleNavItemClick = () => {
    if (this.state.popupVisible) {
      this.setState({
        popupVisible: false
      });
    }
  };

  drawNabBar = () => {
    let navItemArr;
    let navbar = [];
    let navItem = <NavItem handleClick={this.handleNavItemClick} />;

    const navbarType = this.getNavbarType();

    if (navbarType !== null) {
      if (navbarType === "home") {
        navItemArr = this.props.homeNav;
      } else {
        navItemArr = this.props.bcklgNav;
      }
      navItemArr.forEach((page, index) => {
        navbar.push(
          <React.Fragment key={index}>
            {React.cloneElement(navItem, {
              defaultClasses: this.state.defaultClasses,
              selectedClasses: this.state.selectedClasses,
              link: this.convertPageName(page),
              key: page,
              value: page
            })}
          </React.Fragment>
        );
      });

      return navbar;
    } else {
      return <p>Error drawing navbar</p>;
    }
  };

  setNavPaths = () => {
    const homePaths = this.mapNavPathsfromArray(
      this.state.homePaths,
      this.props.homeNav
    );
    const bcklgPaths = this.mapNavPathsfromArray(
      this.state.bcklgPaths,
      this.props.bcklgNav
    );

    this.setState({
      homePaths,
      bcklgPaths
    });
  };

  mapNavPathsfromArray = (i_StarterPaths, i_NavItems) => {
    let navPaths = i_NavItems.map(navItem => {
      return `/${this.convertPageName(navItem)}`;
    });

    if (i_StarterPaths.length > 0) {
      i_StarterPaths.forEach(path => {
        navPaths.unshift(path);
      });
    }

    return navPaths;
  };

  handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        this.props.logoutUser();
        this.setState({
          popupVisible: false
        });
        this.props.history.push("/");
      } catch (err) {
        console.log(err);
      }
    }
  };

  renderUserPopup = () => {
    if (this.state.popupVisible) {
      return (
        <div className="user-pop-up">
          <ul>
            <Link to="/account">
              <button
                className="btn nav-link link btn-pop-up"
                onClick={this.handleNavItemClick}
              >
                Account
              </button>
            </Link>
            <button
              className="btn nav-link link btn-pop-up"
              onClick={this.handleLogout}
            >
              Logout
            </button>
          </ul>
        </div>
      );
    }
  };

  handleUserButtonClick = () => {
    this.setState({
      popupVisible: !this.state.popupVisible
    });
  };

  drawUserButton = i_Username => {
    const navbarType = this.getNavbarType();
    if (navbarType !== "home" && i_Username !== undefined) {
      return (
        <React.Fragment>
          <button
            key={"username"}
            className="btn username nav-link link"
            onClick={this.handleUserButtonClick}
          >
            {" "}
            {i_Username}
          </button>
          {this.renderUserPopup()}
        </React.Fragment>
      );
    }
  };

  renderLogo = () => {
    const navbarType = this.getNavbarType();

    return <Logo navbarType={navbarType} logoType="nav" />;
  };

  render() {
    const { username } = loadUserDataFromProps(this.props);

    return (
      <div className="navbar flex-row">
        <nav className="nav">
          <div className="nav-logo">{this.renderLogo()}</div>
          <div className="nav-wrapper">
            <ul className="nav-list">
              <div className="nav-items-wrapper">
                {this.drawNabBar()}
                <div className="username-container">
                  {this.drawUserButton(username)}
                </div>
              </div>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = { logoutUser };

Navbar.propTypes = {
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Navbar));
