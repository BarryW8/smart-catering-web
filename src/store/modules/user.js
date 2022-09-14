import { login, logout, userInfo } from "@/api/systemManagement/sysUser";
import { getUserInfo } from "@/api/epgms/account/getUserInfo";
import filterAsyncRoutes from "@/core/addRoutePermission";
import {
  setToken,
  getToken,
  removeToken,
} from "@/utils/auth";

const state = {
  token: getToken(),
  userInfo: null,
  sidebar: true,
  routes: [],
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_SIDEBAR: (state) => {
    state.sidebar = !state.sidebar;
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes;
  },
  SET_USER_INFO: (state, userInfo) => {
    console.log('SET_USER_INFO', userInfo)
    state.userInfo = userInfo
  }
};

const actions = {
  // 登录
  async Login({ commit }, userInfo) {
    console.log(userInfo)
    const { username, password } = userInfo;
    const res = await login({
      username: username.trim(),
      password: password.trim(),
    });
    const { code, data } = res;
    if (code === 0) {
      commit("SET_TOKEN", data);
      setToken(data);
    }
    return res
  },

  // 获取用户信息
  // async GetUserInfo({ commit }, token) {
  //   const res = await getUserInfo(token);
  //   const { code, data } = res;
  //   if (code === 0) {
  //     // 存用户信息
  //     commit('SET_USER_INFO', data)
  //     // 还需把接口返回的路由信息commit到动态路由
  //     // if (data && data.menus) {
  //     //   commit('permission/SET_ROUTES', data.menus, { root: true })
  //     // }
  //   }
  //   return res;
  // },

  // 获取用户信息
  async UserInfo({ commit }) {
    const res = await userInfo();
    const { code, data } = res;
    if (code === 0) {
      // 存用户信息
      commit('SET_USER_INFO', data)
      console.log('SET_USER_INFO------------', data)
      // 还需把接口返回的路由信息commit到动态路由
      if (data && data.menuList) {
        commit('permission/SET_ROUTES', data.menuList, { root: true })
      }
    }
    return res;
  },

  // 退出登录
  async Logout({ commit }) {
    logout().then(() => {
      removeToken() // must remove  token  first
    });
  },

  // sidebar status
  ChangeSidebar(context) {
    context.commit("SET_SIDEBAR");
  },

  async GenerateRoutes(context, roles) {
    const accessedRoutes = await filterAsyncRoutes(roles);
    context.commit("SET_ROUTES", accessedRoutes);
    return accessedRoutes;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
