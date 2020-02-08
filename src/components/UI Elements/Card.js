import React, { Component } from "react";
import { parseRAWGDate } from "../../util/UI_Utils";

class Card extends Component {
  state = {
    defaultClasses: "game-card",
    homeClasses: "game-card-home game-card-add-game",
    addGameClasses: "game-card game-card-add-game",
    addedStyle: "",
    preAnimationStyle: "card-pre-entrance",
    animationStyle: "card-entrance"
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    if (
      this._isMounted &&
      this.props.currentPage === "My Backlog" &&
      this.props.animate
    ) {
      this.setState({
        addedStyle: this.state.preAnimationStyle
      });
      setTimeout(() => {
        this.setState({
          addedStyle: this.state.animationStyle
        });
        this._isMounted = false;
        setTimeout(() => {
          this.setState({
            addedStyle: ""
          });
        }, 800);
      }, 75 * this.props.delay);
      if (this.props.numOfGames === this.props.delay) {
        this.props.handleStopStartupAnimation();
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    console.log(this.props.animate);
  }

  renderGameDetails = () => {
    let status = "";
    let platform = "";
    let gameReleased = true;

    const releaseDate = new Date(this.props.game.released);
    const today = new Date();

    if (
      releaseDate.getTime() >= today.getTime() ||
      this.props.game.released === null
    ) {
      gameReleased = false;
    }

    if (this.props.currentPage === "My Backlog") {
      status = (
        <div className="game-detail game-detail-line">
          <p className="game-detail game-detail-label">Status:</p>
          <p className="game-detail game-detail-value">
            {this.props.game.status}
          </p>
        </div>
      );

      platform = (
        <div className={`platform ${this.props.game.platform.slug}`}>
          <p className={`platform-name`}>{this.props.game.platform.name}</p>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className="game-detail-container">
          <div className="game-detail-line">
            <p className="game-detail game-detail-label">Rating:</p>
            <p className="game-detail game-detail-value">
              {gameReleased ? `${this.props.game.rating} / 5` : "TBD"}
            </p>
          </div>
          <br />
          <div className="game-detail-line">
            <p className="game-detail game-detail-label">Release Date:</p>
            <p className="game-detail game-detail-value">
              {this.props.game.released === null
                ? "TBD"
                : parseRAWGDate(this.props.game.released)}
            </p>
          </div>
          <br />
          {status}
          <br />
        </div>
        {platform}
      </React.Fragment>
    );
  };

  render() {
    let classes;

    if (this.props.currentPage === "Home") {
      classes = this.state.homeClasses;
    } else if (this.props.currentPage === "Add Game") {
      classes = this.state.addGameClasses;
    } else {
      classes = this.state.defaultClasses;
    }

    if (
      this.props.parentComponent !== "Game Focus" &&
      this.props.currentPage !== "Home"
    ) {
      classes += " link";
    }

    return (
      <div
        key={this.props.game.name}
        className={`${classes} ${this.state.addedStyle}`}
        onClick={this.props.handleClick}
        game={this.props.game}
        name={this.props.game.name}
        slug={this.props.game.slug}
      >
        <div className="img-container">
          <img
            className="game-img"
            src={this.props.game.background_image}
            alt={this.props.game.name}
          />
        </div>
        <div className="title-container">
          <p className="game-title">{this.props.game.name}</p>
        </div>
        {this.renderGameDetails()}
      </div>
    );
  }
}

export default Card;
