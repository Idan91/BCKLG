import React, { Component } from "react";
import {
  HashRouter,
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";
// Components
import AuthRoute from "./util/AuthRoute";
import jwtDecode from "jwt-decode";
import Navbar from "./components/UI Elements/Navbar";
import Footer from "./components/UI Elements/Footer";
// Pages
import home from "./components/Home Pages/home";
import signup from "./components/Home Pages/signup";
import login from "./components/Home Pages/login";
import bcklg from "./components/BCKLG Pages/BCKLG";
import addGame from "./components/BCKLG Pages/AddGame";
import account from "./components/BCKLG Pages/Account";
import axios from "axios";

axios.defaults.baseURL =
  "https://europe-west1-bcklg-6b059.cloudfunctions.net/api";

const token = localStorage.firebaseIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  state = {
    homeNavItems: ["Sign Up", "Login"],
    bcklgNavItems: ["My Backlog", "Add Game"]
  };

  renderApp = () => {
    const router = (
      <HashRouter basename="/">
        <Navbar
          homeNav={this.state.homeNavItems}
          bcklgNav={this.state.bcklgNavItems}
          location={this.props.location}
        />
        <Switch>
          <Route exact path="/" component={home} />
          <div className="page-body">
            <div className="page-container">
              <AuthRoute exact path="/sign-up" component={signup} />
              <AuthRoute exact path="/login" component={login} />
              <Route exact path="/my-backlog" component={bcklg} />
              <Route exact path="/add-game" component={addGame} />
              <Route exact path="/account" component={account} />
            </div>
          </div>
        </Switch>
      </HashRouter>
    );

    return (
      <React.Fragment>
        <Provider store={store}>
          <React.Fragment>{router}</React.Fragment>
        </Provider>
        <Footer />
      </React.Fragment>
    );
  };

  render() {
    return <React.Fragment>{this.renderApp()}</React.Fragment>;
  }
}

export default App;
