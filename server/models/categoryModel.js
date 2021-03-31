const dbPool = require("../utils/database");

const Category = class Category {
  constructor(id, nameTW, nameEN) {
    this.id = id;
    this.nameTW = nameTW;
    this.nameEN = nameEN;
  }

  static getAll() {
    return dbPool.execute("select * from category;");
  }
};

module.exports = Category;
