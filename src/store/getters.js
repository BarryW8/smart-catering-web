const getters = {
  bgColor: (state) => state.skin.bgColor,
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userInfo,
  userName: (state) => state.user.userName,
  account: (state) => state.user.account,
  avatar: (state) => state.user.avatar,
  routes: (state) => state.permission.permissionRoutes,
  sidebar: (state) => state.user.sidebar,
};

export default getters;
