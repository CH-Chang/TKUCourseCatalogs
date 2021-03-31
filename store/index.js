import Vue from "vue";
import Vuex from "vuex";
import category from "./modules/category";
import auth from "./modules/auth";
import selection from "./modules/selection";
import cookie from "cookie";
import { apiGetCategory } from "@/apis/course";
import { apiGetUserInfo } from "@/apis/member";
import AES256Helper from "../mixins/AES256Helper";

Vue.use(Vuex);

export default () => {
  return new Vuex.Store({
    modules: {
      category,
      auth,
      selection
    },
    methods: {},
    actions: {
      async nuxtServerInit({ commit }, { req, app }) {
        let axiosResult;
        axiosResult = await apiGetCategory();
        commit(
          "category/setCategory",
          axiosResult.status === 200 ? axiosResult.data.category : []
        );

        if (req.headers.cookie) {
          let parsedCookie = cookie.parse(req.headers.cookie);
          if (parsedCookie.token) {
            axiosResult = await app.$axios.get("/api/member/getUserInfo");
            if (axiosResult.status === 200 && axiosResult.data.res === 0) {
              commit("auth/setAuth", {
                isLogin: true,
                email: axiosResult.data.data.email,
                name: axiosResult.data.data.name,
                sex: axiosResult.data.data.sex,
                college: axiosResult.data.data.college,
                unit: axiosResult.data.data.unit,
                year: axiosResult.data.data.year,
                role: axiosResult.data.data.role
              });
            } else {
              commit("auth/setAuth", {
                isLogin: false,
                name: undefined,
                sex: undefined,
                college: undefined,
                unit: undefined,
                year: undefined,
                role: undefined
              });
            }
          } else {
            commit("auth/setAuth", {
              isLogin: false,
              name: undefined,
              sex: undefined,
              college: undefined,
              unit: undefined,
              year: undefined,
              role: undefined
            });
          }

          if (parsedCookie.selection) {
            let selection = JSON.parse(
              AES256Helper.methods.AES256Decrypt(parsedCookie.selection)
            );

            let vuexOptions = {
              hasSelected: true,
              totalCourses: selection.totalCourses,
              totalCredits: selection.totalCredits,
              totalElectiveCredits: selection.totalElectiveCredits,
              totalRequiredCredits: selection.totalRequiredCredits,
              courses: selection.courses
            };

            commit("selection/setSelection", vuexOptions);
          } else {
            commit("selection/setSelection", {
              hasSelected: false,
              totalCourses: 0,
              totalCredits: 0,
              totalElectiveCredits: 0,
              totalRequiredCredits: 0,
              courses: []
            });
          }
        }
      }
    }
  });
};
