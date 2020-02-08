import React, { Component } from "react";
import Cards from "../UI Elements/Cards";
import { getStatusTypes } from "../../model/Status";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";

class MyBacklog extends Component {
  state = {
    statusTypes: [],
    filterButtonVisible: true,
    filterVisible: false,
    filterIndex: 0
  };

  componentDidMount() {
    const statusTypes = getStatusTypes();

    statusTypes.unshift("All");

    this.setState({
      statusTypes
    });
  }

  filterBacklogGames = i_Games => {
    let filteredGames;
    const filterIndex = this.state.filterIndex;

    // 0 - all games
    if (filterIndex != 0) {
      const statusType = this.state.statusTypes[filterIndex];
      filteredGames = i_Games.filter(game => {
        if (game.status === statusType) {
          return game;
        }
      });
    } else {
      filteredGames = i_Games;
    }

    return filteredGames;
  };

  renderStatBar = i_Games => {
    const statusTypes = this.state.statusTypes;
    const gameStatusCount = statusTypes.map(status => {
      let count = 0;
      let gameStatus = {};
      i_Games.forEach(game => {
        if (game.status === status) {
          count++;
        }
      });
      gameStatus.status = status;
      gameStatus.count = count;

      return gameStatus;
    });

    const statusStats = gameStatusCount.map((gameStatus, index) => {
      if (index > 0) {
        return (
          <React.Fragment key={gameStatus.status}>
            <p className="stat">{`${gameStatus.status}: ${gameStatus.count}`}</p>
            {index !== gameStatusCount.length - 1 && (
              <p className="stat stat-separator">|</p>
            )}
          </React.Fragment>
        );
      }
    });

    return (
      <div className="stat-container">
        <div className="stat-bar">
          <p className="stat">Game Count: {i_Games.length}</p>
          <p className="stat stat-separator">|</p>
          {statusStats}
        </div>
      </div>
    );
  };

  renderStatusFilters = () => {
    let statusTypes = this.state.statusTypes;
    const filterIndex = this.state.filterIndex;
    let statusToRender;

    const statusButtonClasses = "btn btn-status-filter link";
    const selectedButtonClass = "btn-selected-outline";

    statusToRender = statusTypes.map((status, index) => {
      const isSelected = index == filterIndex;

      return (
        <button
          key={index}
          value={status}
          value-index={index}
          selected={isSelected}
          className={`${statusButtonClasses} ${isSelected &&
            selectedButtonClass}`}
          onClick={this.handleFilterSelect}
        >
          {status}
        </button>
      );
    });

    return <React.Fragment>{statusToRender}</React.Fragment>;
  };

  renderFilter = () => {
    return (
      <div className="filter-container">
        {this.state.filterButtonVisible && (
          <React.Fragment>
            <button
              className="btn btn-filter link"
              onClick={this.handleFilterGames}
            >
              Filter
            </button>

            {!this.state.filterVisible && this.state.filterIndex > 0 && (
              <div className="status-filter-container ">
                {`Status: ${this.state.statusTypes[this.state.filterIndex]}`}
              </div>
            )}
          </React.Fragment>
        )}
        {this.state.filterVisible && this.renderStatusFilters()}
      </div>
    );
  };

  handleFilterSelect = event => {
    const { target } = event;
    const filterIndex = target.getAttribute("value-index");

    this.setState({
      filterIndex
    });
  };

  handleFilterGames = () => {
    this.setState({
      filterVisible: !this.state.filterVisible
    });
  };

  toggleFilter = i_ActionType => {
    if (i_ActionType === "hide") {
      this.setState({
        filterButtonVisible: false,
        filterVisible: false
      });
    } else if (i_ActionType === "show") {
      this.setState({
        filterButtonVisible: true
      });
    }
  };

  renderCards = i_Games => {
    return (
      <div className="content card-container">
        <Cards
          games={this.filterBacklogGames(i_Games)}
          parentComponent={"My Backlog"}
          currentPage={"My Backlog"}
          handleToggleFilter={this.toggleFilter}
          handleEditGame={this.props.handleEditGame}
          handleDeleteGame={this.props.handleDeleteGame}
          handleGetGameFromList={this.props.handleGetGameFromList}
        />
      </div>
    );
  };

  renderContent = i_Games => {
    return (
      <React.Fragment>
        <div className="center-container">
          <h1 className="page-title page-title-sml">My Backlog</h1>
          <div className="status-bar">
            {this.renderStatBar(i_Games)}
            {this.renderFilter()}
          </div>
        </div>
        <div className="content">{this.renderCards(i_Games)}</div>
      </React.Fragment>
    );
  };

  render() {
    let myGames = this.props.games;

    if (myGames === undefined) {
      myGames = [];
    }

    return this.renderContent(myGames);
  }
}

MyBacklog.propTypes = {
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

export default connect(mapStateToProps)(MyBacklog);
