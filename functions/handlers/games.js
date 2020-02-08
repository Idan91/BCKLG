const { db } = require("../util/admin");

exports.getAllGames = (request, response) => {
  db.collection("games")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let games = [];
      data.forEach(doc => {
        games.push({
          gameId: doc.id,
          ...doc.data()
        });
      });
      return response.json(games);
    })
    .catch(err => console.error(err));
};

exports.addOneGame = (request, response) => {
  const newGame = {
    body: request.body.body,
    user: request.user.username,
    createdAt: new Date().toISOString()
  };

  this.getUserGames(username);

  db.collection("games")
    .add(newGame)
    .then(doc => {
      response.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      response.status(500).json({ error: `Something went wrong!` });
      console.log(err);
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
      return response.json(data._fieldsProto.games);
    })
    .catch(err => console.error(err));
};
