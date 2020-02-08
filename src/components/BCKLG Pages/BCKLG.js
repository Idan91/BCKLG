import React, { Component } from "react";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import store from "../../redux/store";

import {
  logoutUser,
  updateGames,
  sendEmailVerification
} from "../../redux/actions/userActions";
import MyBacklog from "./MyBacklog";
import Game from "../../model/Game";
import { searchGame } from "../../model/Api";
import { loadUserDataFromProps } from "../../util/Utils";

class BCKLG extends Component {
  state = {
    isLoaded: false,
    rawger: "",
    pageIndex: 0,
    navbarClasses: [],
    username: "",
    games: [],
    verified: "",
    userData: "",
    fetchFailed: false
  };

  /* #region  LIFE-CYCLE METHODS */
  componentDidMount() {
    this.startRawger();
  }
  /* #endregion */

  /* #region  API METHODS */
  startRawger = async () => {
    const Rawger = require("rawger");
    await Rawger({}).then(data => {
      this.setState({
        rawger: data
      });
    });
  };

  getGameFromApi = async i_GameSlug => {
    const Rawger = require("rawger");
    const { games } = await Rawger({});
    const results = await games
      .get(i_GameSlug)
      .then(result => {
        return result.get();
      })
      .then(data => {
        return data.raw;
      });

    return results;
  };

  /* #endregion */

  /* #region  GAME METHODS */
  getGameFromList = i_Game => {
    const { games } = loadUserDataFromProps(this.props);

    const myGameList = games;
    let myGame;

    myGameList.forEach(game => {
      if (i_Game === game.slug) {
        myGame = game;
      }
    });

    return myGame;
  };

  editGame = (i_Game, i_Platform, i_Status) => {
    const { username, games } = loadUserDataFromProps(this.props);

    const myGameList = games;
    const newGame = new Game(i_Game.raw, i_Platform, i_Status);

    const newGameList = myGameList.map(game => {
      if (game.name === i_Game.raw.name) {
        return newGame;
      } else {
        return game;
      }
    });

    this.props.updateGames(username, newGameList);
  };

  deleteGame = i_Game => {
    const { username, games } = loadUserDataFromProps(this.props);

    const myGameList = games;

    const newGameList = myGameList.filter(game => {
      let listGame;
      if (!(game.name === i_Game.raw.name)) {
        listGame = game;
      }
      return listGame;
    });

    this.props.updateGames(username, newGameList);
  };

  loadUserDataFromProps = () => {
    const {
      user: {
        credentials: { username, games, emailVerified },
        loading,
        authenticated
      }
    } = this.props;

    const { user } = this.props;

    return { user, username, games, emailVerified, loading, authenticated };
  };
  /* #endregion */

  /* #region  UI METHODS */
  onSwitchPage = i_Index => {
    this.setState({
      pageIndex: i_Index
    });
  };

  handleLogout = () => {
    try {
      this.props.logoutUser();
      this.setState({
        popupVisible: false
      });
      this.props.history.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  renderBacklog = () => {
    const { games, loading, authenticated } = loadUserDataFromProps(this.props);

    setTimeout(() => {
      const fetchedGames = loadUserDataFromProps(this.props).games;

      if (
        !this.state.fetchFailed &&
        (fetchedGames === null || fetchedGames === undefined)
      ) {
        window.alert(
          "Could not authenticate/retrieve user data. Please log in again"
        );
        this.setState({
          fetchFailed: true
        });
        store.dispatch(logoutUser());
      }
    }, 4500);

    const content = (
      <MyBacklog
        pageName="My Backlog"
        games={games}
        handleSearch={searchGame}
        handleAddGame={this.addGameToList}
        handleEditGame={this.editGame}
        handleDeleteGame={this.deleteGame}
        handleGetGameFromApi={this.getGameFromApi}
        handleGetGameFromList={this.getGameFromList}
      />
    );

    const loader = (
      <div className="page-container">
        <div className="main">
          <div className="content">
            <br />
            <br />
            <div className="loader-container">
              {loading && <div className="loader" />}
            </div>
          </div>
        </div>
      </div>
    );

    const unverified = (
      <React.Fragment>
        <div className="page-container">
          <div className="main">
            <div className="content">
              <div className="center-container">
                <h2 className="page-title">Your email is not verified!</h2>
                <br />
                <p className="unverified-body">
                  In order to use BCKLG, please click the button below and
                  follow the instructions sent your email.
                </p>
                <br />
                <button
                  className="btn link"
                  onClick={this.props.sendEmailVerification}
                >
                  Send verification email
                </button>
                <br />
                <br />
                <p>
                  Once you've verified your email, logout and re-login to use
                  BCKLG.
                </p>
                <button
                  className="btn nav-link link btn-pop-up"
                  onClick={this.handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {!loading
          ? authenticated
            ? content
            : this.props.history.push("/")
          : loader}
      </React.Fragment>
    );
  };
  /* #endregion */

  render() {
    return this.renderBacklog();
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  logoutUser,
  updateGames,
  sendEmailVerification
};

BCKLG.propTypes = {
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  updateGames: PropTypes.func.isRequired,
  sendEmailVerification: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(BCKLG);
