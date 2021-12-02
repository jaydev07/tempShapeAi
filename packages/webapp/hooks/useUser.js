const useUser = () => {
  if (!window.localStorage) {
    return {
      isAuthenticated: false,
      user: {},
      isExpired: false,
      isLoading: false,
    };
  } else {
    return {
      isAuthenticated: true,
      user: {},
      isExpired: false,
      isLoading: false,
    };
  }
};

export default useUser;
