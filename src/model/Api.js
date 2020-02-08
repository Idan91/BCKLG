export const Rawger = require("rawger");

export const startRawger = async () => {
  const Rawger = require("rawger");
  await Rawger({}).then(data => {
    this.setState({
      rawger: data
    });
  });
};

export const getGameFromApi = async i_GameSlug => {
  const Rawger = require("rawger");
  const { games } = await Rawger({});
  const results = await games
    .get(i_GameSlug)
    .then(result => {
      return result.get();
    })
    .then(data => {
      return data.raw;
    });

  return results;
};

export const searchGame = async i_GameName => {
  const Rawger = require("rawger");
  const { games } = await Rawger({});
  try {
    const results = await games
      .search(i_GameName)
      .then(result => {
        return result.raw();
      })
      .then(data => {
        return data;
      });

    const filteredResults = results.filter(item => item.rating > 0);

    return filteredResults;
  } catch (error) {
    return error.toString();
  }
};
