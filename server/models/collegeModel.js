const dbPool = require("../utils/database");

const College = class College {
  constructor(id, collegeTW, collegeEN) {
    this.id = id;
    this.collegeTW = collegeTW;
    this.collegeEN = collegeEN;
  }

  static getAll() {
    return dbPool.execute("select * from college;");
  }
};

module.exports = College;
