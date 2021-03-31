<template>
  <div class="m-course">
    <el-table :data="this.courses" ref="courseTable">
      <el-table-column type="expand" min-width="5%">
        <template slot-scope="props">
          <el-form>
            <el-form-item label="英文名稱">{{
              props.row.englishName
            }}</el-form-item>
            <el-form-item label="正課資訊">
              {{ formatTime(props.row.regular) }}
            </el-form-item>
            <el-form-item label="實習資訊" v-if="props.row.practice.length">{{
              formatTime(props.row.practice)
            }}</el-form-item>

            <el-form-item label="線上攻略">
              <a :href="getDcardLink(props.row.professor)" target="_blank"
                ><img
                  src="@/assets/img/logo-dcard.png"
                  alt="Dcard攻略"
                  class="raiderImg"
              /></a>
              <a :href="getPTTLink(props.row.professor)" target="_blank"
                ><img
                  src="@/assets/img/logo-ptt.png"
                  alt="PTT攻略"
                  class="raiderImg"
              /></a>
            </el-form-item>
            <el-form-item label="相關操作">
              <el-button
                v-if="!isSelected(props.row.courseNumber)"
                round
                size="mini"
                class="el-button el-button--my"
                @click="
                  select(
                    props.row.courseNumber,
                    props.row.required === '必修' ? 0 : 1,
                    props.row.credit
                  )
                "
                >加入課表</el-button
              >
              <el-button
                v-else
                round
                size="mini"
                class="el-button el-button--my"
                @click="
                  unselect(
                    props.row.courseNumber,
                    props.row.required === '必修' ? 0 : 1,
                    props.row.credit
                  )
                "
                >移除課程</el-button
              >
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="系所"
        column-key="unitCode"
        prop="unitCode"
        min-width="10%"
        :filters="getFilters('unitCode')"
        :filter-method="filterUnit"
      ></el-table-column>
      <el-table-column
        align="center"
        label="序號"
        prop="courseNumber"
        column-key="courseNumber"
        min-width="10%"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="年級"
        prop="year"
        column-key="year"
        min-width="10%"
        :filters="getFilters('year')"
        :filter-method="filterYear"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="班級"
        prop="classes"
        column-key="classes"
        min-width="10%"
        :filters="getFilters('classes')"
        :filter-method="filterClasses"
      ></el-table-column>
      <el-table-column
        align="center"
        label="課程名稱"
        prop="chineseName"
        column-key="chineseName"
        min-width="23%"
        :filters="getFilters('chineseName')"
        :filter-method="filterChineseName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="必選修"
        prop="required"
        column-key="required"
        min-width="10%"
        :filters="getFilters('required')"
        :filter-method="filterRequired"
      ></el-table-column>
      <el-table-column
        align="center"
        label="學分"
        prop="credit"
        column-key="credit"
        min-width="10%"
        :filters="getFilters('credit')"
        :filter-method="filterCredit"
      ></el-table-column>
      <el-table-column
        align="center"
        label="教授"
        prop="professor"
        column-key="professor"
        min-width="12%"
        :filters="getFilters('professor')"
        :filter-method="filterProfessor"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import AES256Helper from "../../mixins/AES256Helper";
