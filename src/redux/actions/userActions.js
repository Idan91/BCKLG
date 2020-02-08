import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  LOADING_USER,
  SET_UNAUTHENTICATED
} from "../types";
import axios from "axios";

export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(result => {
      setAuthrizationHeader(result.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/my-backlog");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

// export const signInWithFacebook = history => dispatch => {
//   const provider = new firebase.auth.FacebookAuthProvider();

//   firebase
//     .auth()
//     .signInWithPopup(provider)
//     .then(result => {
//       const token = result.credential.accessToken;
//       const user = result.user;

//       console.log("reuslt", result);

//       return { token, user };
//     })
//     .then(data => {
//       const { token, user } = data;

//       console.log("data", data);

//       setAuthrizationHeader(token);
//       dispatch(getUserData());
//       dispatch({ type: CLEAR_ERRORS });
//       history.push("/my-backlog");
//     })
//     .catch(err => {
//       console.error(err);
//     });
// };

export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(() => {
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/login");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem("firebaseIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => dispatch => {
  dispatch({ type: LOADING_USER });

  axios
    .get("/user")
    .then(result => {
      dispatch({
        type: SET_USER,
        payload: result.data
      });
    })
    .catch(err => console.log(err));
};

export const sendPasswordResetEmail = i_Email => dispatch => {
  dispatch({ type: LOADING_UI });

  const resetPasswordRequest = {
    email: i_Email
  };

  axios
    .post("/user/reset-password", resetPasswordRequest)
    .then(() => {
      dispatch({ type: CLEAR_ERRORS });
      window.alert(
        `You should recieve password reset instructions ${resetPasswordRequest.email} shortly`
      );
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
      console.log(err);
    });
};

export const sendEmailVerification = () => dispatch => {
  dispatch({ type: LOADING_UI });

  return new Promise((resolve, reject) => {
    axios
      .post("/user/email-verification")
      .then(() => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch(getUserData());
        let emailVerificationMsg = "Email verification instructions sent.";
        window.alert(emailVerificationMsg);
        resolve(true);
      })
      .catch(err => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
        console.log(err);
        reject(false);
      });
  });
};

export const updateUserPassword = i_UpdateRequest => dispatch => {
  dispatch({ type: LOADING_UI });

  const updateRequest = {
    email: i_UpdateRequest.email,
    currentPassword: i_UpdateRequest.currentPassword,
    newPassword: i_UpdateRequest.newPassword,
    confirmNewPassword: i_UpdateRequest.confirmNewPassword
  };

  return new Promise((resolve, reject) => {
    axios
      .post("/user/update-password", updateRequest)
      .then(() => {
        dispatch({ type: CLEAR_ERRORS });
        dispatch(getUserData());
        let updateSuccessfullMsg = "Password updated successfully";
        window.alert(updateSuccessfullMsg);
        resolve(true);
      })
      .catch(err => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
        console.log(err);
        reject(false);
      });
  });
};

export const updateGames = (username, gameList) => dispatch => {
  dispatch({ type: LOADING_USER });
  const updateRequest = {
    username: username,
    games: gameList
  };
  axios
    .post("user/games/update", updateRequest)
    .then(() => {
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch(err => console.log(err));
};

export const deleteAccount = i_Username => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .post("user/delete", i_Username)
    .then(() => {
      dispatch(logoutUser());
    })
    .catch(err => console.log(err));
};

const setAuthrizationHeader = token => {
  const firebaseIdToken = `Bearer ${token}`;
  localStorage.setItem("firebaseIdToken", firebaseIdToken);
  axios.defaults.headers.common["Authorization"] = firebaseIdToken;
};
