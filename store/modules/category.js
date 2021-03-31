const state = () => ({
  category: {}
});

const mutations = {
  setCategory(state, category) {
    state.category = category;
  }
};

const actions = {
  setCategory: ({ commit }, category) => {
    commit("setCategory", category);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