import Cookie from "js-cookie";
export default {
  props: {
    courses: Array
  },
  mixins: [AES256Helper],
  computed: {
    isSelected() {
      return function(courseNumber) {
        return this.$store.state.selection.courses.includes(courseNumber);
      };
    },
    formatTime() {
      return function(timeArray) {
        let res = "";
        let weekNum2Chi = {
          "1": "星期一",
          "2": "星期二",
          "3": "星期三",
          "4": "星期四",
          "5": "星期五",
          "6": "星期六",
          "7": "星期日"
        };
        let sessionNum2Chi = {
          "1": "第一節",
          "2": "第二節",
          "3": "第三節",
          "4": "第四節",
          "5": "第五節",
          "6": "第六節",
          "7": "第七節",
          "8": "第八節",
          "9": "第九節",
          "10": "第十節",
          "11": "第十一節",
          "12": "第十二節",
          "13": "第十三節",
          "14": "第十四節"
        };
        for (let i = 0; i < timeArray.length; i++) {
          res += weekNum2Chi[timeArray[i].week];
          res += " " + sessionNum2Chi[timeArray[i].session];
          res += " " + timeArray[i].room;
          if (i != timeArray.length - 1) res += "、";
        }

        return res;
      };
    },
    getDcardLink() {
      return function(professor) {
        return "https://www.dcard.tw/search?query=" + professor + "&forum=tku";
      };
    },
    getPTTLink() {
      return function(professor) {
        return "https://www.ptt.cc/bbs/TKU_Talk/search?q=" + professor;
      };
    },
    getFilters() {
      return function(colName) {
        let res = [];
        let repeatFilter = [];
        for (let i = 0; i < this.courses.length; i++) {
          let item = {
            text: this.courses[i][colName],
            value: this.courses[i][colName]
          };
          if (!repeatFilter.includes(this.courses[i][colName])) {
            res.push(item);
            repeatFilter.push(this.courses[i][colName]);
          }
        }
        return res;
      };
    }
  },
  methods: {
    filterUnit: function(value, row, column) {
      return value == row.unitCode;
    },
    filterYear: function(value, row, column) {
      return value == row.year;
    },
    filterClasses: function(value, row, column) {
      return value == row.classes;
    },
    filterChineseName: function(value, row, column) {
      return value == row.chineseName;
    },
    filterRequired: function(value, row, column) {
      return value == row.required;
    },
    filterCredit: function(value, row, column) {
      return value == row.credit;
    },
    filterProfessor: function(value, row, column) {
      return value == row.professor;
    },
    select: function(courseNumber, required, credit) {
      //判斷是不是第一次
      if (Cookie.get("selection")) {
        let decryptedSelection = this.AES256Decrypt(Cookie.get("selection"));
        let selection = JSON.parse(decryptedSelection);

        if (!selection.courses.includes(courseNumber)) {
          selection.courses.push(courseNumber);
          selection.totalCourses += 1;
          selection.totalCredits += credit;
          if (required === 0) selection.totalRequiredCredits += credit;
          else selection.totalElectiveCredits += credit;

          let strSelection = JSON.stringify(selection);
          let encryptedSelection = this.AES256Encrypt(strSelection);
          Cookie.set("selection", encryptedSelection);

          let vuexOptions = {
            hasSelected: true,
            totalCourses: selection.totalCourses,
            totalCredits: selection.totalCredits,
            totalElectiveCredits: selection.totalElectiveCredits,
            totalRequiredCredits: selection.totalRequiredCredits,
            courses: selection.courses
          };

          this.$store.commit("selection/setSelection", vuexOptions);

          this.$message({
            message: "選課成功",
            type: "success"
          });
        }
      } else {
        let selection = {
          totalCourses: 0,
          totalCredits: 0,
          totalElectiveCredits: 0,
          totalRequiredCredits: 0,
          courses: []
        };
        selection.courses.push(courseNumber);
        selection.totalCourses += 1;
        selection.totalCredits += credit;
        if (required === 0) selection.totalRequiredCredits += credit;
        else selection.totalElectiveCredits += credit;

        let strSelection = JSON.stringify(selection);
        let encryptedSelection = this.AES256Encrypt(strSelection);
        Cookie.set("selection", encryptedSelection);

        let vuexOptions = {
          hasSelected: true,
          totalCourses: selection.totalCourses,
          totalCredits: selection.totalCredits,
          totalElectiveCredits: selection.totalElectiveCredits,
          totalRequiredCredits: selection.totalRequiredCredits,
          courses: selection.courses
        };

        this.$store.commit("selection/setSelection", vuexOptions);

        this.$message({
          message: "選課成功",
          type: "success"
        });
      }
    },
    unselect: function(courseNumber, required, credit) {
      if (Cookie.get("selection")) {
        let selection = JSON.parse(this.AES256Decrypt(Cookie.get("selection")));
        if (selection.courses.includes(courseNumber)) {
          let targetIndex = selection.courses.indexOf(courseNumber);
          if (targetIndex > -1) selection.courses.splice(targetIndex, 1);
          else {
            this.$message({
              message: "移除失敗",
              type: "error"
            });
            return;
          }
          selection.totalCourses -= 1;
          selection.totalCredits -= credit;
          if (required === 0) selection.totalRequiredCredits -= credit;
          else selection.totalElectiveCredits -= credit;
        }

        Cookie.set("selection", this.AES256Encrypt(JSON.stringify(selection)));

        this.$store.commit("selection/setSelection", selection);

        let temp = -1;
        for (let i = 0; i < this.courses.length; i++) {
          if (this.courses[i].courseNumber === courseNumber) {
            temp = i;
            break;
          }
        }

        if (temp !== -1) {
          this.courses.splice(temp, 1);
        }

        this.$message({
          message: "移除成功",
          type: "success"
        });
      } else {
        this.$message({
          message: "移除失敗",
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/unitCourse/course.scss";
</style>
