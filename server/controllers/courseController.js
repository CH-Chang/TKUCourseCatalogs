const categoryModel = require("../models/categoryModel");
const unitModel = require("../models/unitModel");
const courseModel = require("../models/courseModel");
const AES256Helper = require("../utils/AES256Helper");

exports.getCategory = async (req, res, next) => {
  let categories = [];
  try {
    await categoryModel.getAll().then(([row]) => {
      for (let i = 0; i < row.length; i++) {
        let category = {
          titleTW: row[i].nameTW,
          titleEN: row[i].nameEN,
          icon: "el-icon-location-information",
          subCategory: [
            {
              titleTW: row[i].nameTW,
              titleEN: row[i].nameEN,
              units: []
            }
          ]
        };
        categories.push(category);
      }
    });

    await unitModel.getAll().then(([row]) => {
      for (let i = 0; i < row.length; i++) {
        categories[row[i].category - 1].subCategory[0].units.push({
          unitName: row[i].name,
          unitCode: row[i].code
        });
      }
    });

    return res.json({
      res: 0,
      msg: "successful",
      category: categories
    });
  } catch (err) {
    return res.json({
      res: -1,
      msg: err
    });
  }
};

exports.getUnitCourse = async (req, res, next) => {
  let courses = [];
  let coursesCount = 0;
  try {
    await courseModel
      .getCourseByUnitCode(req.query.unitCode, (req.query.pages - 1) * 10)
      .then(([row]) => {
        let courseNumber = "";
        for (let i = 0; i < row.length; i++) {
          if (courseNumber !== row[i].courseNumber) {
            courseNumber = row[i].courseNumber;
            courses.push({
              unitCode: row[i].unitCode,
              unitName: row[i].unitName,
              courseNumber: row[i].courseNumber,
              subjectNumber: row[i].subjectNumber,
              proGroup: row[i].proGroup,
              year: row[i].year,
              classes: row[i].classes,
              credit: row[i].credit,
              generalGroup: row[i].generalGroup,
              required: row[i].required == 0 ? "必修" : "選修",
              chineseName: row[i].chineseName,
              englishName: row[i].englishName,
              stuLimit: row[i].stuLimit,
              professor: row[i].professor,
              regular: [
                {
                  week: row[i].week,
                  session: row[i].session,
                  room: row[i].room
                }
              ],
              practice: []
            });
          } else {
            if (row[i].type == 0) {
              courses[courses.length - 1].regular.push({
                week: row[i].week,
                session: row[i].session,
                room: row[i].room
              });
            } else {
              courses[courses.length - 1].practice.push({
                week: row[i].week,
                session: row[i].session,
                room: row[i].room
              });
            }
          }
        }
      });

    await courseModel
      .getCourseCountByUnitCode(req.query.unitCode)
      .then(([row]) => {
        coursesCount = row[0].count;
      });
    res.json({
      res: 0,
      msg: "successful",
      coursesCount,
      courses
    });
  } catch (err) {
    res.json({
      res: -1,
      msg: err
    });
  }
};

exports.getSelectedCourse = async (req, res, next) => {
  if (req.cookies.selection) {
    let selection;
    try {
      selection = JSON.parse(AES256Helper.AES256Decrypt(req.cookies.selection));
    } catch (err) {
      return res.json({
        res: -1,
        msg: "解碼資料錯誤，請聯絡開發人員"
      });
    }

    let courses = [];
    try {
      await courseModel
        .getCourseByCourseNumbers(selection.courses)
        .then(([row]) => {
          let courseNumber = "";
          for (let i = 0; i < row.length; i++) {
            if (courseNumber !== row[i].courseNumber) {
              courseNumber = row[i].courseNumber;
              courses.push({
                unitCode: row[i].unitCode,
                unitName: row[i].unitName,
                courseNumber: row[i].courseNumber,
                subjectNumber: row[i].subjectNumber,
                proGroup: row[i].proGroup,
                year: row[i].year,
                classes: row[i].classes,
                credit: row[i].credit,
                generalGroup: row[i].generalGroup,
                required: row[i].required == 0 ? "必修" : "選修",
                chineseName: row[i].chineseName,
                englishName: row[i].englishName,
                stuLimit: row[i].stuLimit,
                professor: row[i].professor,
                regular: [
                  {
                    week: row[i].week,
                    session: row[i].session,
                    room: row[i].room
                  }
                ],
                practice: []
              });
            } else {
              if (row[i].type == 0) {
                courses[courses.length - 1].regular.push({
                  week: row[i].week,
                  session: row[i].session,
                  room: row[i].room
                });
              } else {
                courses[courses.length - 1].practice.push({
                  week: row[i].week,
                  session: row[i].session,
                  room: row[i].room
                });
              }
            }
          }
        });
      return res.json({
        res: 0,
        msg: "successful",
        courses: courses
      });
    } catch (err) {
      return res.json({
        res: -1,
        msg: "資料庫查詢錯誤，請聯絡開發人員"
      });
    }
  } else {
    res.json({
      res: 0,
      msg: "successful",
      courses: []
    });
  }
};

