const functions = require("firebase-functions");
const app = require("express")();

const cors = require("cors");
app.use(cors());

const firebaseAuth = require("./util/firebaseAuth");

const {
  signup,
  login,
  updateUserGames,
  getUserGames,
  getUserData,
  deleteAccount,
  sendPasswordResetEmail,
  getAuthenticatedUser,
  updatePassword,
  sendEmailVerification
} = require("./handlers/users");

// User routes
app.post("/signup", signup);
app.post("/login", login);
app.get("/user", firebaseAuth, getAuthenticatedUser);
app.post("/user/reset-password", sendPasswordResetEmail);
app.post("/user/update-password", firebaseAuth, updatePassword);
app.post("/user/delete", firebaseAuth, deleteAccount);
app.post("/user/email-verification", firebaseAuth, sendEmailVerification);
app.post("/user/data", firebaseAuth, getUserData);
app.post("/user/games", firebaseAuth, getUserGames);
app.post("/user/games/update", firebaseAuth, updateUserGames);

exports.api = functions.region("europe-west1").https.onRequest(app);
