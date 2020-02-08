import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../UI Elements/Logo";
import Card from "../UI Elements/Card";
import { getGameFromApi } from "../../model/Api";

class Home extends Component {
  state = {
    game: "death-stranding",
    gameCard: ""
  };

  componentDidMount() {
    this.renderGameCard(this.state.game);
  }

  renderGameCard = async i_Game => {
    try {
      getGameFromApi(i_Game).then(game => {
        this.setState({
          gameCard: <Card game={game} currentPage={"Home"} key={game.name} />
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  renderHomeContent = () => {
    return (
      <React.Fragment>
        <div className="home-showcase-bg"></div>
        <div className="home-page">
          <div className="home-container">
            <div className="home-caption-container">
              <h1 className="home-caption">
                {/* {"Track & \nConquer \nYour Backlog"} */}
                {"Conquer \nYour Backlog"}
              </h1>
            </div>
            <div className="down-arrow-container">
              <div className="down-arrows">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div className="home-desc desc-1">
            <div className="desc-img"></div>
            <div className="home-desc-container">
              <div className="desc-content">
                <h1 className="desc-title desc-title-top">{`Track & Beat all the games in your library`}</h1>
                <div className="desc-text-content"></div>
              </div>
            </div>
          </div>
          <div className="home-desc desc-orange desc-2">
            <div className="home-desc-container">
              <div className="desc-content">
                <div className="desc-text-content">
                  <h1 className="desc-title">Card view</h1>
                  <p className="desc-body">
                    A clean and intuitive card view letting you comfortably
                    manage your backlog.
                  </p>
                </div>
                <div className="card-container-home card-container-home-left">
                  {this.state.gameCard}
                </div>
              </div>
            </div>
          </div>
          <div className="home-desc desc-violet desc-3">
            <div className="home-desc-container">
              <div className="desc-content">
                <div className="desc-text-content">
                  <h1 className="desc-title">{`Current & Connected`}</h1>
                  <p className="desc-body">
                    Powered by the RAWG, the largest open video games database,
                    BCKLG provides you the option to add the latest and greatest
                    to your backlog until you eventually beat them.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="home-desc desc-join">
            <div className="home-desc-container">
              <div className="desc-content desc-join-content">
                <div className="desc-text-content">
                  <div className="inline">
                    <span className="desc-title inline">{`Join `}</span>
                    <Logo currentPage="Join" logoType="inline" />
                    <span className="desc-title inline">{` now!`}</span>
                  </div>
                  <br />
                  <br />
                  <Link to="/sign-up">
                    <button className="btn btn-home-page link">Sign Up</button>
                  </Link>
                  <br />
                  <br />
                  <div className="body-question-home">
                    <span className="">Already a member? </span>{" "}
                    <Link to="/login">Log in here</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    return <React.Fragment>{this.renderHomeContent()}</React.Fragment>;
  }
}

export default Home;
