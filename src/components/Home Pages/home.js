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
              <h1 className="home-caption">{"Conquer \nYour Backlog"}</h1>
              <h2 className="home-sub-caption">No game left behind!</h2>
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
          <div className="home-desc desc-violet home-desc-lg ">
            <div className="home-desc-container">
              <div className="desc-content">
                <br />
                <div className="center-container">
                  <h1 className="our-platform-title">Our Platform</h1>
                  <br />
                </div>
                <div className="spread-container">
                  <br />
                  <div className="spread-container-child">
                    <i className="far fa-clock fa-7x"></i>
                    <br />
                    <h2 className="our-platform-section-title">
                      Manage your gaming time more effeciently
                    </h2>
                  </div>
                  <div className="spread-container-child">
                    <i className="fas fa-gamepad fa-7x"></i>
                    <br />
                    <h2 className="our-platform-section-title">
                      Stay up to date and add the latest and greatest games
                    </h2>
                  </div>
                  <div className="spread-container-child">
                    <i className="fas fa-dollar-sign fa-7x"></i>
                    <br />
                    <h2 className="our-platform-section-title">
                      Don't let your hard-earned money go to waste
                    </h2>
                  </div>
                </div>
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
