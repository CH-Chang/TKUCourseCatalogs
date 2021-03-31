const collegeModel = require("../models/collegeModel");
const schoolsystemModel = require("../models/schoolsystemModel");
const unitModel = require("../models/unitModel");
const accountModel = require("../models/accountModel");
const RSAHelper = require("../utils/RSAHelper");
const SHA256Helper = require("../utils/SHA256Helper");
const JWTHelper = require("../utils/JWTHelper");
const nodeMailerConfig = require("../configs/nodemailerConfig");
const Redis = require("koa-redis");
const nodeMailer = require("nodemailer");

const Store = new Redis().client;

exports.getRegisterRes = async (req, res, next) => {
  try {
    let colleges, schoolsystems, units;
    await collegeModel.getAll().then(([row]) => {
      colleges = row;
    });

    await schoolsystemModel.getAll().then(([row]) => {
      schoolsystems = row;
    });

    await unitModel.getAll().then(([row]) => {
      units = row;
    });

    let result = [];
    for (let i = 0; i < colleges.length; i++) {
      let temp = [];
      for (let j = 0; j < schoolsystems.length; j++) {
        temp.push([]);
      }
      result.push(temp);
    }

    for (let i = 0; i < units.length; i++) {
      if (units[i].schoolsystem && units[i].college) {
        result[getCollegeItemIndexById(units[i].college, colleges)][
          getSchoolSystemItemIndexById(units[i].schoolsystem, schoolsystems)
        ].push({
          id: units[i].id,
          name: units[i].name,
          code: units[i].code
        });
      }
    }

    return res.json({
      res: 0,
      msg: "successful",
      data: { colleges, schoolsystems, units: result }
    });
  } catch (err) {
    return res.json({
      res: -1,
      msg: err
    });
  }
};

exports.getEditRes = async (req, res, next) => {
  try {
    let colleges, schoolsystems, units;
    await collegeModel.getAll().then(([row]) => {
      colleges = row;
    });

    await schoolsystemModel.getAll().then(([row]) => {
      schoolsystems = row;
    });

    await unitModel.getAll().then(([row]) => {
      units = row;
    });

    let result = [];
    for (let i = 0; i < colleges.length; i++) {
      let temp = [];
      for (let j = 0; j < schoolsystems.length; j++) {
        temp.push([]);
      }
      result.push(temp);
    }

    for (let i = 0; i < units.length; i++) {
      if (units[i].schoolsystem && units[i].college) {
        result[getCollegeItemIndexById(units[i].college, colleges)][
          getSchoolSystemItemIndexById(units[i].schoolsystem, schoolsystems)
        ].push({
          id: units[i].id,
          name: units[i].name,
          code: units[i].code
        });
      }
    }

    return res.json({
      res: 0,
      msg: "successful",
      data: { colleges, schoolsystems, units: result }
    });
  } catch (err) {
    return res.json({
      res: -1,
      msg: err
    });
  }
};

exports.getCaptcha = async (req, res, next) => {
  let email;
  try {
    email = RSAHelper.RSADecrypt(req.body.email);
  } catch (err) {
    return res.json({
      res: -1,
      msg: err
    });
  }

  const saveExpire = await Store.hget(`nodemail:${email}`, "expire");
  if (saveExpire) {
    if (new Date().getTime() - saveExpire - 3 * 60 * 1000 < 0) {
      return res.json({
        res: -1,
        msg: "驗證過於頻繁，請三分鐘後重試"
      });
    }
  }

  let transporter = nodeMailer.createTransport({
    service: nodeMailerConfig.smtp.service,
    auth: {
      user: nodeMailerConfig.smtp.user,
      pass: nodeMailerConfig.smtp.pass
    }
  });

  let userData = {
    email,
    code: nodeMailerConfig.code,
    expire: nodeMailerConfig.expire
  };

  let mailOptions = {
    from: `淡江大學課程查詢系統服務 <${nodeMailerConfig.smtp.user}>`,
    to: email,
    subject: "《淡江大學課程查詢系統》 會員驗證郵件",
    text: `感謝您使用淡江大學課程查詢系統，\n您申請的驗證碼為「${userData.code}」，\n請在十分鐘內完成驗證，謝謝。`
  };

  await transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      return res.json({
        res: -1,
        msg: "郵件發送失敗，請重試"
      });
    } else {
      Store.hmset(
        `nodemail:${userData.email}`,
        "code",
        userData.code,
        "expire",
        userData.expire
      );
      return res.json({
        res: 0,
        msg: "successful"
      });
    }
  });
};

