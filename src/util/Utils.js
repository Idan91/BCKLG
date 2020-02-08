export const loadUserDataFromProps = i_Props => {
  const {
    user: {
      credentials: { username, games, emailVerified },
      loading,
      authenticated
    }
  } = i_Props;

  const { user } = i_Props;

  return { user, username, games, emailVerified, loading, authenticated };
};
