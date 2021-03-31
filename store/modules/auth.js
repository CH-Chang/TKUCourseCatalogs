const state = () => ({
  isLogin: false,
  email: undefined,
  name: undefined,
  sex: undefined,
  college: undefined,
  unit: undefined,
  year: undefined,
  role: undefined
});

const mutations = {
  setAuth(state, options) {
    state.isLogin = options.isLogin;
    state.email = options.email;
    state.name = options.name;
    state.sex = options.sex;
    state.college = options.college;
    state.unit = options.unit;
    state.year = options.year;
    state.role = options.role;
  }
};

const actions = {
  setAuth: ({ commit }, options) => {
    commit("setAuth", options);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
