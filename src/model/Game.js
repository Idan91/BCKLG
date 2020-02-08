import { getStatusTypes } from "./Status";

class Game {
  constructor(i_Game, i_Platform, i_Status, i_Priority) {
    this.name = i_Game.name;
    this.platform = this.assignPlatform(i_Game, i_Platform);
    this.status = this.assignStatus(i_Status);
    this.priority = i_Priority;
    this.released = i_Game.released;
    this.rating = i_Game.rating;
    this.background_image = i_Game.background_image;
    this.slug = i_Game.slug;
    this.raw = i_Game;
  }

  assignStatus(i_Status) {
    const statusTypes = getStatusTypes();
    let gameStatus;

    statusTypes.forEach(status => {
      if (status === i_Status) {
        gameStatus = i_Status;
      }
    });

    return gameStatus;
  }

  assignPlatform(i_Game, i_Platform) {
    let myPlatform = "";
    i_Game.platforms.forEach(platform => {
      if (platform.platform.name === i_Platform) {
        myPlatform = platform.platform;
      }
    });
    return myPlatform;
  }

  static convertToGameObject(i_Game, i_Platform, i_Status = 0) {
    return new Game(i_Game, i_Platform, i_Status);
  }
}

export default Game;
