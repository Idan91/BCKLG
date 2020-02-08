import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../UI Elements/Logo";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import { signupUser } from "../../redux/actions/userActions";

class signup extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    errors: {}
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
    this.setState({
      loading: true
    });
    const newUserData = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };
    this.props.signupUser(newUserData, this.props.history);
  };

  render() {
    const { errors } = this.state;
    const {
      UI: { loading }
    } = this.props;

    return (
      <React.Fragment>
        <div className="signup-container">
          <Logo currentPage="Login" logoType="vert" />
          <br />
          <form onSubmit={this.handleSubmit} className="form login-form">
            {this.state.username !== "" && (
              <p className="field-label">Username</p>
            )}
            <input
              type="text"
              className="userdata-input"
              name="username"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
            ></input>
            <br />
            {errors.username && (
              <React.Fragment>
                <p className="helper-text">{errors.username}</p>
                <br />
              </React.Fragment>
            )}
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
            {errors.email && (
              <React.Fragment>
                <p className="helper-text">{errors.email}</p>
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
            <br />
            {errors.password && (
              <React.Fragment>
                <p className="helper-text">{errors.password}</p>
                <br />
              </React.Fragment>
            )}
            {this.state.confirmPassword !== "" && (
              <p className="field-label">Confirm Password</p>
            )}
            <input
              type="password"
              className="userdata-input"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={this.state.confirmPassword}
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
            ></input>
            <br />
            {errors.confirmPassword && (
              <React.Fragment>
                <p className="helper-text">{errors.confirmPassword}</p>
                <br />
              </React.Fragment>
            )}
            <div className="loader-container">
              {loading && <div className="loader" />}
            </div>
            <br />
            <button className="btn btn-submit link">Sign Up</button>
            {errors.general && <p className="error-msg">{errors.general}</p>}
          </form>
          <br />
          <div className="body-question">
            <span>Already a member? </span> <Link to="/login">Log in here</Link>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

signup.propTypes = {
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

export default connect(mapStateToProps, { signupUser })(signup);
