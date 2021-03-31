<template>
  <div class="m-infoForm">
    <el-form
      label-width="100px"
      ref="infoForm"
      :rules="infoFormRule"
      :model="infoForm"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="校級信箱" prop="email">
            <el-input
              :value="this.$store.state.auth.email"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input
              placeholder="請輸入姓名"
              v-model="infoForm.name"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性別" prop="sex">
            <el-radio label="1" v-model="infoForm.sex">男性</el-radio>
            <el-radio label="0" v-model="infoForm.sex">女性</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="學院" prop="college">
            <el-select placeholder="請選擇學院" v-model="infoForm.college">
              <el-option
                v-for="item in this.editRes.colleges"
                :key="item.collegeTW"
                :label="item.collegeTW"
                :value="item.id"
                >{{ item.collegeTW }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="學制" prop="schoolsystem">
            <el-select placeholder="請選擇學制" v-model="infoForm.schoolsystem">
              <el-option
                v-for="item in this.editRes.schoolsystems"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              >
                {{ item.name }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="系所" prop="unit">
            <el-select placeholder="請選擇系所" v-model="infoForm.unit">
              <el-option
                v-for="item in getUnits"
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
            <el-select placeholder="請選擇年級" v-model="infoForm.year">
              <el-option
                v-for="(item, index) in this.editRes.years"
                :key="item"
                :label="item"
                :value="index + 1"
                >{{ item }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button
            round
            size="medium"
            class="el-button--my"
            @click="infoFormCommit"
            >更改</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { apiEditInfo } from "@/apis/member";
import RSAHelper from "@/mixins/RSAHelper";
export default {
  props: {
    editRes: Object
  },
  mixins: [RSAHelper],
  data() {
    return {
      infoForm: {
        email: undefined,
        name: undefined,
        sex: undefined,
        college: undefined,
        schoolsystem: undefined,
        unit: undefined,
        year: undefined
      },
      infoFormRule: {
        name: [
          {
            required: true,
            type: "string",
            message: "請輸入姓名",
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
        schoolsystem: [
          {
            required: true,
            message: "請選擇學制",
            trigger: "blur"
          }
        ],
        unit: [
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
      }
    };
  },
  computed: {
    getUnits: function() {
      if (this.infoForm.college && this.infoForm.schoolsystem) {
        return this.editRes.units[this.infoForm.college - 1][
          this.infoForm.schoolsystem - 1
        ];
      }
      return [];
    }
  },
  methods: {
    async infoFormCommit() {
      let validResult = false;
      this.$refs.infoForm.validate(valid => {
        if (valid) validResult = true;
      });

      if (validResult) {
        this.$confirm("請確認是否修改個人資料", "提示訊息", {
          confirmButtonText: "確認",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(async () => {
            let response = await apiEditInfo({
              email: this.RSAEncrypt(this.$store.state.auth.email),
              name: this.RSAEncrypt(this.infoForm.name),
              sex: this.RSAEncrypt(this.infoForm.sex),
              college: this.RSAEncrypt(this.infoForm.college.toString()),
              schoolsystem: this.RSAEncrypt(
                this.infoForm.schoolsystem.toString()
              ),
              unit: this.RSAEncrypt(this.infoForm.unit.toString()),
              year: this.RSAEncrypt(this.infoForm.year.toString())
            });

            if (response.status === 200 && response.data.res === 0) {
              this.$message({
                message: "修改成功，即將跳轉",
                type: "success"
              });
              setTimeout(function() {
                location.href = "/my";
              }, 1000);
            } else if (response.status === 200 && response.data.res === -1) {
              this.$message({
                message: response.data.msg,
                type: "error"
              });
            } else {
              this.$message({
                message: "發生未知錯誤，請聯絡開發人員",
                type: "error"
              });
            }
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/my/infoForm.scss";
</style>
