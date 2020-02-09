import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../UI Elements/Logo";
import PropTypes from "prop-types";
import googleIcon from "../../resources/google_G.svg";
// Redux
import { connect } from "react-redux";
import {
  loginUser,
  sendPasswordResetEmail
} from "../../redux/actions/userActions";

class login extends Component {
  state = {
    email: "",
    emailForgot: "",
    password: "",
    errors: {},
    forgotVisible: false,
    emailSignIn: true
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
  }

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.handleSubmit(event);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  };

  handleForgotPassword = () => {
    this.setState({
      forgotVisible: !this.state.forgotVisible
    });
  };

  handleResetEmail = event => {
    event.preventDefault();
    const email = this.state.emailForgot;

    try {
      this.props.sendPasswordResetEmail(email);
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  renderForgotPassword = i_Errors => {
    const {
      UI: { loading }
    } = this.props;

    return (
      <React.Fragment>
        <div className="login-container">
          <h2 className="sub-page-title">Forgot Password</h2>
          <br />
          <div className="form-description-container">
            <p className="form-description">
              Please enter your email and we'll send you instructions on how to
              reset your password
            </p>
          </div>
          <form onSubmit={this.handleResetEmail} className="form login-form">
            {this.state.emailForgot !== "" && (
              <p className="field-label">Email</p>
            )}
            <input
              type="text"
              className="userdata-input"
              name="emailForgot"
              placeholder="Email"
              value={this.state.emailForgot}
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
            ></input>
            {i_Errors.emailForgot && (
              <p className="helper-text">{i_Errors.emailForgot}</p>
            )}
            <br />
            <div className="loader-container">
              {loading && <div className="loader" />}
            </div>
            <br />
            <button className="btn btn-submit link">Submit</button>
          </form>
          {i_Errors.general && (
            <React.Fragment>
              <p className="error-msg">{i_Errors.general}</p>
              <br />
            </React.Fragment>
          )}
          <br />
          <button
            className="btn btn-sml btn-gray link"
            onClick={this.handleForgotPassword}
          >
            Cancel
          </button>
        </div>
      </React.Fragment>
    );
  };

  renderLoginForm = (i_Errors, i_Loading) => {
    return (
      <div className="login-container">
        <form onSubmit={this.handleSubmit} className="form login-form">
          {this.state.email !== "" && <p className="field-label">Email</p>}
          <input
            type="text"
            className="userdata-input"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          ></input>
          <br />
          {i_Errors.email && (
            <React.Fragment>
              <p className="helper-text">{i_Errors.email}</p>
              <br />
            </React.Fragment>
          )}
          {this.state.password !== "" && (
            <p className="field-label">Password</p>
          )}
          <input
            type="password"
            className="userdata-input"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          ></input>
          {i_Errors.password && (
            <React.Fragment>
              <p className="helper-text">{i_Errors.password}</p>
              <br />
            </React.Fragment>
          )}
          <br />
          {i_Loading && (
            <React.Fragment>
              <div className="loader-container">
                <div className="loader" />
              </div>
            </React.Fragment>
          )}
          <br />
          <button className="btn btn-submit link">Login</button>
          {i_Errors.general && <p className="error-msg">{i_Errors.general}</p>}
        </form>
        <button
          className="btn btn-sml btn-gray link"
          onClick={this.handleForgotPassword}
        >
          Forgot Password
        </button>
        <br />
        <br />
        <div className="body-question">
          <span>Don't have an account? </span>{" "}
          <Link to="/sign-up">Sign up here</Link>
        </div>
      </div>
    );
  };

  renderSignInMethods = () => {
    return (
      <React.Fragment>
        <button className="btn btn-sign-in-with btn-facebook link">
          <i className="fab fa-facebook-f facebook-icon"></i>
          &nbsp;&nbsp;&nbsp;&nbsp;Sign in with Facebook
        </button>
        <br />
        <button className="btn btn-sign-in-with btn-google link">
          <img src={googleIcon} alt="" className="google-icon" />
          &nbsp;&nbsp;&nbsp;&nbsp;Sign in with Google
        </button>
        <br />
        <button
          className="btn btn-sign-in-with btn-email link"
          onClick={this.handleEmailSignIn}
        >
          <i className="fas fa-at"></i>
          &nbsp;&nbsp;&nbsp;&nbsp;Sign in with email
        </button>
      </React.Fragment>
    );
  };

  renderLoginPage = () => {
    const { errors } = this.state;
    const {
      UI: { loading }
    } = this.props;

    return (
      <React.Fragment>
        <div className="page-container">
          <div className="center-container">
            <Logo currentPage="Login" logoType="vert" />
            <br />
            <br />
            {this.state.emailSignIn
              ? this.state.forgotVisible
                ? this.renderForgotPassword(errors)
                : this.renderLoginForm(errors, loading)
              : this.renderSignInMethods()}
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    return this.renderLoginPage();
  }
}

login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  sendPasswordResetEmail: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  loginUser,
  sendPasswordResetEmail
};

export default connect(mapStateToProps, mapActionsToProps)(login);
