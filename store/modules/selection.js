const state = () => ({
  hasSelected: false,
  totalCourses: 0,
  totalCredits: 0,
  totalElectiveCredits: 0,
  totalRequiredCredits: 0,
  courses: []
});

const mutations = {
  setSelection: (state, options) => {
    state.hasSelected = options.hasSelected;
    state.totalCourses = options.totalCourses;
    state.totalCredits = options.totalCredits;
    state.totalElectiveCredits = options.totalElectiveCredits;
    state.totalRequiredCredits = options.totalRequiredCredits;
    state.courses = options.courses;
  }
};

const actions = {
  setSelection: ({ commit }, options) => {
    commit("setSelection", options);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
