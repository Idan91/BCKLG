const { db } = require("../util/admin");

const config = require("../util/firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
  validateUpdatePassword,
  validateForgotPassword
} = require("../util/validators");

// Sign up user
exports.signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    username: request.body.username,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return response.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return response
          .status(400)
          .json({ username: "This username is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        email: newUser.email,
        username: newUser.username,
        createdAt: new Date().toISOString(),
        userId,
        emailVerified: false
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return response.status(201).json({ userToken: token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return response.status(400).json({ email: "Email is already in use" });
      } else {
        return response
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};

exports.sendEmailVerification = (request, response) => {
  const user = firebase.auth().currentUser;

  user
    .sendEmailVerification()
    .then(() => {
      return response.json({
        emailVerification: `Email verification instructions sent to ${user.email}`
      });
    })
    .catch(err => {
      console.error(err);
      return response
        .status(400)
        .json({ emailVerification: "Email verification request failed" });
    });
};

// Log user in
exports.login = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return response.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return response.json({ token });
    })
    .catch(err => {
      console.error(err);
      return response
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};

exports.updateUserGames = (request, response) => {
  let updateReqeust = {
    username: request.body.username,
    games: request.body.games,
    updatedAt: new Date().toISOString()
  };

  db.doc(`/users/${updateReqeust.username}`)
    .update(updateReqeust)
    .then(() => {
      return response.json({
        message: `${updateReqeust.username}'s games updated successfully!`
      });
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.getUserGames = (request, response) => {
  const username = request.body.username;

  db.doc(`/users/${username}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response
          .status(400)
          .json({ games: `Could not retrieve ${username}'s games` });
      } else {
        return doc;
      }
    })
    .then(data => {
      return response.json(data._fieldsProto.games.arrayValue.values);
    })
    .catch(err => console.error(err));
};

exports.getUserData = (request, response) => {
  const username = request.body.username;

  db.doc(`/users/${username}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return response
          .status(400)
          .json({ games: `Could not retrieve ${username}'s data` });
      } else {
        return doc;
      }
    })
    .then(data => {
      return response.json(data._fieldsProto);
    })
    .catch(err => console.error(err));
};

exports.deleteAccount = (request, response) => {
  const user = firebase.auth().currentUser;
  const username = request.body.username;

  user
    .delete()
    .then(
      db
        .collection("users")
        .doc(`${username}`)
        .delete()
        .then(() => {
          return response.json({
            deleteAccountData: `${username}'s data has been deleted successfully`
          });
        })
    )
    .then(() => {
      return response.json({
        deleteAccount: `The user ${username} has been deleted successfully`
      });
    })
    .catch(err => {
      console.error(err);
    });
};

exports.updatePassword = (request, response) => {
  const user = firebase.auth().currentUser;
  const updateRequest = {
    email: request.body.email,
    currentPassword: request.body.currentPassword,
    newPassword: request.body.newPassword,
    confirmNewPassword: request.body.confirmNewPassword
  };

  let { valid, errors } = validateUpdatePassword(updateRequest);

  if (!valid) return response.status(400).json(errors);

  const credential = firebase.auth.EmailAuthProvider.credential(
    updateRequest.email,
    updateRequest.currentPassword
  );

  user
    .reauthenticateWithCredential(credential)
    .then(() => {
      if (updateRequest.newPassword === updateRequest.currentPassword) {
        errors.newPassword =
          "New password is the same as the current one. Please pick a new password";
        return response.status(400).json(errors);
      } else {
        user
          .updatePassword(updateRequest.newPassword)
          .then(() => {
            {
              let updateSuccessfullMsg = "Password updated successfully";
              return response.json({
                updatePassword: updateSuccessfullMsg
              });
            }
          })
          .catch(err => {
            if (err.code === "auth/wrong-password") {
              errors.currentPassword = err.message;
              return response.status(400).json(errors);
            }
            console.log(err);
            return response.json({ general: "Password change failed" });
          });
      }
    })
    .catch(err => {
      errors.currentPassword = "Current password is incorrect";
      console.log(err);
      return response.status(400).json(errors);
    });
};

exports.sendPasswordResetEmail = (request, response) => {
  const emailForgot = request.body.email;

  let { valid, errors } = validateForgotPassword(emailForgot);

  if (!valid) return response.status(400).json(errors);

  firebase
    .auth()
    .sendPasswordResetEmail(emailForgot)
    .then(() => {
      return response.json({
        resetPassword: `Reset password email sent to ${email}`
      });
    })
    .catch(err => {
      if (err.code === "auth/user-not-found") {
        errors.emailForgot =
          "There is no user record corresponding to this email";
        return response.status(400).json(errors);
      }
      console.log(err);
      return response.json({ general: "Password change failed" });
    });
};

// Get own user details
exports.getAuthenticatedUser = (request, response) => {
  const user = firebase.auth().currentUser;
  let userData = {};

  db.doc(`/users/${request.user.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        if (user.emailVerified) {
          userData.credentials.emailVerified = true;
        }
      }
    })
    .then(() => {
      return response.json(userData);
    })
    .catch(err => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};
