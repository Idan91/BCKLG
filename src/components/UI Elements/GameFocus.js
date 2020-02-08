import React, { Component } from "react";
import Card from "./Card";
import { getStatusTypes } from "../../model/Status";

class GameFocus extends Component {
  state = {
    selectedPlatform: "",
    platformButtonClasses: "btn-search link preset focus-button focus-platform",
    selectedStatus: "",
    statusButtonClasses: "btn-search link preset focus-button focus-status",
    selectedButtonClass: "focus-button-selected",
    editGame: false
  };

  componentDidMount() {
    if (this.props.currentPage === "Add Game") {
      this.props.handleSearchVisibility();
    }
  }

  handleOptionChange = event => {
    const { target } = event;
    const type = target.getAttribute("type");

    if (type === "Platform") {
      this.setState({
        selectedPlatform: target.value
      });
    } else {
      this.setState({
        selectedStatus: target.value
      });
    }
  };

  toggleEditGame = () => {
    this.setState({
      selectedPlatform: this.props.game.platform.name,
      selectedStatus: this.props.game.status,
      editGame: true
    });
  };

  renderPlatformButtons = () => {
    let platformHeader;
    let gamePlatforms;

    if (this.props.currentPage === "My Backlog" && !this.state.editGame) {
      platformHeader = <h2 className="focus-header">Platform:</h2>;

      gamePlatforms = (
        <button
          key={this.props.game.platform.slug}
          value={this.props.game.platform.name}
          className={`${this.state.platformButtonClasses} ${this.props.game.platform.slug}`}
        >
          {this.props.game.platform.name}
        </button>
      );
    } else {
      platformHeader = <h2 className="focus-header">Platforms:</h2>;
      let game;

      if (this.props.currentPage === "My Backlog") {
        game = this.props.game.raw;
      } else {
        game = this.props.game;
      }

      const platforms = game.platforms;

      if (
        platforms !== undefined &&
        platforms !== null &&
        platforms.length > 0
      ) {
        gamePlatforms = platforms.map((platform, index) => {
          const isSelected =
            this.state.selectedPlatform === platform.platform.name;

          return (
            <button
              key={platform.platform.slug}
              value={platform.platform.name}
              type="Platform"
              selected={isSelected}
              className={`${this.state.platformButtonClasses} ${
                platform.platform.slug
              } ${isSelected && this.state.selectedButtonClass}`}
              onClick={this.handleOptionChange}
            >
              {platform.platform.name}
            </button>
          );
        });
      }
    }

    return (
      <React.Fragment>
        <div className="focus-platform-container">
          {platformHeader}
          {gamePlatforms}
        </div>
      </React.Fragment>
    );
  };

  renderStatus = () => {
    let statusTypes;

    const releaseDate = new Date(this.props.game.released);
    const today = new Date();

    if (
      releaseDate.getTime() >= today.getTime() ||
      this.props.game.released === null
    ) {
      statusTypes = [getStatusTypes()[0]];
    } else {
      statusTypes = getStatusTypes();
    }

    const statusHeader = (
      <h2 className="focus-header focus-header-status">Status:</h2>
    );
    let statusToRender;

    if (this.props.currentPage === "Add Game" || this.state.editGame) {
      statusToRender = statusTypes.map((status, index) => {
        const isSelected = this.state.selectedStatus === status;

        return (
          <button
            key={index}
            value={status}
            selected={isSelected}
            className={`${this.state.statusButtonClasses} ${isSelected &&
              this.state.selectedButtonClass}`}
            onClick={this.handleOptionChange}
          >
            {status}
          </button>
        );
      });
    } else {
      const status = this.props.game.status;

      statusToRender = (
        <React.Fragment>
          <button
            key={this.props.game.status}
            value={status}
            selected={false}
            className={`${this.state.statusButtonClasses}`}
          >
            {status}
          </button>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div className="focus-status-container">
          {statusHeader}
          {statusToRender}
        </div>
      </React.Fragment>
    );
  };

  addGame = () => {
    try {
      if (this.validateSelections()) {
        this.props.handleAddGame(
          this.props.game.slug,
          this.state.selectedPlatform,
          this.state.selectedStatus
        );
        this.props.handleClose();
      } else {
        alert("Please select a platform and a status!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  editGame = () => {
    try {
      if (this.validateSelections()) {
        this.props.handleEditGame(
          this.props.game,
          this.state.selectedPlatform,
          this.state.selectedStatus
        );
        this.props.handleClose();
      } else {
        alert("Please select a platform and a status!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  deleteGame = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this game from your backlog?"
      )
    ) {
      try {
        this.props.handleDeleteGame(this.props.game);
        this.props.handleClose();
      } catch (err) {
        console.log(err);
      }
    }
  };

  validateSelections() {
    return (
      this.state.selectedPlatform !== "" && this.state.selectedStatus !== ""
    );
  }

  renderBottomPortion = () => {
    if (this.props.currentPage === "Add Game") {
      return (
        <React.Fragment>
          <button className="btn btn-positive link" onClick={this.addGame}>
            Add To Backlog
          </button>
        </React.Fragment>
      );
    } else if (this.state.editGame) {
      return (
        <React.Fragment>
          <button className="btn btn-positive link" onClick={this.editGame}>
            Save Edits
          </button>
          <button className="btn link btn-close" onClick={this.deleteGame}>
            Delete From Backlog
          </button>
        </React.Fragment>
      );
    } else {
      return (
        <button className="btn link" onClick={this.toggleEditGame}>
          Edit
        </button>
      );
    }
  };

  render() {
    const focusDetailsClasses = "focus-details";

    return (
      <React.Fragment>
        <div className="focus-outer-container">
          <button
            className="btn link btn-gray close-game-focus"
            onClick={this.props.handleClose}
          >
            <i class="fas fa-arrow-left"></i>
          </button>
          <div className="focus-container">
            <div className="focus-box">
              <div className="card-container">
                <Card
                  key={this.props.game.name}
                  game={this.props.game}
                  parentComponent={"Game Focus"}
                  currentPage={this.props.currentPage}
                />
              </div>
              <div className={focusDetailsClasses}>
                <div className="platform-container">
                  {this.renderPlatformButtons()}
                </div>
                {this.renderStatus()}
                <br />
                <div className="focus-bottom-buttons">
                  {this.renderBottomPortion()}
                </div>
              </div>
            </div>
          </div>
          <br />
        </div>
      </React.Fragment>
    );
  }
}

export default GameFocus;
