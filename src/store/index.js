import { createStore } from "vuex";
import getters from "./getters";
import skin from "./modules/skin";
import user from "./modules/user";
import permission from "./modules/permission";

export default createStore({
  modules: {
    skin,
    user,
    permission
  },
  getters,
});
