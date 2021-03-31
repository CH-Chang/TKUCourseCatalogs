<template>
  <div class="m-passwordResetForm">
    <el-form
      label-width="100px"
      ref="passwordResetForm"
      :model="passwordResetForm"
      :rules="passwordResetFormRule"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="校級信箱" prop="email">
            <el-input
              :value="this.$store.state.auth.email"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="驗證碼" prop="captcha">
            <el-input
              placeholder="請輸入驗證碼"
              autocomplete="off"
              v-model="passwordResetForm.captcha"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button class="el-button--my" @click="getCaptcha"
            >獲取驗證碼</el-button
          >
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="舊密碼" prop="oldPassword">
            <el-input
              type="password"
              placeholder="請輸入目前的密碼"
              autocomplete="off"
              v-model="passwordResetForm.oldPassword"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="新密碼" prop="newPassword">
            <el-input
              type="password"
              placeholder="請輸入新密碼"
              autocomplete="off"
              v-model="passwordResetForm.newPassword"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新密碼確認" prop="newPasswordCheck">
            <el-input
              type="password"
              placeholder="請確認新密碼"
              autocomplete="off"
              v-model="passwordResetForm.newPasswordCheck"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button
            round
            class="el-button--my"
            @click="passwordResetFormSubmit"
            >送出</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { apiGetCaptcha, apiEditPassword } from "@/apis/member";
import RSAHelper from "@/mixins/RSAHelper";
export default {
  mixins: [RSAHelper],
  data() {
    return {
      passwordResetForm: {
        captcha: undefined,
        oldPassword: undefined,
        newPassword: undefined,
        newPasswordCheck: undefined
      },
      passwordResetFormRule: {
        captcha: [
          {
            required: true,
            message: "請輸入驗證碼",
            trigger: "blur"
          }
        ],
        oldPassword: [
          {
            required: true,
            message: "請輸入目前的密碼",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            message: "請輸入新密碼",
            trigger: "blur"
          },
          {
            min: 8,
            message: "新密碼長度不得低於八位",
            trigger: "blur"
          }
        ],
        newPasswordCheck: [
          {
            required: true,
            message: "請確認新密碼",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (value.trim() === "") callback(new Error("請確認新密碼"));
              else if (value !== this.passwordResetForm.newPassword)
                callback(new Error("請確認兩次密碼輸入相符"));
              else callback();
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async passwordResetFormSubmit() {
      let validResult = false;
      this.$refs.passwordResetForm.validate(valid => {
        if (valid) validResult = true;
      });
      if (validResult) {
        let response = await apiEditPassword({
          email: this.RSAEncrypt(this.$store.state.auth.email),
          oldPassword: this.RSAEncrypt(this.passwordResetForm.oldPassword),
          newPassword: this.RSAEncrypt(this.passwordResetForm.newPassword),
          captcha: this.RSAEncrypt(this.passwordResetForm.captcha)
        });

        if (response.status === 200 && response.data.res === 0) {
          this.$message({
            message: "密碼更改成功，即將跳轉至登入頁面",
            type: "success"
          });
          setTimeout(function() {
            location.href = "/member";
          }, 1000);
        } else if (response.status === 200 && response.data.res === -1) {
          this.$message({
            message: response.data.msg,
            type: "error"
          });
        } else {
          this.$message({
            message: "發生網路錯誤，請重試",
            type: "error"
          });
        }
      }
    },
    async getCaptcha() {
      let response = await apiGetCaptcha({
        email: this.RSAEncrypt(this.$store.state.auth.email)
      });

      if (response.status === 200 && response.data.res === 0) {
        this.$message({
          message: "驗證碼已發送",
          type: "success"
        });
      } else if (response.status === 200 && response.data.res === -1) {
        this.$message({
          message: response.data.msg,
          type: "error"
        });
      } else {
        this.$message({
          message: "發生網路錯誤，請重試",
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/my/passwordResetForm.scss";
</style>
