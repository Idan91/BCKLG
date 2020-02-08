export const gameExists = (i_Game, i_GameList) => {
  let exists = false;

  if (i_GameList.length > 0) {
    i_GameList.forEach(game => {
      if (game.slug === i_Game) {
        exists = true;
      }
    });
  }

  return exists;
};
