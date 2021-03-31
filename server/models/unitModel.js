const dbPool = require("../utils/database");

const Unit = class Unit {
  constructor(id, name, code, category, schoolsystem, college) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.category = category;
    this.schoolsystem = schoolsystem;
    this.college = college;
  }

  static getAll() {
    return dbPool.execute("select * from unit;");
  }
};

module.exports = Unit;