exports.getPossibleInUnit = async (req, res, next) => {
  let user;
  let selection;
  try {
    user = req.headers.decryptedToken;
    selection = JSON.parse(AES256Helper.AES256Decrypt(req.cookies.selection));
  } catch (err) {
    return res.json({
      res: -1,
      msg: "解碼資料錯誤，請聯絡開發人員"
    });
  }

  /*查詢課程時間*/
  let impossibleSessions = [[], [], [], [], [], [], []];
  try {
    if (selection.courses.length === 0) selection.courses.push("-1");
    await courseModel
      .getCourseByCourseNumbers(selection.courses)
      .then(([row]) => {
        for (let i = 0; i < row.length; i++) {
          if (!impossibleSessions[row[i].week - 1].includes(row[i].session))
            impossibleSessions[row[i].week - 1].push(row[i].session);
        }
        for (let i = 0; i < impossibleSessions.length; i++) {
          if (impossibleSessions[i].length === 0)
            impossibleSessions[i].push(-2);
        }
      });
  } catch (err) {
    return res.json({
      res: -1,
      msg: "查詢資料庫錯誤，請聯絡開發人員"
    });
  }

  let courses = [];
  let coursesCount = 0;
  try {
    await courseModel
      .getPossibleInUnit(
        impossibleSessions,
        user.schoolSystemId,
        user.unitId,
        (req.query.pages - 1) * 10
      )
      .then(([row]) => {
        let courseNumber = "";
        for (let i = 0; i < row.length; i++) {
          if (courseNumber !== row[i].courseNumber) {
            courseNumber = row[i].courseNumber;
            courses.push({
              unitCode: row[i].unitCode,
              unitName: row[i].unitName,
              courseNumber: row[i].courseNumber,
              subjectNumber: row[i].subjectNumber,
              proGroup: row[i].proGroup,
              year: row[i].year,
              classes: row[i].classes,
              credit: row[i].credit,
              generalGroup: row[i].generalGroup,
              required: row[i].required == 0 ? "必修" : "選修",
              chineseName: row[i].chineseName,
              englishName: row[i].englishName,
              stuLimit: row[i].stuLimit,
              professor: row[i].professor,
              regular: [
                {
                  week: row[i].week,
                  session: row[i].session,
                  room: row[i].room
                }
              ],
              practice: []
            });
          } else {
            if (row[i].type == 0) {
              courses[courses.length - 1].regular.push({
                week: row[i].week,
                session: row[i].session,
                room: row[i].room
              });
            } else {
              courses[courses.length - 1].practice.push({
                week: row[i].week,
                session: row[i].session,
                room: row[i].room
              });
            }
          }
        }
      });

    await courseModel
      .getPossibleCountInUnit(
        impossibleSessions,
        user.schoolSystemId,
        user.unitId
      )
      .then(([row]) => {
        coursesCount = row[0].count;
      });

    return res.json({
      res: 0,
      msg: "successful",
      courses,
      coursesCount
    });
  } catch (err) {
    console.log(err);
    return res.json({
      res: -1,
      msg: "查詢資料庫錯誤"
    });
  }
};