exports.register = async (req, res, next) => {
  /*先解碼前端資訊*/
  let {
    email,
    captcha,
    name,
    sex,
    password,
    college,
    schoolSystem,
    unit,
    year
  } = req.body;
  try {
    email = RSAHelper.RSADecrypt(email);
    captcha = RSAHelper.RSADecrypt(captcha);
    name = RSAHelper.RSADecrypt(name);
    sex = RSAHelper.RSADecrypt(sex);
    password = RSAHelper.RSADecrypt(password);
    college = RSAHelper.RSADecrypt(college);
    schoolSystem = RSAHelper.RSADecrypt(schoolSystem);
    unit = RSAHelper.RSADecrypt(unit);
    year = RSAHelper.RSADecrypt(year);
  } catch (err) {
    res.json({
      res: -1,
      msg: "資料解碼錯誤，請聯絡開發人員"
    });
    return false;
  }

  /*檢查有沒有註冊過*/

  await accountModel.getAccountByEmail(email).then(([row]) => {
    if (row.length > 0) {
      return res.json({
        res: -1,
        msg: "重複註冊，請聯繫管理人員"
      });
    }
  });

  /*取得相關驗證碼*/
  const captchaCheck = await Store.hget(`nodemail:${email}`, "code");
  const captchaExpireCheck = await Store.hget(`nodemail:${email}`, "expire");
  await Store.hdel(`nodemail:${email}`, "code");
  await Store.hdel(`nodemail:${email}`, "expire");

  /*檢查驗證碼是否過期*/
  if (captchaExpireCheck) {
    if (new Date().getTime() > captchaExpireCheck) {
      return res.json({
        res: -1,
        msg: "驗證碼已過期，請重新申請"
      });
    }
  }
  /*檢查驗證碼是否正確*/
  if (captchaCheck) {
    if (captchaCheck !== captcha) {
      return res.json({
        res: -1,
        msg: "驗證碼認證錯誤，請重試"
      });
    }
  } else {
    return res.json({
      res: -1,
      msg: "驗證碼認證錯誤，請重試"
    });
  }

  /*雜湊取得雜湊後密碼*/
  let hashPassword = SHA256Helper.SHA256Hash(password);

  /*開始新增帳號*/
  await accountModel
    .register(
      email,
      hashPassword,
      name,
      sex,
      college,
      unit,
      schoolSystem,
      year,
      2
    )
    .then(([row]) => {});

  return res.json({
    res: 0,
    msg: "successful"
  });
};

exports.login = async (req, res, next) => {
  let { username, password } = req.body;
  try {
    username = RSAHelper.RSADecrypt(username);
    password = RSAHelper.RSADecrypt(password);
  } catch (err) {
    return res.json({
      res: -1,
      msg: "解碼錯誤，請聯繫開發人員"
    });
  }

  let hashPassword = SHA256Helper.SHA256Hash(password);
  let token;
  try {
    await accountModel.login(username, hashPassword).then(([row]) => {
      if (row.length > 0) {
        let userData = {
          username: row[0].account,
          collegeId: row[0].collegeId,
          schoolSystemId: row[0].schoolSystemId,
          unitId: row[0].unitId,
          year: row[0].year
        };
        token = JWTHelper.sign(userData, "1 day");
      }
    });
    if (token) {
      res.cookie("token", token, {
        maxAge: 86400000,
        httpOnly: true,
        signed: true
      });
      return res.json({
        res: 0,
        msg: "successful"
      });
    } else {
      return res.json({
        res: -1,
        msg: "帳號或密碼錯誤，請重試"
      });
    }
  } catch (err) {
    return res.json({
      res: -1,
      msg: err
    });
  }
};

exports.logout = async (req, res, next) => {
  if (req.signedCookies.token) {
    res.clearCookie("token");
    return res.json({
      res: 0,
      msg: "登出成功"
    });
  } else {
    return res.json({
      res: -1,
      msg: "未登入"
    });
  }
};

exports.getUserInfo = async (req, res, next) => {
  let user;

  try {
    await accountModel
      .getAccountByEmail(req.headers.decryptedToken.username)
      .then(([row]) => {
        user = {
          email: req.headers.decryptedToken.username,
          name: row[0].name,
          sex: row[0].sex,
          college: row[0].college,
          unit: row[0].unit,
          schoolSystem: row[0].schoolSystem,
          year: row[0].year,
          role: row[0].role
        };
      });

    if (user) {
      return res.json({
        res: 0,
        msg: "successful",
        data: user
      });
    } else {
      return res.json({
        res: -1,
        msg: "發生錯誤，請聯絡開發人員"
      });
    }
  } catch (err) {
    return res.json({
      res: -1,
      msg: "解碼錯誤，請聯絡開發人員"
    });
  }
};

