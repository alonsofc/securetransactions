import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
  },
  getters: {
    isLoggedIn: (state) => !!state.user && !!state.user.token,
    getCurrentUser: (state) => state.user,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    logout(state) {
      state.user = null;
    },
  },
  actions: {
    login({ commit }, { user }) {
      commit("setUser", user);
    },
    logout({ commit }) {
      commit("logout");
    },
    updateUser({ commit, state }, updatedUser) {
      const currentUser = { ...state.user, ...updatedUser };
      commit("setUser", currentUser);
    },
  },
  modules: {},
});
