<template>
  <div>
    <div class="features">
      <ul>
        <li>
          <a
            href="#"
            class="current feature-login"
            @click.prevent="featuresChange"
            >登入<br />SIGNIN</a
          >
        </li>
        <li>
          <a href="#" class="feature-register" @click.prevent="featuresChange"
            >註冊<br />SIGNUP</a
          >
        </li>
      </ul>
    </div>
    <div class="signin" v-if="isLoginShow">
      <el-form :model="loginForm" ref="loginForm" :rules="loginFormRule">
        <el-form-item label="帳戶" prop="username">
          <el-input
            placeholder="請輸入您的帳戶"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input
            placeholder="請輸入您的密碼"
            v-model="loginForm.password"
            autocomplete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-button
          round
          size="medium"
          class="el-button--my"
          @click="loginFormSubmit"
          >送出</el-button
        >
      </el-form>
    </div>
    <div class="signup" v-else>
      <el-form
        label-width="100px"
        :rules="registerFormRule"
        :model="registerForm"
        ref="registerForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="校級信箱" prop="email">
              <el-input
                v-model="registerForm.email"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驗證碼" prop="captcha">
              <el-input
                v-model="registerForm.captcha"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button class="el-button--my" @click="captchaClick"
              >取得驗證碼</el-button
            >
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="registerForm.name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性別" prop="sex">
              <el-radio label="1" v-model="registerForm.sex">男性</el-radio>
              <el-radio label="0" v-model="registerForm.sex">女性</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="密碼" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="密碼確認"
              prop="checkPassword"
              autocomplete="off"
            >
              <el-input
                v-model="registerForm.checkPassword"
                type="password"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="學院" prop="college">
              <el-select
                placeholder="請選擇您的學院"
                v-model="registerForm.college"
                value-key="id"
              >
                <el-option
                  v-for="item in registerFormRes.colleges"
                  :key="item.collegeTW"
                  :label="item.collegeTW"
                  :value="item.id"
                  >{{ item.collegeTW }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="學制" prop="schoolSystem">
              <el-select
                placeholder="請選擇您的學制"
                v-model="registerForm.schoolSystem"
                value-key="id"
              >
                <el-option
                  v-for="item in registerFormRes.schoolSystems"
                  :key="item.name"
                  :value="item.id"
                  :label="item.name"
                  >{{ item.name }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="系所" prop="department">
              <el-select
                placeholder="請選擇您的系所"
                v-model="registerForm.department"
                value-key="id"
              >
                <el-option
                  v-for="item in getDepartments"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                  >{{ item.name }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年級" prop="year">
              <el-select
                placeholder="請選擇您的年級"
                v-model="registerForm.year"
                value-key="id"
              >
                <el-option
                  v-for="(item, index) in registerFormRes.years"
                  :key="item"
                  :label="item"
                  :value="index + 1"
                  >{{ item }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <nuxt-link to="/agreement/user" class="agreementLink"
                >用戶協議</nuxt-link
              >
              <nuxt-link to="/agreement/private" class="agreementLink"
                >隱私權聲明</nuxt-link
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button
                round
                size="medium"
                class="el-button--my"
                @click="registerFormSubmit"
                >同意上方協議並註冊</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import RSAHelper from "@/mixins/RSAHelper";
import {
  apiGetRegisterRes,
  apiLogin,
  apiRegister,
  apiGetCaptcha
} from "@/apis/member";

export default {
  layout: "member",
  middleware: ["auth"],
  mixins: [RSAHelper],
  computed: {
    getDepartments: function() {
      if (this.registerForm.college && this.registerForm.schoolSystem) {
        return this.registerFormRes.departments[this.registerForm.college - 1][
          this.registerForm.schoolSystem - 1
        ];
      }
      return [];
    }
  },
  methods: {
    featuresChange: function(e) {
      let now = e.target.classList;
      if (!now.contains("current")) {
        now.add("current");
        if (now.contains("feature-login")) {
          this.$refs.registerForm.clearValidate();
          document
            .querySelector(".feature-register")
            .classList.remove("current");

          this.isLoginShow = !this.isLoginShow;
        } else {
          document.querySelector(".feature-login").classList.remove("current");
          this.$refs.loginForm.clearValidate();
          this.isLoginShow = !this.isLoginShow;
        }
      }
    },
    captchaClick: async function(e) {
      let validResult = false;

      this.$refs.registerForm.validateField("email", valid => {
        if (!valid) validResult = true;
      });

      if (validResult) {
        let encryptEmail = this.RSAEncrypt(this.registerForm.email);
        let { status, data } = await apiGetCaptcha({
          email: encryptEmail
        });

        if (status === 200 && data.res === 0) {
          this.$notify({
            title: "提示訊息",
            message: "驗證碼已發送",
            position: "top-right",
            duration: 1000,
            type: "success"
          });
        } else if (status === 200 && data.res === -1) {
          this.$notify.error({
            title: "提示訊息",
            message: data.msg,
            position: "top-right",
            duration: 1000
          });
        } else {
          this.$notify.error({
            title: "提示訊息",
            message: "請求錯誤，請重試",
            position: "top-right",
            duration: 1000
          });
        }
      } else {
      }
    },
    registerFormSubmit: async function(e) {
      let validResult = false;
      this.$refs.registerForm.validate(valid => {
        validResult = valid;
      });

      if (validResult) {
        let { status, data } = await apiRegister({
          email: this.RSAEncrypt(this.registerForm.email),
          captcha: this.RSAEncrypt(this.registerForm.captcha),
          name: this.RSAEncrypt(this.registerForm.name),
          sex: this.RSAEncrypt(this.registerForm.sex),
          password: this.RSAEncrypt(this.registerForm.password),
          college: this.RSAEncrypt(this.registerForm.college.toString()),
          schoolSystem: this.RSAEncrypt(
            this.registerForm.schoolSystem.toString()
          ),
          unit: this.RSAEncrypt(this.registerForm.department.toString()),
          year: this.RSAEncrypt(this.registerForm.year.toString())
        });

        if (status === 200 && data.res === 0) {
          this.$notify({
            title: "提示",
            message: "註冊成功，即將跳轉",
            duration: 2000,
            type: "success",
            position: "top-right"
          });
          setTimeout(function() {
            location.reload();
          }, 2000);
          location.reload();
        } else if (status === 200 && data.res === -1) {
          this.$notify({
            title: "提示",
            message: data.msg,
            duration: 1000,
            type: "error",
            position: "top-right"
          });
        }
      }
    },
    loginFormSubmit: async function(e) {
      let validResult = false;
      this.$refs.loginForm.validate(valid => {
        if (valid) validResult = true;
      });

      if (validResult) {
        let { status, data } = await apiLogin({
          username: this.RSAEncrypt(this.loginForm.username),
          password: this.RSAEncrypt(this.loginForm.password)
        });
        if (status === 200 && data.res === 0) {
          location.href = "/";
        } else if (status === 200 && data.res === -1) {
          this.$notify({
            type: "error",
            title: "提示",
            message: data.msg,
            position: "top-right",
            duration: 1000
          });
        } else {
          this.$notify({
            type: "error",
            title: "提示",
            message: "發生未知錯誤，請聯絡開發人員",
            position: "top-right",
            duration: 1000
          });
        }
      }
    }
  },
  data() {
    return {
      isLoginShow: true,
      loginForm: {
        username: undefined,
        password: undefined
      },
      registerForm: {
        email: undefined,
        captcha: undefined,
        name: undefined,
        sex: undefined,
        password: undefined,
        checkPassword: undefined,
        college: undefined,
        department: undefined,
        year: undefined,
        schoolSystem: undefined
      },
      registerFormRule: {
        email: [
          {
            required: true,
            type: "string",
            message: "請輸入校級信箱",
            trigger: "blur"
          },
          {
            pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            message: "請輸入正確的信箱格式",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (value.trim() === "") callback(new Error("請輸入校級信箱"));
              else {
                let temp = value
                  .trim()
                  .split("")
                  .reverse()
                  .join("")
                  .substring(0, 14)
                  .split("")
                  .reverse()
                  .join("");

                if (temp !== "gms.tku.edu.tw")
                  callback(new Error("請輸入淡江大學之校級Gmail信箱"));
                else callback();
              }
            },
            trigger: "blur"
          }
        ],
        captcha: [
          {
            required: true,
            type: "string",
            message: "請輸入驗證碼",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            type: "string",
            message: "請輸入姓名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            type: "string",
            message: "請輸入密碼",
            trigger: "blur"
          },
          {
            min: 8,
            message: "請輸入至少八位密碼",
            trigger: "blur"
          }
        ],
        checkPassword: [
          {
            validator: (rule, value, callback) => {
              if (this.registerForm.password) {
                if (value.trim() === "") {
                  callback(new Error("請確認密碼"));
                } else if (value !== this.registerForm.password) {
                  callback(new Error("請確認兩次密碼輸入一致"));
                } else {
                  callback();
                }
              } else {
                callback(new Error("請先輸入密碼"));
              }
            },
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: true,
            message: "請選擇性別",
            trigger: "blur"
          }
        ],
        college: [
          {
            required: true,
            message: "請選擇學院",
            trigger: "blur"
          }
        ],
        schoolSystem: [
          {
            required: true,
            message: "請選擇學制",
            trigger: "blur"
          }
        ],
        department: [
          {
            required: true,
            message: "請選擇系所",
            trigger: "blur"
          }
        ],
        year: [
          {
            required: true,
            message: "請選擇年級",
            trigger: "blur"
          }
        ]
      },
      loginFormRule: {
        username: [
          {
            required: true,
            type: "string",
            message: "請輸入帳號",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            type: "string",
            message: "請輸入密碼",
            trigger: "blur"
          }
        ]
      }
    };
  },
  async asyncData({
    isDev,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    redirect,
    error
  }) {
    let colleges, departments, schoolSystems;
    let { status, data } = await apiGetRegisterRes();
    if (status === 200 && data.res === 0) {
      colleges = data.data.colleges;
      schoolSystems = data.data.schoolsystems;
      departments = data.data.units;
    }

    return {
      registerFormRes: {
        colleges,
        departments,
        schoolSystems,
        years: ["一年級", "二年級", "三年級", "四年級", "五年級", "六年級"]
      }
    };
  }
};
</script>

<style lang="scss">
@import "@/assets/css/member/index.scss";
</style>
