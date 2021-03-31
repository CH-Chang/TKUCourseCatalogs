const dbPool = require("../utils/database");

const Account = class Account {
  constructor(
    id,
    account,
    password,
    name,
    sex,
    collegeId,
    college,
    unitId,
    unit,
    schoolSystemId,
    schoolSystem,
    year,
    accountRole,
    role
  ) {
    this.id = id;
    this.account = account;
    this.password = password;
    this.personnelId = personnelId;
    this.name = name;
    this.sex = sex;
    this.collegeId = collegeId;
    this.unitId = unitId;
    this.schoolSystemId = schoolSystemId;
    this.year = year;
    this.accountRole = accountRole;
    this.college = college;
    this.unit = unit;
    this.schoolSystem = schoolSystem;
    this.role = role;
  }

  static getAccountByEmail(email) {
    return dbPool.execute(
      "SELECT A.id, A.account, A.password, A.name, A.sex,  A.collegeId, C.collegeTW as college, A.unitId, U.name as unit, A.schoolSystemId, S.name as schoolSystemId, A.year, A.accountRole, R.name as role FROM account as A, role as R, college as C, unit as U, schoolsystem as S where A.accountRole=R.id and A.unitId=U.id and A.collegeId=C.id and A.schoolSystemId=S.id and A.account=?;",
      [email]
    );
  }

  static register(
    email,
    password,
    name,
    sex,
    collegeId,
    unitId,
    schoolSystemId,
    year,
    accountRole
  ) {
    return dbPool.execute(
      "insert into account (account, password, accountRole, name, sex, collegeId, unitId, schoolSystemId, year) value (?,?,?,?,?,?,?,?,?)",
      [
        email,
        password,
        accountRole,
        name,
        sex,
        collegeId,
        unitId,
        schoolSystemId,
        year
      ]
    );
  }

  static login(username, password) {
    return dbPool.execute(
      "SELECT A.id, A.account, A.password, A.name, A.sex,  A.collegeId, C.collegeTW as college, A.unitId, U.name as unit, A.schoolSystemId, S.name as schoolSystem, A.year, A.accountRole, R.name as role FROM account as A, role as R, college as C, unit as U, schoolsystem as S where A.accountRole=R.id and A.unitId=U.id and A.collegeId=C.id and A.schoolSystemId=S.id and A.account=? and A.password=?;",
      [username, password]
    );
  }

  static editInfo(name, sex, college, unit, schoolSystem, year, email) {
    return dbPool.execute(
      "update account set name=?, sex=?, collegeId=?, unitId=?, schoolSystemId=?, year=? where account =?;",
      [name, sex, college, unit, schoolSystem, year, email]
    );
  }

  static editPassword(email, newPassword) {
    return dbPool.execute("update account set password=? where account=?", [
      newPassword,
      email
    ]);
  }
};

module.exports = Account;
