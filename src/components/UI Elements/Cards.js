import React, { Component } from "react";
import Card from "./Card";
import GameFocus from "./GameFocus";
import { getGameFromApi } from "../../model/Api";

class Cards extends Component {
  state = {
    gameFocusVisible: false,
    gameForFocus: "",
    gameFocus: ""
  };

  handleCardClick = event => {
    let target = event.target;

    while (!target.classList.value.includes("game-card")) {
      target = target.parentNode;
    }

    const targetGame = target;

    const gameSlug = targetGame.getAttribute("slug");

    if (this.props.currentPage === "My Backlog") {
      this.props.handleToggleFilter("hide");
    }
    this.renderGameFocus(gameSlug);
  };

  drawCards = () => {
    const cardsArr = this.props.games;

    const cardDisplay = cardsArr.map((item, index) => {
      return (
        <Card
          key={index}
          game={item}
          handleClick={this.handleCardClick}
          currentPage={this.props.currentPage}
        />
      );
    });

    return cardDisplay;
  };

  renderGameFocus = async i_Game => {
    if (this.props.currentPage === "My Backlog") {
      const game = this.props.handleGetGameFromList(i_Game);

      this.setState({
        gameFocusVisible: true,
        gameForFocus: game,
        gameFocus: (
          <GameFocus
            game={game}
            currentPage={this.props.currentPage}
            handleEditGame={this.props.handleEditGame}
            handleDeleteGame={this.props.handleDeleteGame}
            handleClose={this.hideGameFocus}
          />
        )
      });
    } else {
      try {
        getGameFromApi(i_Game).then(game => {
          this.setState({
            gameFocusVisible: true,
            gameForFocus: game,
            gameFocus: (
              <GameFocus
                game={game}
                currentPage={this.props.parentComponent}
                handleAddGame={this.props.handleAddGame}
                handleSearchVisibility={this.props.handleSearchVisibility}
                handleClose={this.hideGameFocus}
              />
            )
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  hideGameFocus = () => {
    this.setState({
      gameFocusVisible: false
    });
    if (this.props.currentPage === "Add Game") {
      this.props.handleSearchVisibility();
    } else if (this.props.currentPage === "My Backlog") {
      this.props.handleToggleFilter("show");
    }
  };

  renderItems() {
    if (this.state.gameFocusVisible) {
      return this.state.gameFocus;
    } else {
      return this.drawCards();
    }
  }

  render() {
    return (
      <React.Fragment>
        <br />
        {this.renderItems()}
      </React.Fragment>
    );
  }
}

export default Cards;
