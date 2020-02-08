import React, { Component } from "react";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import {
  logoutUser,
  deleteAccount,
  updateUserPassword
} from "../../redux/actions/userActions";

class Account extends Component {
  state = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    editVisible: false,
    errors: {},
    passwordChanged: false
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
  }

  handleDeleteAccount = event => {
    const {
      user: {
        credentials: { username, email }
      }
    } = this.props;

    if (window.confirm("Are you sure you want to delete your account?")) {
      if (
        window.prompt(
          "Enter your account's email address below to confirm:"
        ) !== email
      ) {
        alert("Incorrect input! Please try again");
      } else {
        try {
          this.props.deleteAccount(username);
          alert("Account successfully deleted!");
          this.props.logoutUser();
          this.props.history.push("/");
        } catch (err) {
          console.log(err);
          alert(err);
        }
      }
    } else {
      event.preventDefault();
    }
  };

  handleSaveChanges = async event => {
    event.preventDefault();
    const {
      user: {
        credentials: { email }
      }
    } = this.props;

    const updatePasswordRequest = {
      email: email,
      currentPassword: this.state.currentPassword,
      newPassword: this.state.newPassword,
      confirmNewPassword: this.state.confirmNewPassword
    };

    await this.props
      .updateUserPassword(updatePasswordRequest)
      .then(result => {
        if (result) {
          this.handleEditAccount();
          this.props.history.push("/account");
          this.setState({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.handleSaveChanges(event);
    }
  };

  handleEditAccount = event => {
    this.setState({
      editVisible: !this.state.editVisible
    });
  };

  renderEditAccount = i_Errors => {
    const {
      UI: { loading }
    } = this.props;

    return (
      <React.Fragment>
        <h2 className="sub-page-title">Change Password</h2>
        <form onSubmit={this.handleSaveChanges} className="form login-form">
          <div className="field-label-container">
            {this.state.currentPassword !== "" && (
              <p className="field-label">Current Password</p>
            )}
            <input
              type="password"
              className="userdata-input userdata-input-account"
              name="currentPassword"
              placeholder="Current Password"
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
              value={this.state.currentPassword}
            ></input>
            <br />
            {i_Errors.currentPassword && (
              <p className="helper-text change-password-helper">
                {i_Errors.currentPassword}
              </p>
            )}
          </div>
          <div className="field-label-container">
            {this.state.newPassword !== "" && (
              <p className="field-label">New Password</p>
            )}
            <input
              type="password"
              className="userdata-input userdata-input-account"
              name="newPassword"
              placeholder="New Password"
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
              value={this.state.newPassword}
            ></input>
            <br />
            {i_Errors.newPassword && (
              <p className="change-password-helper helper-text">
                {i_Errors.newPassword}
              </p>
            )}
          </div>
          <div className="field-label-container">
            {this.state.confirmNewPassword !== "" && (
              <p className="field-label">Confirm New Password</p>
            )}
            <input
              type="password"
              className="userdata-input userdata-input-account"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              onChange={this.handleInputChange}
              value={this.state.confirmNewPassword}
              onKeyDown={this.handleKeyDown}
            ></input>
            <br />
            {i_Errors.confirmNewPassword && (
              <p className="change-password-helper helper-text">
                {i_Errors.confirmNewPassword}
              </p>
            )}
          </div>
          <div className="loader-container">
            {loading && <div className="loader" />}
          </div>
          <button className="btn link">Save Changes</button>
          <button
            className="btn btn-negative link"
            onClick={this.handleDeleteAccount}
          >
            Delete account
          </button>
        </form>
        <button className="btn link btn-gray" onClick={this.handleEditAccount}>
          Cancel
        </button>
      </React.Fragment>
    );
  };

  render() {
    const { errors } = this.state;

    const {
      user: {
        credentials: { username, email }
      }
    } = this.props;

    if (this.state.passwordChanged) {
      alert("Password updated successfully!");
      this.setState({
        passwordChanged: false
      });
    }

    return (
      <React.Fragment>
        <div className="center-container">
          <h1 className="page-title page-title-sml">Account</h1>
          <br />
          <div className="field-label-container">
            <p className="field-label">Username</p>
          </div>
          <div className="field-box">
            <p>{username}</p>
          </div>
          <br />
          <div className="field-label-container">
            <p className="field-label">Email</p>
          </div>
          <div className="field-box">
            <p>{email}</p>
          </div>
          {this.state.editVisible ? (
            <React.Fragment>{this.renderEditAccount(errors)}</React.Fragment>
          ) : (
            <React.Fragment>
              <br />
              <button className="btn link" onClick={this.handleEditAccount}>
                Change Password
              </button>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

Account.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  updateUserPassword: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  deleteAccount,
  updateUserPassword,
  logoutUser
};

export default connect(mapStateToProps, mapActionsToProps)(Account);
