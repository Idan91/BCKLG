import React, { Component } from "react";
import Cards from "../UI Elements/Cards";
import Game from "../../model/Game";
import { getGameFromApi, searchGame } from "../../model/Api";
import { loadUserDataFromProps } from "../../util/Utils";
import { updateGames } from "../../redux/actions/userActions";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";

class AddGame extends Component {
  state = {
    searchResults: [],
    query: "",
    year: 2020,
    errorMessage: "Could not find game! Please try again",
    displayErrorMessage: false,
    searchInitiated: false,
    searchVisible: true,
    gameBuffer: []
  };

  handleInputChange = event => {
    let newQuery = event.target.value;
    this.setState({
      query: newQuery
    });
  };

  handleSubmitSearch = event => {
    this.renderSearchResults(this.state.query);
  };

  renderSearchResults = async i_GameName => {
    this.setState({
      displayErrorMessage: false
    });

    let allResults = [];

    let results = await searchGame(i_GameName)
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log(err);
      });

    if (typeof results === typeof "string") {
      this.setState({ displayErrorMessage: true });
      return;
    }

    allResults = results;

    this.setState({
      searchResults: allResults,
      searchInitiated: true
    });
  };

  renderItems() {
    if (
      this.state.displayErrorMessage ||
      (this.state.searchResults.length < 1 && this.state.searchInitiated)
    ) {
      return <h2>{this.state.errorMessage}</h2>;
    } else {
      return (
        <div className="content">
          <div className="content card-container">
            <Cards
              games={this.state.searchResults}
              parentComponent={"Add Game"}
              currentPage={"Add Game"}
              handleAddGame={this.addGameToList}
              handleGetGameFromList={this.props.handleGetGameFromList}
              handleSearchVisibility={this.toggleSearchVisibility}
            />
          </div>
        </div>
      );
    }
  }

  populateYears = () => {
    const currentYear = new Date().getFullYear();

    let yearArray = [];

    for (let i = currentYear; i > 1969; i--) {
      yearArray.push(
        <option className="year" key={i} value={i}>
          {i}
        </option>
      );
    }

    return yearArray;
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.renderSearchResults(this.state.query);
    }
  };

  handleChange = event => {
    const { value } = event.target;
    this.setState({
      year: value
    });
  };

  handleSearchPreset = async event => {
    const { name } = event.target;
    const year = this.state.year;
    let linkSuffix;

    if (name === "Most Popular") {
      linkSuffix = `added`;
    } else {
      linkSuffix = `rating`;
    }

    fetch(
      `https://api.rawg.io/api/games?dates=${year}-01-01,${year}-12-31&ordering=-${linkSuffix}`
    )
      .then(result => {
        return result.json();
      })
      .then(data => {
        this.setState({
          searchResults: data.results
        });
      });
  };

  toggleSearchVisibility = () => {
    if (this.state.searchVisible) {
      this.setState({
        searchVisible: false
      });
    } else {
      this.setState({
        searchVisible: true
      });
    }
  };

  gameExists = (i_Game, i_GameList) => {
    let exists = false;

    if (i_GameList !== undefined && i_GameList.length > 0) {
      i_GameList.forEach(game => {
        if (game.slug === i_Game) {
          exists = true;
        }
      });
    }

    return exists;
  };

  addGameToList = async (i_Game, i_Platform, i_Status) => {
    const { username, games } = loadUserDataFromProps(this.props);

    let myGameList = games;

    const gameExists = this.gameExists(i_Game, myGameList);

    if (gameExists) {
      alert("Game already exits!");
    } else {
      await getGameFromApi(i_Game)
        .then(data => {
          return data;
        })
        .then(resolvedGame => {
          const convertedGame = Game.convertToGameObject(
            resolvedGame,
            i_Platform,
            i_Status
          );

          return convertedGame;
        })
        .then(game => {
          if (myGameList !== undefined && myGameList.length > 0) {
            myGameList.unshift(game);
          } else {
            myGameList = [game];
          }

          this.props.updateGames(username, myGameList);
          window.alert(`${game.name} has been added to your backlog`);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  renderSearchContainer = () => {
    if (this.state.searchVisible) {
      return (
        <React.Fragment>
          <div className="search-container">
            <div className="search">
              <input
                type="text"
                className="search-box"
                placeholder="Which game are you looking for?"
                value={this.state.query}
                onChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
              ></input>
              <button
                className="btn-search link"
                onClick={this.handleSubmitSearch}
              >
                Search
              </button>
            </div>
            <div className="search-presets">
              <button
                className="btn-search link preset"
                onClick={this.handleSearchPreset}
                name="Most Popular"
              >
                Most Popular
              </button>
              <button
                className="btn-search link preset"
                onClick={this.handleSearchPreset}
                name="Highest Rated"
              >
                Highest Rated
              </button>
              <select
                className="btn-search link preset year-select"
                onChange={this.handleChange}
              >
                {this.populateYears()}
              </select>
            </div>
          </div>
        </React.Fragment>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="center-container">
          <h1 className="page-title page-title-sml">Add Game</h1>
          {this.renderSearchContainer()}
          {this.renderItems()}
        </div>
      </React.Fragment>
    );
  }
}

AddGame.propTypes = {
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  updateGames: PropTypes.func.isRequired
};

const mapActionsToProps = { updateGames };

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

export default connect(mapStateToProps, mapActionsToProps)(AddGame);
