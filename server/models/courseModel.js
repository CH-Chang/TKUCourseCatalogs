const dbPool = require("../utils/database");

const Course = class Course {
  constructor(
    unitCode,
    unitName,
    courseNumber,
    subjectNumber,
    proGroup,
    semester,
    partGroup,
    year,
    classes,
    credit,
    generalGroup,
    required,
    chineseName,
    englishName,
    stuLimit,
    professor,
    type,
    week,
    session,
    room
  ) {
    this.unitCode = unitCode;
    this.unitName = unitName;
    this.courseNumber = courseNumber;
    this.subjectNumber = subjectNumber;
    this.porGroup = proGroup;
    this.semester = semester;
    this.partGroup = partGroup;
    this.year = year;
    this.classes = classes;
    this.credit = credit;
    this.generalGroup = generalGroup;
    this.required = required;
    this.chineseName = chineseName;
    this.englishName = englishName;
    this.stuLimit = stuLimit;
    this.professor = professor;
    this.type = type;
    this.week = week;
    this.session = session;
    this.room = room;
  }

  static getCourseByUnitCode(unitCode, start) {
    return dbPool.execute(
      `select U.code as unitCode,U.name as unitName,  C.courseNumber, C.subjectNumber, C.proGroup, C.semesterOrder, C.partGroup,C.grade as year, C.classes, C.credit, C.generalGroup,C.required, C.chineseName, C.englishName, C.stuLimit,   P.name as professor, CT.type, CT.week, CT.session, R.room 
      from course as C 
      left join teach as T on T.courseId=C.id 
      left join unit as U on U.id=C.unitId
      left join professor as P on T.professorId=P.id
      left join coursetime as CT on CT.courseId=C.id
      left join room as R on CT.roomId=R.id
      where C.courseNumber in (select courseNumber from (select course.courseNumber from course left join unit on course.unitId=unit.id where unit.code='${unitCode}' group by course.courseNumber order by course.courseNumber limit ${start}, 10) as T)
      order by C.grade, C.courseNumber, CT.type;`
    );
  }

  static getCourseCountByUnitCode(unitCode) {
    return dbPool.execute(
      `select count(id) as count from (SELECT C.id FROM course as C left join unit as U on C.unitId=U.id where U.code='${unitCode}' group by C.courseNumber) as T;`
    );
  }

  static getCourseByCourseNumbers(courseNumbers) {
    return dbPool.execute(
      `select U.code as unitCode,U.name as unitName,  C.courseNumber, C.subjectNumber, C.proGroup, C.semesterOrder, C.partGroup,C.grade as year, C.classes, C.credit, C.generalGroup,C.required, C.chineseName, C.englishName, C.stuLimit,   P.name as professor, CT.type, CT.week, CT.session, R.room from course as C, unit as U, teach as T, professor as P, coursetime as CT, room as R where C.unitId=U.id and T.courseId=C.id and T.professorId=P.id and CT.courseId=C.id and CT.roomId=R.id and C.courseNumber in ${"(" +
        courseNumbers.toString() +
        ")"} order by C.grade, C.courseNumber, CT.type`
    );
  }

  static getPossibleGeneral(impossibleSessions, schoolSystem) {
    return dbPool.execute(
      `select U.code as unitCode,U.name as unitName,  C.courseNumber, C.subjectNumber, C.proGroup, C.semesterOrder, C.partGroup,C.grade as year, C.classes, C.credit, C.generalGroup,C.required, C.chineseName, C.englishName, C.stuLimit, P.name as professor, CT.type, CT.week, CT.session, R.room
      from coursetime as CT, course as C, unit as U, teach as T, professor as P, room as R
      where 
      CT.courseId not in (SELECT courseId FROM tku.coursetime where week=1 and session in ${"(" +
        impossibleSessions[0].toString() +
        ")"} group by courseId)
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=2 and session in ${"(" +
        impossibleSessions[1].toString() +
        ")"} group by courseId) 
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=3 and session in ${"(" +
        impossibleSessions[2].toString() +
        ")"} group by courseId)
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=4 and session in ${"(" +
        impossibleSessions[3].toString() +
        ")"} group by courseId)
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=5 and session in ${"(" +
        impossibleSessions[4].toString() +
        ")"} group by courseId)
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=6 and session in ${"(" +
        impossibleSessions[5].toString() +
        ")"} group by courseId)
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=7 and session in ${"(" +
        impossibleSessions[6].toString() +
        ")"} group by courseId)
      and CT.courseId=C.id and C.unitId=U.id and T.courseId=C.id and T.professorId=P.id and CT.roomId=R.id
      and U.category=9 and U.schoolsystem=${schoolSystem}
      order by C.grade, C.courseNumber, CT.type;`
    );
  }
  static getPossiblePhysical(impossibleSessions, schoolSystem) {
    return dbPool.execute(
      `select U.code as unitCode,U.name as unitName,  C.courseNumber, C.subjectNumber, C.proGroup, C.semesterOrder, C.partGroup,C.grade as year, C.classes, C.credit, C.generalGroup,C.required, C.chineseName, C.englishName, C.stuLimit, P.name as professor, CT.type, CT.week, CT.session, R.room
      from coursetime as CT, course as C, unit as U, teach as T, professor as P, room as R
      where 
      CT.courseId not in (SELECT courseId FROM tku.coursetime where week=1 and session in ${"(" +
        impossibleSessions[0].toString() +
        ")"} group by courseId)
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=2 and session in ${"(" +
        impossibleSessions[1].toString() +
        ")"} group by courseId) 
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=3 and session in ${"(" +
        impossibleSessions[2].toString() +
        ")"} group by courseId)
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=4 and session in ${"(" +
        impossibleSessions[3].toString() +
        ")"} group by courseId)
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=5 and session in ${"(" +
        impossibleSessions[4].toString() +
        ")"} group by courseId)
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=6 and session in ${"(" +
        impossibleSessions[5].toString() +
        ")"} group by courseId)
      and CT.courseId not in (SELECT courseId FROM tku.coursetime where week=7 and session in ${"(" +
        impossibleSessions[6].toString() +
        ")"} group by courseId)
      and CT.courseId=C.id and C.unitId=U.id and T.courseId=C.id and T.professorId=P.id and CT.roomId=R.id
      and U.category=12 and U.schoolsystem=${schoolSystem}
      order by C.grade, C.courseNumber, CT.type;`
    );
  }
  static getPossibleInUnit(impossibleSessions, schoolSystem, unit, start) {
    return dbPool.execute(
      `select U.code as unitCode,U.name as unitName,  C.courseNumber, C.subjectNumber, C.proGroup, C.semesterOrder, C.partGroup,C.grade as year, C.classes, C.credit, C.generalGroup,C.required, C.chineseName, C.englishName, C.stuLimit, P.name as professor, CT.type, CT.week, CT.session, R.room
      from course as C
      left join coursetime as CT on CT.courseId=C.id
      left join unit as U on C.unitId=U.id
      left join teach as T on T.courseId=C.id
      left join professor as P on T.professorId=P.id
      left join room as R on CT.roomId=R.id
      where C.courseNumber in 
        (select courseNumber from 
          (
          select C1.courseNumber 
          from course as C1
          left join coursetime as CT1 on CT1.courseId = C1.id
          left join unit as U1 on C1.unitId=U1.id
          left join teach as T1 on T1.courseId=C1.id
          left join professor as P1 on T1.professorId=P1.id
          left join room as R1 on CT1.roomId=R1.id
          where CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=1 and session in ${"(" +
            impossibleSessions[0].toString() +
            ")"} group by courseId)
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=2 and session in ${"(" +
            impossibleSessions[1].toString() +
            ")"} group by courseId) 
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=3 and session in ${"(" +
            impossibleSessions[2].toString() +
            ")"} group by courseId)
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=4 and session in ${"(" +
            impossibleSessions[3].toString() +
            ")"} group by courseId)
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=5 and session in ${"(" +
            impossibleSessions[4].toString() +
            ")"} group by courseId)
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=6 and session in ${"(" +
            impossibleSessions[5].toString() +
            ")"} group by courseId)
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=7 and session in ${"(" +
            impossibleSessions[6].toString() +
            ")"} group by courseId)
	
		  and U1.id=${unit} and U1.schoolsystem=${schoolSystem}
          group by C1.courseNumber
          order by C1.grade, C1.courseNumber, CT1.type
          limit ${start}, 10
          ) 
        as T);`
    );
  }

  static getPossibleCountInUnit(impossibleSessions, schoolSystem, unit) {
    return dbPool.execute(`select count(courseNumber) as count from 
    (
    select C1.courseNumber 
    from course as C1
    left join coursetime as CT1 on CT1.courseId = C1.id
    left join unit as U1 on C1.unitId=U1.id
    left join teach as T1 on T1.courseId=C1.id
    left join professor as P1 on T1.professorId=P1.id
    left join room as R1 on CT1.roomId=R1.id
    where CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=1 and session in ${"(" +
      impossibleSessions[0].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=2 and session in ${"(" +
      impossibleSessions[1].toString() +
      ")"} group by courseId) 
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=3 and session in ${"(" +
      impossibleSessions[2].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=4 and session in ${"(" +
      impossibleSessions[3].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=5 and session in ${"(" +
      impossibleSessions[4].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=6 and session in ${"(" +
      impossibleSessions[5].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=7 and session in ${"(" +
      impossibleSessions[6].toString() +
      ")"} group by courseId)

and U1.id=${unit} and U1.schoolsystem=${schoolSystem}
    group by C1.courseNumber
    order by C1.grade, C1.courseNumber, CT1.type
    ) 
  as T;`);
  }

  static getPossibleOutUnit(impossibleSessions, schoolSystem, unit, start) {
    return dbPool.execute(
      `select U.code as unitCode,U.name as unitName,  C.courseNumber, C.subjectNumber, C.proGroup, C.semesterOrder, C.partGroup,C.grade as year, C.classes, C.credit, C.generalGroup,C.required, C.chineseName, C.englishName, C.stuLimit, P.name as professor, CT.type, CT.week, CT.session, R.room
      from course as C
      left join coursetime as CT on CT.courseId=C.id
      left join unit as U on C.unitId=U.id
      left join teach as T on T.courseId=C.id
      left join professor as P on T.professorId=P.id
      left join room as R on CT.roomId=R.id
      where C.courseNumber in 
        (select courseNumber from 
          (
          select C1.courseNumber 
          from course as C1
          left join coursetime as CT1 on CT1.courseId = C1.id
          left join unit as U1 on C1.unitId=U1.id
          left join teach as T1 on T1.courseId=C1.id
          left join professor as P1 on T1.professorId=P1.id
          left join room as R1 on CT1.roomId=R1.id
          where CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=1 and session in ${"(" +
            impossibleSessions[0].toString() +
            ")"} group by courseId)
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=2 and session in ${"(" +
            impossibleSessions[1].toString() +
            ")"} group by courseId) 
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=3 and session in ${"(" +
            impossibleSessions[2].toString() +
            ")"} group by courseId)
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=4 and session in ${"(" +
            impossibleSessions[3].toString() +
            ")"} group by courseId)
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=5 and session in ${"(" +
            impossibleSessions[4].toString() +
            ")"} group by courseId)
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=6 and session in ${"(" +
            impossibleSessions[5].toString() +
            ")"} group by courseId)
          and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=7 and session in ${"(" +
            impossibleSessions[6].toString() +
            ")"} group by courseId)
	
		  and U1.id!=${unit} and U1.schoolsystem=${schoolSystem} and U1.category!=12 and U1.category!=9 and U1.category!=11
          group by C1.courseNumber
          order by C1.grade, C1.courseNumber, CT1.type
          limit ${start}, 10
          ) 
        as T);`
    );
  }
  static getPossibleCountOutUnit(impossibleSessions, schoolSystem, unit) {
    return dbPool.execute(`select count(courseNumber) as count from 
    (
    select C1.courseNumber 
    from course as C1
    left join coursetime as CT1 on CT1.courseId = C1.id
    left join unit as U1 on C1.unitId=U1.id
    left join teach as T1 on T1.courseId=C1.id
    left join professor as P1 on T1.professorId=P1.id
    left join room as R1 on CT1.roomId=R1.id
    where CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=1 and session in ${"(" +
      impossibleSessions[0].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=2 and session in ${"(" +
      impossibleSessions[1].toString() +
      ")"} group by courseId) 
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=3 and session in ${"(" +
      impossibleSessions[2].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=4 and session in ${"(" +
      impossibleSessions[3].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=5 and session in ${"(" +
      impossibleSessions[4].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=6 and session in ${"(" +
      impossibleSessions[5].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=7 and session in ${"(" +
      impossibleSessions[6].toString() +
      ")"} group by courseId)

and U1.id!=${unit} and U1.schoolsystem=${schoolSystem} and U1.category!=12 and U1.category!=9 and U1.category!=11
    group by C1.courseNumber
    order by C1.grade, C1.courseNumber, CT1.type
    ) 
  as T;`);
  }

  static getPossibleGeneral(impossibleSessions, schoolSystem, start) {
    return dbPool.execute(`select U.code as unitCode,U.name as unitName,  C.courseNumber, C.subjectNumber, C.proGroup, C.semesterOrder, C.partGroup,C.grade as year, C.classes, C.credit, C.generalGroup,C.required, C.chineseName, C.englishName, C.stuLimit, P.name as professor, CT.type, CT.week, CT.session, R.room
    from course as C
    left join coursetime as CT on CT.courseId=C.id
    left join unit as U on C.unitId=U.id
    left join teach as T on T.courseId=C.id
    left join professor as P on T.professorId=P.id
    left join room as R on CT.roomId=R.id
    where C.courseNumber in 
      (select courseNumber from 
        (
        select C1.courseNumber 
        from course as C1
        left join coursetime as CT1 on CT1.courseId = C1.id
        left join unit as U1 on C1.unitId=U1.id
        left join teach as T1 on T1.courseId=C1.id
        left join professor as P1 on T1.professorId=P1.id
        left join room as R1 on CT1.roomId=R1.id
        where CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=1 and session in ${"(" +
          impossibleSessions[0].toString() +
          ")"} group by courseId)
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=2 and session in ${"(" +
          impossibleSessions[1].toString() +
          ")"} group by courseId) 
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=3 and session in ${"(" +
          impossibleSessions[2].toString() +
          ")"} group by courseId)
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=4 and session in ${"(" +
          impossibleSessions[3].toString() +
          ")"} group by courseId)
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=5 and session in ${"(" +
          impossibleSessions[4].toString() +
          ")"} group by courseId)
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=6 and session in ${"(" +
          impossibleSessions[5].toString() +
          ")"} group by courseId)
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=7 and session in ${"(" +
          impossibleSessions[6].toString() +
          ")"} group by courseId)

    and U1.category=9 and U1.schoolsystem=${schoolSystem}
        group by C1.courseNumber
        order by C1.grade, C1.courseNumber, CT1.type
        limit ${start}, 10
        ) 
      as T);`);
  }

  static getPossibleCountGeneral(impossibleSessions, schoolSystem) {
    return dbPool.execute(`select count(courseNumber) as count from 
    (
    select C1.courseNumber 
    from course as C1
    left join coursetime as CT1 on CT1.courseId = C1.id
    left join unit as U1 on C1.unitId=U1.id
    left join teach as T1 on T1.courseId=C1.id
    left join professor as P1 on T1.professorId=P1.id
    left join room as R1 on CT1.roomId=R1.id
    where CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=1 and session in ${"(" +
      impossibleSessions[0].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=2 and session in ${"(" +
      impossibleSessions[1].toString() +
      ")"} group by courseId) 
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=3 and session in ${"(" +
      impossibleSessions[2].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=4 and session in ${"(" +
      impossibleSessions[3].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=5 and session in ${"(" +
      impossibleSessions[4].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=6 and session in ${"(" +
      impossibleSessions[5].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=7 and session in ${"(" +
      impossibleSessions[6].toString() +
      ")"} group by courseId)

and U1.category=9 and U1.schoolsystem=${schoolSystem}
    group by C1.courseNumber
    order by C1.grade, C1.courseNumber, CT1.type
    ) 
  as T;`);
  }

  static getPossiblePhysical(impossibleSessions, schoolSystem, start) {
    return dbPool.execute(`select U.code as unitCode,U.name as unitName,  C.courseNumber, C.subjectNumber, C.proGroup, C.semesterOrder, C.partGroup,C.grade as year, C.classes, C.credit, C.generalGroup,C.required, C.chineseName, C.englishName, C.stuLimit, P.name as professor, CT.type, CT.week, CT.session, R.room
    from course as C
    left join coursetime as CT on CT.courseId=C.id
    left join unit as U on C.unitId=U.id
    left join teach as T on T.courseId=C.id
    left join professor as P on T.professorId=P.id
    left join room as R on CT.roomId=R.id
    where C.courseNumber in 
      (select courseNumber from 
        (
        select C1.courseNumber 
        from course as C1
        left join coursetime as CT1 on CT1.courseId = C1.id
        left join unit as U1 on C1.unitId=U1.id
        left join teach as T1 on T1.courseId=C1.id
        left join professor as P1 on T1.professorId=P1.id
        left join room as R1 on CT1.roomId=R1.id
        where CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=1 and session in ${"(" +
          impossibleSessions[0].toString() +
          ")"} group by courseId)
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=2 and session in ${"(" +
          impossibleSessions[1].toString() +
          ")"} group by courseId) 
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=3 and session in ${"(" +
          impossibleSessions[2].toString() +
          ")"} group by courseId)
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=4 and session in ${"(" +
          impossibleSessions[3].toString() +
          ")"} group by courseId)
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=5 and session in ${"(" +
          impossibleSessions[4].toString() +
          ")"} group by courseId)
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=6 and session in ${"(" +
          impossibleSessions[5].toString() +
          ")"} group by courseId)
        and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=7 and session in ${"(" +
          impossibleSessions[6].toString() +
          ")"} group by courseId)

    and U1.category=12 and U1.schoolsystem=${schoolSystem}
        group by C1.courseNumber
        order by C1.grade, C1.courseNumber, CT1.type
        limit ${start}, 10
        ) 
      as T);`);
  }

  static getPossibleCountPhysical(impossibleSessions, schoolSystem) {
    return dbPool.execute(`select count(courseNumber) as count from 
    (
    select C1.courseNumber 
    from course as C1
    left join coursetime as CT1 on CT1.courseId = C1.id
    left join unit as U1 on C1.unitId=U1.id
    left join teach as T1 on T1.courseId=C1.id
    left join professor as P1 on T1.professorId=P1.id
    left join room as R1 on CT1.roomId=R1.id
    where CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=1 and session in ${"(" +
      impossibleSessions[0].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=2 and session in ${"(" +
      impossibleSessions[1].toString() +
      ")"} group by courseId) 
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=3 and session in ${"(" +
      impossibleSessions[2].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=4 and session in ${"(" +
      impossibleSessions[3].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=5 and session in ${"(" +
      impossibleSessions[4].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=6 and session in ${"(" +
      impossibleSessions[5].toString() +
      ")"} group by courseId)
    and CT1.courseId not in (SELECT courseId FROM tku.coursetime where week=7 and session in ${"(" +
      impossibleSessions[6].toString() +
      ")"} group by courseId)

and U1.category=12 and U1.schoolsystem=${schoolSystem}
    group by C1.courseNumber
    order by C1.grade, C1.courseNumber, CT1.type
    ) 
  as T;`);
  }
};

module.exports = Course;
