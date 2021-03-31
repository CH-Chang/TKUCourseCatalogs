const dbPool = require("../utils/database");

const SchoolSystem = class SchoolSystem {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static getAll() {
    return dbPool.execute("select * from schoolsystem;");
  }
};

module.exports = SchoolSystem;