exports.editInfo = async (req, res, next) => {
  /*先解碼資料*/
  let { email, name, sex, college, schoolsystem, unit, year } = req.body;
  try {
    email = RSAHelper.RSADecrypt(email);
    name = RSAHelper.RSADecrypt(name);
    sex = RSAHelper.RSADecrypt(sex);
    college = RSAHelper.RSADecrypt(college);
    schoolsystem = RSAHelper.RSADecrypt(schoolsystem);
    unit = RSAHelper.RSADecrypt(unit);
    year = RSAHelper.RSADecrypt(year);
  } catch (err) {
    return res.json({
      res: -1,
      msg: "解碼錯誤，請聯絡開發人員"
    });
  }

  /*確認token符合*/
  if (email !== req.headers.decryptedToken.username) {
    res.json({
      res: -1,
      msg: "帳戶校驗錯誤，請重新登入後重試"
    });
  }

  /*操作資料庫*/
  try {
    await accountModel
      .editInfo(name, sex, college, unit, schoolsystem, year, email)
      .then(([row]) => {});
    return res.json({
      res: 0,
      msg: "successful"
    });
  } catch (err) {
    return res.json({
      res: -1,
      msg: "發生資料庫錯誤，請聯絡開發人員"
    });
  }
};

exports.editPassword = async (req, res, next) => {
  /*先解碼資料*/
  let { email, oldPassword, newPassword, captcha } = req.body;
  try {
    email = RSAHelper.RSADecrypt(email);
    oldPassword = RSAHelper.RSADecrypt(oldPassword);
    newPassword = RSAHelper.RSADecrypt(newPassword);
    captcha = RSAHelper.RSADecrypt(captcha);
  } catch (err) {
    return res.json({
      res: -1,
      msg: "解碼錯誤，請聯絡開發人員"
    });
  }

  /*取得相關驗證碼*/
  const captchaExpireCheck = await Store.hget(`nodemail:${email}`, "expire");
  const captchaCheck = await Store.hget(`nodemail:${email}`, "code");
  await Store.hdel(`nodemail:${email}`, "code");
  await Store.hdel(`nodemail:${email}`, "expire");

  /*確認驗證碼未過期*/
  if (captchaExpireCheck) {
    if (new Date().getTime() > captchaExpireCheck) {
      return res.json({
        res: -1,
        msg: "驗證碼已過期，請重新申請"
      });
    }
  } else {
    return res.json({
      res: -1,
      msg: "驗證碼認證錯誤，請重試"
    });
  }

  /*檢查驗證碼是否正確*/

  if (captchaCheck) {
    if (captchaCheck !== captcha) {
      return res.json({
        res: -1,
        msg: "驗證碼認證錯誤，請重試"
      });
    }
  } else {
    return res.json({
      res: -1,
      msg: "驗證碼認證錯誤，請重試"
    });
  }

  /*確認Token匹配*/
  if (email !== req.headers.decryptedToken.username) {
    return res.json({
      res: -1,
      msg: "帳戶校驗錯誤，請重新登入後重試"
    });
  }

  /*確認舊密碼正確*/
  let hashOldPassword;
  try {
    hashOldPassword = SHA256Helper.SHA256Hash(oldPassword);
  } catch (err) {
    return res.json({
      res: -1,
      msg: "密碼寫入錯誤，請聯絡開發人員"
    });
  }
  try {
    let oldPasswordCheck;
    await accountModel.login(email, hashOldPassword).then(([row]) => {
      if (row.length === 0) {
        oldPasswordCheck = false;
      } else {
        oldPasswordCheck = true;
      }
    });
    if (!oldPasswordCheck) {
      return res.json({
        res: -1,
        msg: "舊密碼輸入錯誤，請重試"
      });
    }
  } catch (err) {
    return res.json({
      res: -1,
      msg: "資料庫查詢錯誤，請聯絡開發人員"
    });
  }
  /*開始更改密碼*/
  let hashNewPassword;
  try {
    hashNewPassword = SHA256Helper.SHA256Hash(newPassword);
  } catch (err) {
    return res.json({
      res: -1,
      msg: "密碼寫入錯誤，請聯絡開發人員"
    });
  }

  try {
    await accountModel.editPassword(email, hashNewPassword).then(([row]) => {});
    res.clearCookie("token");
    return res.json({
      res: 0,
      msg: "successful"
    });
  } catch (err) {
    return res.json({
      res: -1,
      msg: "資料庫寫入錯誤，請聯絡開發人員"
    });
  }
};

function getCollegeItemIndexById(id, colleges) {
  for (let i = 0; i < colleges.length; i++) {
    if (id === colleges[i].id) return i;
  }
  return -1;
}

function getSchoolSystemItemIndexById(id, schoolSystems) {
  for (let i = 0; i < schoolSystems.length; i++) {
    if (id === schoolSystems[i].id) return i;
  }
  return -1;
}