exports.getPossibleOutUnit = async (req, res, next) => {
  let user;
  let selection;
  try {
    user = req.headers.decryptedToken;
    selection = JSON.parse(AES256Helper.AES256Decrypt(req.cookies.selection));
  } catch (err) {
    return res.json({
      res: -1,
      msg: "解碼資料錯誤，請聯絡開發人員"
    });
  }

  /*查詢課程時間*/
  let impossibleSessions = [[], [], [], [], [], [], []];
  try {
    if (selection.courses.length === 0) selection.courses.push("-1");
    await courseModel
      .getCourseByCourseNumbers(selection.courses)
      .then(([row]) => {
        for (let i = 0; i < row.length; i++) {
          if (!impossibleSessions[row[i].week - 1].includes(row[i].session))
            impossibleSessions[row[i].week - 1].push(row[i].session);
        }
        for (let i = 0; i < impossibleSessions.length; i++) {
          if (impossibleSessions[i].length === 0)
            impossibleSessions[i].push(-2);
        }
      });
  } catch (err) {
    return res.json({
      res: -1,
      msg: "查詢資料庫錯誤，請聯絡開發人員"
    });
  }

  let courses = [];
  let coursesCount = 0;
  try {
    await courseModel
      .getPossibleOutUnit(
        impossibleSessions,
        user.schoolSystemId,
        user.unitId,
        (req.query.pages - 1) * 10
      )
      .then(([row]) => {
        let courseNumber = "";
        for (let i = 0; i < row.length; i++) {
          if (courseNumber !== row[i].courseNumber) {
            courseNumber = row[i].courseNumber;
            courses.push({
              unitCode: row[i].unitCode,
              unitName: row[i].unitName,
              courseNumber: row[i].courseNumber,
              subjectNumber: row[i].subjectNumber,
              proGroup: row[i].proGroup,
              year: row[i].year,
              classes: row[i].classes,
              credit: row[i].credit,
              generalGroup: row[i].generalGroup,
              required: row[i].required == 0 ? "必修" : "選修",
              chineseName: row[i].chineseName,
              englishName: row[i].englishName,
              stuLimit: row[i].stuLimit,
              professor: row[i].professor,
              regular: [
                {
                  week: row[i].week,
                  session: row[i].session,
                  room: row[i].room
                }
              ],
              practice: []
            });
          } else {
            if (row[i].type == 0) {
              courses[courses.length - 1].regular.push({
                week: row[i].week,
                session: row[i].session,
                room: row[i].room
              });
            } else {
              courses[courses.length - 1].practice.push({
                week: row[i].week,
                session: row[i].session,
                room: row[i].room
              });
            }
          }
        }
      });

    await courseModel
      .getPossibleCountOutUnit(
        impossibleSessions,
        user.schoolSystemId,
        user.unitId
      )
      .then(([row]) => {
        coursesCount = row[0].count;
      });

    return res.json({
      res: 0,
      msg: "successful",
      courses,
      coursesCount
    });
  } catch (err) {
    return res.json({
      res: -1,
      msg: "查詢資料庫錯誤"
    });
  }
};

exports.getPossibleGeneral = async (req, res, next) => {
  let user;
  let selection;
  try {
    user = req.headers.decryptedToken;
    selection = JSON.parse(AES256Helper.AES256Decrypt(req.cookies.selection));
  } catch (err) {
    return res.json({
      res: -1,
      msg: "解碼資料錯誤，請聯絡開發人員"
    });
  }

  /*查詢課程時間*/
  let impossibleSessions = [[], [], [], [], [], [], []];
  try {
    if (selection.courses.length === 0) selection.courses.push("-1");
    await courseModel
      .getCourseByCourseNumbers(selection.courses)
      .then(([row]) => {
        for (let i = 0; i < row.length; i++) {
          if (!impossibleSessions[row[i].week - 1].includes(row[i].session))
            impossibleSessions[row[i].week - 1].push(row[i].session);
        }
        for (let i = 0; i < impossibleSessions.length; i++) {
          if (impossibleSessions[i].length === 0)
            impossibleSessions[i].push(-2);
        }
      });
  } catch (err) {
    return res.json({
      res: -1,
      msg: "查詢資料庫錯誤，請聯絡開發人員"
    });
  }

  let courses = [];
  let coursesCount = 0;
  try {
    await courseModel
      .getPossibleGeneral(
        impossibleSessions,
        user.schoolSystemId,
        (req.query.pages - 1) * 10
      )
      .then(([row]) => {
        let courseNumber = "";
        for (let i = 0; i < row.length; i++) {
          if (courseNumber !== row[i].courseNumber) {
            courseNumber = row[i].courseNumber;
            courses.push({
              unitCode: row[i].unitCode,
              unitName: row[i].unitName,
              courseNumber: row[i].courseNumber,
              subjectNumber: row[i].subjectNumber,
              proGroup: row[i].proGroup,
              year: row[i].year,
              classes: row[i].classes,
              credit: row[i].credit,
              generalGroup: row[i].generalGroup,
              required: row[i].required == 0 ? "必修" : "選修",
              chineseName: row[i].chineseName,
              englishName: row[i].englishName,
              stuLimit: row[i].stuLimit,
              professor: row[i].professor,
              regular: [
                {
                  week: row[i].week,
                  session: row[i].session,
                  room: row[i].room
                }
              ],
              practice: []
            });
          } else {
            if (row[i].type == 0) {
              courses[courses.length - 1].regular.push({
                week: row[i].week,
                session: row[i].session,
                room: row[i].room
              });
            } else {
              courses[courses.length - 1].practice.push({
                week: row[i].week,
                session: row[i].session,
                room: row[i].room
              });
            }
          }
        }
      });

    await courseModel
      .getPossibleCountGeneral(impossibleSessions, user.schoolSystemId)
      .then(([row]) => {
        coursesCount = row[0].count;
      });

    return res.json({
      res: 0,
      msg: "successful",
      courses,
      coursesCount
    });
  } catch (err) {
    return res.json({
      res: -1,
      msg: "查詢資料庫錯誤"
    });
  }
};

exports.getPossiblePhysical = async (req, res, next) => {
  let user;
  let selection;
  try {
    user = req.headers.decryptedToken;
    selection = JSON.parse(AES256Helper.AES256Decrypt(req.cookies.selection));
  } catch (err) {
    return res.json({
      res: -1,
      msg: "解碼資料錯誤，請聯絡開發人員"
    });
  }

  /*查詢課程時間*/
  let impossibleSessions = [[], [], [], [], [], [], []];
  try {
    if (selection.courses.length === 0) selection.courses.push("-1");
    await courseModel
      .getCourseByCourseNumbers(selection.courses)
      .then(([row]) => {
        for (let i = 0; i < row.length; i++) {
          if (!impossibleSessions[row[i].week - 1].includes(row[i].session))
            impossibleSessions[row[i].week - 1].push(row[i].session);
        }
        for (let i = 0; i < impossibleSessions.length; i++) {
          if (impossibleSessions[i].length === 0)
            impossibleSessions[i].push(-2);
        }
      });
  } catch (err) {
    return res.json({
      res: -1,
      msg: "查詢資料庫錯誤，請聯絡開發人員"
    });
  }

  let courses = [];
  let coursesCount = 0;
  try {
    await courseModel
      .getPossiblePhysical(
        impossibleSessions,
        user.schoolSystemId,
        (req.query.pages - 1) * 10
      )
      .then(([row]) => {
        let courseNumber = "";
        for (let i = 0; i < row.length; i++) {
          if (courseNumber !== row[i].courseNumber) {
            courseNumber = row[i].courseNumber;
            courses.push({
              unitCode: row[i].unitCode,
              unitName: row[i].unitName,
              courseNumber: row[i].courseNumber,
              subjectNumber: row[i].subjectNumber,
              proGroup: row[i].proGroup,
              year: row[i].year,
              classes: row[i].classes,
              credit: row[i].credit,
              generalGroup: row[i].generalGroup,
              required: row[i].required == 0 ? "必修" : "選修",
              chineseName: row[i].chineseName,
              englishName: row[i].englishName,
              stuLimit: row[i].stuLimit,
              professor: row[i].professor,
              regular: [
                {
                  week: row[i].week,
                  session: row[i].session,
                  room: row[i].room
                }
              ],
              practice: []
            });
          } else {
            if (row[i].type == 0) {
              courses[courses.length - 1].regular.push({
                week: row[i].week,
                session: row[i].session,
                room: row[i].room
              });
            } else {
              courses[courses.length - 1].practice.push({
                week: row[i].week,
                session: row[i].session,
                room: row[i].room
              });
            }
          }
        }
      });

    await courseModel
      .getPossibleCountPhysical(impossibleSessions, user.schoolSystemId)
      .then(([row]) => {
        coursesCount = row[0].count;
      });

    return res.json({
      res: 0,
      msg: "successful",
      courses,
      coursesCount
    });
  } catch (err) {
    return res.json({
      res: -1,
      msg: "查詢資料庫錯誤"
    });
  }
};
