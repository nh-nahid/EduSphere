/**
 * seed.js
 * ───────────────────────────────────────────────────────────────────────────
 * Populates the database with realistic sample data for development/demo use.
 *
 * Usage:
 *   node seed.js          → seed everything (wipes existing data first)
 *   node seed.js --fresh  → alias for above
 *
 * What gets created:
 *   • 1  super_admin  user
 *   • 2  schools      (Green Valley Academy  +  Sunrise International)
 *   • 2  admins       (one per school)
 *   • 4  teachers     (two per school)
 *   • 12 students     (six per school, spread across classes)
 *   • 4  classes      (two per school)
 *   • 8  subjects     (four per school)
 *   • 30 attendance   records (last 15 school days for each class)
 *   • 24 grade        entries  (multiple subjects × students)
 *   • 4  assignments  (two per school)
 *   • 4  notices      (two per school)
 *   • 4  fees         (two per school)
 *   • 6  payments     (mix of paid / pending)
 *   • 6  smsLogs      (from attendance / fee events)
 *
 * All passwords are:  Password@123
 * ───────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ── Models ────────────────────────────────────────────────────────────────────
const User       = require('./models/User');
const School     = require('./models/School');
const Student    = require('./models/Student');
const Teacher    = require('./models/Teacher');
const Class      = require('./models/Class');
const Subject    = require('./models/Subject');
const Attendance = require('./models/Attendance');
const Grade      = require('./models/Grade');
const Assignment = require('./models/Assignment');
const Notice     = require('./models/Notice');
const Fee        = require('./models/Fee');
const Payment    = require('./models/Payment');
const SmsLog     = require('./models/SmsLog');

// ── Helpers ───────────────────────────────────────────────────────────────────
const hash = (pw) => bcrypt.hash(pw, 10);

/** Returns a Date N days ago from today */
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(8, 0, 0, 0);
  return d;
};

/** Returns a Date N days in the future */
const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(23, 59, 0, 0);
  return d;
};

/** Pick one element from an array randomly */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Calculate letter grade from percentage */
const letterGrade = (marks, total) => {
  const pct = (marks / total) * 100;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'A-';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
};

// ─────────────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log('✅ Connected to MongoDB\n');

  // ── Wipe existing data ──────────────────────────────────────────────────────
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    School.deleteMany({}),
    Student.deleteMany({}),
    Teacher.deleteMany({}),
    Class.deleteMany({}),
    Subject.deleteMany({}),
    Attendance.deleteMany({}),
    Grade.deleteMany({}),
    Assignment.deleteMany({}),
    Notice.deleteMany({}),
    Fee.deleteMany({}),
    Payment.deleteMany({}),
    SmsLog.deleteMany({}),
  ]);
  console.log('✅ All collections cleared\n');

  const PASSWORD = 'Password@123';

  // ══════════════════════════════════════════════════════════════════════════════
  // 1. SUPER ADMIN
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('👑 Creating super admin...');
  const superAdmin = await User.create({
    name:     'Super Admin',
    email:    'superadmin@schoolms.com',
    password: PASSWORD,
    role:     'super_admin',
    phone:    '01711000001',
  });
  console.log(`   ✅ ${superAdmin.name}  →  ${superAdmin.email}`);

  // ══════════════════════════════════════════════════════════════════════════════
  // 2. SCHOOLS
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n🏫 Creating schools...');
  const [schoolA, schoolB] = await School.insertMany([
    {
      name:      'Green Valley Academy',
      slug:      'green-valley-academy',
      address:   'House 12, Road 4, Dhanmondi, Dhaka-1205',
      phone:     '02-9112233',
      email:     'info@greenvalley.edu.bd',
      plan:      'pro',
      isActive:  true,
      createdBy: superAdmin._id,
    },
    {
      name:      'Sunrise International School',
      slug:      'sunrise-international',
      address:   'Plot 7, Block C, Bashundhara R/A, Dhaka-1229',
      phone:     '02-8812345',
      email:     'contact@sunrise.edu.bd',
      plan:      'basic',
      isActive:  true,
      createdBy: superAdmin._id,
    },
  ]);
  console.log(`   ✅ ${schoolA.name}`);
  console.log(`   ✅ ${schoolB.name}`);

  // ══════════════════════════════════════════════════════════════════════════════
  // 3. ADMIN USERS  (one per school)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n👔 Creating school admins...');
  const [adminA, adminB] = await User.insertMany([
    { name: 'Rahim Uddin',   email: 'admin@greenvalley.edu.bd',  password: await hash(PASSWORD), role: 'admin', schoolId: schoolA._id, phone: '01711100001' },
    { name: 'Nasrin Sultana',email: 'admin@sunrise.edu.bd',      password: await hash(PASSWORD), role: 'admin', schoolId: schoolB._id, phone: '01811100002' },
  ]);
  console.log(`   ✅ ${adminA.name}  →  ${adminA.email}`);
  console.log(`   ✅ ${adminB.name}  →  ${adminB.email}`);

  // ══════════════════════════════════════════════════════════════════════════════
  // 4. TEACHER USERS + TEACHER PROFILES  (two per school)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n🧑‍🏫 Creating teachers...');

  // School A teachers
  const [tuserA1, tuserA2, tuserB1, tuserB2] = await User.insertMany([
    { name: 'Kamal Hossain',  email: 'kamal@greenvalley.edu.bd',  password: await hash(PASSWORD), role: 'teacher', schoolId: schoolA._id, phone: '01711200001' },
    { name: 'Fatema Begum',   email: 'fatema@greenvalley.edu.bd', password: await hash(PASSWORD), role: 'teacher', schoolId: schoolA._id, phone: '01711200002' },
    { name: 'Arif Rahman',    email: 'arif@sunrise.edu.bd',       password: await hash(PASSWORD), role: 'teacher', schoolId: schoolB._id, phone: '01811200003' },
    { name: 'Sadia Islam',    email: 'sadia@sunrise.edu.bd',      password: await hash(PASSWORD), role: 'teacher', schoolId: schoolB._id, phone: '01811200004' },
  ]);

  const [teacherA1, teacherA2, teacherB1, teacherB2] = await Teacher.insertMany([
    { userId: tuserA1._id, schoolId: schoolA._id, qualification: 'M.Sc Mathematics',    joiningDate: daysAgo(730) },
    { userId: tuserA2._id, schoolId: schoolA._id, qualification: 'M.A English',         joiningDate: daysAgo(540) },
    { userId: tuserB1._id, schoolId: schoolB._id, qualification: 'M.Sc Physics',        joiningDate: daysAgo(400) },
    { userId: tuserB2._id, schoolId: schoolB._id, qualification: 'M.A Bengali',         joiningDate: daysAgo(300) },
  ]);
  [tuserA1, tuserA2, tuserB1, tuserB2].forEach(u => console.log(`   ✅ ${u.name}  →  ${u.email}`));

  // ══════════════════════════════════════════════════════════════════════════════
  // 5. CLASSES  (two per school)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n🏛️  Creating classes...');
  const [classA1, classA2, classB1, classB2] = await Class.insertMany([
    { name: 'Class 6', section: 'A', classTeacherId: teacherA1._id, academicYear: '2024-25', schoolId: schoolA._id },
    { name: 'Class 7', section: 'B', classTeacherId: teacherA2._id, academicYear: '2024-25', schoolId: schoolA._id },
    { name: 'Class 8', section: 'A', classTeacherId: teacherB1._id, academicYear: '2024-25', schoolId: schoolB._id },
    { name: 'Class 9', section: 'B', classTeacherId: teacherB2._id, academicYear: '2024-25', schoolId: schoolB._id },
  ]);
  [classA1, classA2, classB1, classB2].forEach(c => console.log(`   ✅ ${c.name} ${c.section}  (${c.academicYear})`));

  // ══════════════════════════════════════════════════════════════════════════════
  // 6. SUBJECTS  (four per school, linked to classes & teachers)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n📚 Creating subjects...');
  const [subA1, subA2, subA3, subA4, subB1, subB2, subB3, subB4] = await Subject.insertMany([
    { name: 'Mathematics', code: 'MATH-6A', classId: classA1._id, teacherId: teacherA1._id, schoolId: schoolA._id },
    { name: 'English',     code: 'ENG-6A',  classId: classA1._id, teacherId: teacherA2._id, schoolId: schoolA._id },
    { name: 'Mathematics', code: 'MATH-7B', classId: classA2._id, teacherId: teacherA1._id, schoolId: schoolA._id },
    { name: 'Science',     code: 'SCI-7B',  classId: classA2._id, teacherId: teacherA2._id, schoolId: schoolA._id },
    { name: 'Physics',     code: 'PHY-8A',  classId: classB1._id, teacherId: teacherB1._id, schoolId: schoolB._id },
    { name: 'Bengali',     code: 'BNG-8A',  classId: classB1._id, teacherId: teacherB2._id, schoolId: schoolB._id },
    { name: 'Chemistry',   code: 'CHM-9B',  classId: classB2._id, teacherId: teacherB1._id, schoolId: schoolB._id },
    { name: 'English',     code: 'ENG-9B',  classId: classB2._id, teacherId: teacherB2._id, schoolId: schoolB._id },
  ]);

  // Update classes with subjectIds
  await Class.findByIdAndUpdate(classA1._id, { subjectIds: [subA1._id, subA2._id] });
  await Class.findByIdAndUpdate(classA2._id, { subjectIds: [subA3._id, subA4._id] });
  await Class.findByIdAndUpdate(classB1._id, { subjectIds: [subB1._id, subB2._id] });
  await Class.findByIdAndUpdate(classB2._id, { subjectIds: [subB3._id, subB4._id] });

  // Update teachers with subjects
  await Teacher.findByIdAndUpdate(teacherA1._id, { subjects: [subA1._id, subA3._id], classIds: [classA1._id, classA2._id] });
  await Teacher.findByIdAndUpdate(teacherA2._id, { subjects: [subA2._id, subA4._id], classIds: [classA1._id, classA2._id] });
  await Teacher.findByIdAndUpdate(teacherB1._id, { subjects: [subB1._id, subB3._id], classIds: [classB1._id, classB2._id] });
  await Teacher.findByIdAndUpdate(teacherB2._id, { subjects: [subB2._id, subB4._id], classIds: [classB1._id, classB2._id] });

  console.log(`   ✅ Created 8 subjects across 4 classes`);

  // ══════════════════════════════════════════════════════════════════════════════
  // 7. STUDENT USERS + STUDENT PROFILES  (6 per school = 12 total)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n🎓 Creating students...');

  const studentSeedData = [
    // ── Green Valley Academy ────────────────────────────────────────────────
    // Class 6A
    { name: 'Abir Hassan',      email: 'abir@student.gv.bd',    phone: '01900100001', school: schoolA, cls: classA1, roll: '01', section: 'A', guardian: 'Hassan Ali',     gPhone: '01711300001', admDate: daysAgo(365) },
    { name: 'Riya Akter',       email: 'riya@student.gv.bd',    phone: '01900100002', school: schoolA, cls: classA1, roll: '02', section: 'A', guardian: 'Akter Ahmed',    gPhone: '01711300002', admDate: daysAgo(365) },
    { name: 'Tanvir Islam',     email: 'tanvir@student.gv.bd',  phone: '01900100003', school: schoolA, cls: classA1, roll: '03', section: 'A', guardian: 'Islam Miah',     gPhone: '01711300003', admDate: daysAgo(365) },
    // Class 7B
    { name: 'Nusrat Jahan',     email: 'nusrat@student.gv.bd',  phone: '01900100004', school: schoolA, cls: classA2, roll: '01', section: 'B', guardian: 'Jahan Beg',      gPhone: '01711300004', admDate: daysAgo(730) },
    { name: 'Sabbir Ahmed',     email: 'sabbir@student.gv.bd',  phone: '01900100005', school: schoolA, cls: classA2, roll: '02', section: 'B', guardian: 'Ahmed Khan',     gPhone: '01711300005', admDate: daysAgo(730) },
    { name: 'Mehzabin Chowdhury', email: 'mehzabin@student.gv.bd', phone: '01900100006', school: schoolA, cls: classA2, roll: '03', section: 'B', guardian: 'Chowdhury Sb', gPhone: '01711300006', admDate: daysAgo(730) },
    // ── Sunrise International ────────────────────────────────────────────────
    // Class 8A
    { name: 'Rafiqul Islam',    email: 'rafiq@student.sr.bd',   phone: '01800100001', school: schoolB, cls: classB1, roll: '01', section: 'A', guardian: 'Islam Uddin',    gPhone: '01811300001', admDate: daysAgo(400) },
    { name: 'Sumaiya Khatun',   email: 'sumaiya@student.sr.bd', phone: '01800100002', school: schoolB, cls: classB1, roll: '02', section: 'A', guardian: 'Khatun Bibi',    gPhone: '01811300002', admDate: daysAgo(400) },
    { name: 'Akib Hasan',       email: 'akib@student.sr.bd',    phone: '01800100003', school: schoolB, cls: classB1, roll: '03', section: 'A', guardian: 'Hasan Mia',      gPhone: '01811300003', admDate: daysAgo(400) },
    // Class 9B
    { name: 'Lamia Akter',      email: 'lamia@student.sr.bd',   phone: '01800100004', school: schoolB, cls: classB2, roll: '01', section: 'B', guardian: 'Akter Sb',       gPhone: '01811300004', admDate: daysAgo(600) },
    { name: 'Toufiq Rahman',    email: 'toufiq@student.sr.bd',  phone: '01800100005', school: schoolB, cls: classB2, roll: '02', section: 'B', guardian: 'Rahman Sb',      gPhone: '01811300005', admDate: daysAgo(600) },
    { name: 'Shahida Parvin',   email: 'shahida@student.sr.bd', phone: '01800100006', school: schoolB, cls: classB2, roll: '03', section: 'B', guardian: 'Parvin Bibi',    gPhone: '01811300006', admDate: daysAgo(600) },
  ];

  const studentUsers    = [];
  const studentProfiles = [];

  for (const s of studentSeedData) {
    const user = await User.create({
      name:     s.name,
      email:    s.email,
      password: PASSWORD,
      role:     'student',
      schoolId: s.school._id,
      phone:    s.phone,
    });
    const profile = await Student.create({
      userId:       user._id,
      schoolId:     s.school._id,
      classId:      s.cls._id,
      roll:         s.roll,
      section:      s.section,
      guardianName: s.guardian,
      guardianPhone:s.gPhone,
      admissionDate:s.admDate,
    });
    studentUsers.push(user);
    studentProfiles.push(profile);
    console.log(`   ✅ ${user.name}  →  ${user.email}`);
  }

  // Update classes with their student IDs
  const studentsA1 = studentProfiles.filter(s => s.classId.toString() === classA1._id.toString());
  const studentsA2 = studentProfiles.filter(s => s.classId.toString() === classA2._id.toString());
  const studentsB1 = studentProfiles.filter(s => s.classId.toString() === classB1._id.toString());
  const studentsB2 = studentProfiles.filter(s => s.classId.toString() === classB2._id.toString());

  await Class.findByIdAndUpdate(classA1._id, { $push: { studentIds: { $each: studentsA1.map(s => s._id) } } });
  await Class.findByIdAndUpdate(classA2._id, { $push: { studentIds: { $each: studentsA2.map(s => s._id) } } });
  await Class.findByIdAndUpdate(classB1._id, { $push: { studentIds: { $each: studentsB1.map(s => s._id) } } });
  await Class.findByIdAndUpdate(classB2._id, { $push: { studentIds: { $each: studentsB2.map(s => s._id) } } });

  // ══════════════════════════════════════════════════════════════════════════════
  // 8. ATTENDANCE  (last 15 school days for each of the 4 classes)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n📋 Creating attendance records...');
  const statuses = ['present', 'present', 'present', 'present', 'absent', 'present', 'present', 'late', 'present', 'present'];

  const classGroups = [
    { cls: classA1, students: studentsA1, teacher: teacherA1, school: schoolA },
    { cls: classA2, students: studentsA2, teacher: teacherA2, school: schoolA },
    { cls: classB1, students: studentsB1, teacher: teacherB1, school: schoolB },
    { cls: classB2, students: studentsB2, teacher: teacherB2, school: schoolB },
  ];

  let attendanceCount = 0;
  for (const { cls, students, teacher, school } of classGroups) {
    for (let day = 1; day <= 15; day++) {
      const date = daysAgo(day);
      // Skip weekends (0=Sun, 6=Sat)
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      await Attendance.create({
        classId:  cls._id,
        date,
        records:  students.map(st => ({ studentId: st._id, status: pick(statuses) })),
        takenBy:  teacher._id,
        schoolId: school._id,
      });
      attendanceCount++;
    }
  }
  console.log(`   ✅ Created ${attendanceCount} attendance records`);

  // ══════════════════════════════════════════════════════════════════════════════
  // 9. GRADES  (first_term + second_term for each student × 2 subjects)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n📊 Creating grade records...');

  const gradeEntries = [
    // School A — Class 6A students × subA1 (Math) + subA2 (English)
    ...studentsA1.flatMap(st => [
      { studentId: st._id, subjectId: subA1._id, examType: 'first_term',  marks: 72 + Math.floor(Math.random()*25), totalMarks: 100, schoolId: schoolA._id },
      { studentId: st._id, subjectId: subA1._id, examType: 'second_term', marks: 68 + Math.floor(Math.random()*28), totalMarks: 100, schoolId: schoolA._id },
      { studentId: st._id, subjectId: subA2._id, examType: 'first_term',  marks: 60 + Math.floor(Math.random()*35), totalMarks: 100, schoolId: schoolA._id },
      { studentId: st._id, subjectId: subA2._id, examType: 'second_term', marks: 65 + Math.floor(Math.random()*30), totalMarks: 100, schoolId: schoolA._id },
    ]),
    // School A — Class 7B students × subA3 (Math) + subA4 (Science)
    ...studentsA2.flatMap(st => [
      { studentId: st._id, subjectId: subA3._id, examType: 'first_term',  marks: 55 + Math.floor(Math.random()*40), totalMarks: 100, schoolId: schoolA._id },
      { studentId: st._id, subjectId: subA3._id, examType: 'second_term', marks: 60 + Math.floor(Math.random()*35), totalMarks: 100, schoolId: schoolA._id },
      { studentId: st._id, subjectId: subA4._id, examType: 'first_term',  marks: 70 + Math.floor(Math.random()*25), totalMarks: 100, schoolId: schoolA._id },
      { studentId: st._id, subjectId: subA4._id, examType: 'second_term', marks: 75 + Math.floor(Math.random()*20), totalMarks: 100, schoolId: schoolA._id },
    ]),
    // School B — Class 8A students × subB1 (Physics) + subB2 (Bengali)
    ...studentsB1.flatMap(st => [
      { studentId: st._id, subjectId: subB1._id, examType: 'first_term',  marks: 50 + Math.floor(Math.random()*45), totalMarks: 100, schoolId: schoolB._id },
      { studentId: st._id, subjectId: subB1._id, examType: 'second_term', marks: 55 + Math.floor(Math.random()*40), totalMarks: 100, schoolId: schoolB._id },
      { studentId: st._id, subjectId: subB2._id, examType: 'first_term',  marks: 65 + Math.floor(Math.random()*30), totalMarks: 100, schoolId: schoolB._id },
      { studentId: st._id, subjectId: subB2._id, examType: 'second_term', marks: 70 + Math.floor(Math.random()*25), totalMarks: 100, schoolId: schoolB._id },
    ]),
    // School B — Class 9B students × subB3 (Chemistry) + subB4 (English)
    ...studentsB2.flatMap(st => [
      { studentId: st._id, subjectId: subB3._id, examType: 'first_term',  marks: 60 + Math.floor(Math.random()*35), totalMarks: 100, schoolId: schoolB._id },
      { studentId: st._id, subjectId: subB3._id, examType: 'second_term', marks: 58 + Math.floor(Math.random()*38), totalMarks: 100, schoolId: schoolB._id },
      { studentId: st._id, subjectId: subB4._id, examType: 'first_term',  marks: 72 + Math.floor(Math.random()*25), totalMarks: 100, schoolId: schoolB._id },
      { studentId: st._id, subjectId: subB4._id, examType: 'second_term', marks: 68 + Math.floor(Math.random()*28), totalMarks: 100, schoolId: schoolB._id },
    ]),
  ].map(g => ({ ...g, grade: letterGrade(g.marks, g.totalMarks) }));

  await Grade.insertMany(gradeEntries);
  console.log(`   ✅ Created ${gradeEntries.length} grade entries`);

  // ══════════════════════════════════════════════════════════════════════════════
  // 10. ASSIGNMENTS  (two per school)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n📝 Creating assignments...');
  await Assignment.insertMany([
    {
      title:       'Chapter 3 Exercise — Algebra',
      description: 'Solve all exercises from Chapter 3: Linear Equations and Inequalities. Show full working for each answer.',
      subjectId:   subA1._id,
      classId:     classA1._id,
      teacherId:   teacherA1._id,
      dueDate:     daysFromNow(5),
      schoolId:    schoolA._id,
    },
    {
      title:       'Essay — My Favourite Season',
      description: 'Write a 300-word descriptive essay about your favourite season. Use vivid adjectives and examples from personal experience.',
      subjectId:   subA2._id,
      classId:     classA1._id,
      teacherId:   teacherA2._id,
      dueDate:     daysFromNow(3),
      schoolId:    schoolA._id,
    },
    {
      title:       'Lab Report — Light Refraction',
      description: 'Document your findings from the prism experiment. Include hypothesis, method, observations (with diagram), and conclusion.',
      subjectId:   subB1._id,
      classId:     classB1._id,
      teacherId:   teacherB1._id,
      dueDate:     daysFromNow(7),
      schoolId:    schoolB._id,
    },
    {
      title:       'প্রবন্ধ — আমার প্রিয় উৎসব',
      description: 'বাংলায় ৩০০ শব্দের একটি প্রবন্ধ লিখুন তোমার প্রিয় উৎসব সম্পর্কে।',
      subjectId:   subB2._id,
      classId:     classB1._id,
      teacherId:   teacherB2._id,
      dueDate:     daysFromNow(4),
      schoolId:    schoolB._id,
    },
  ]);
  console.log(`   ✅ Created 4 assignments`);

  // ══════════════════════════════════════════════════════════════════════════════
  // 11. NOTICES  (two per school)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n📢 Creating notices...');
  await Notice.insertMany([
    {
      title:       'Annual Sports Day — 15th September 2025',
      content:     'All students and teachers are cordially invited to the Annual Sports Day on 15th September 2025 at 9:00 AM on the school field. Students are requested to wear their house colour t-shirts. Participation in at least one event is compulsory.',
      targetRole:  'all',
      createdBy:   adminA._id,
      schoolId:    schoolA._id,
      publishedAt: daysAgo(2),
    },
    {
      title:       'Parent-Teacher Meeting — 30th August 2025',
      content:     'A Parent-Teacher meeting will be held on 30th August 2025 at 10:00 AM in the school auditorium. All guardians are requested to attend and collect their ward\'s first-term result slip. Please bring your student\'s ID card.',
      targetRole:  'student',
      createdBy:   adminA._id,
      schoolId:    schoolA._id,
      publishedAt: daysAgo(1),
    },
    {
      title:       'Library Timings Extended',
      content:     'The school library will now remain open until 5:00 PM on all weekdays to support students preparing for upcoming examinations. Students must carry their library card to access the facility.',
      targetRole:  'all',
      createdBy:   adminB._id,
      schoolId:    schoolB._id,
      publishedAt: daysAgo(3),
    },
    {
      title:       'Staff Meeting — Curriculum Review',
      content:     'All teaching staff are requested to attend a curriculum review meeting on Friday at 2:00 PM in the conference room. Please bring the completed syllabus progress report for your subject.',
      targetRole:  'teacher',
      createdBy:   adminB._id,
      schoolId:    schoolB._id,
      publishedAt: daysAgo(1),
    },
  ]);
  console.log(`   ✅ Created 4 notices`);

  // ══════════════════════════════════════════════════════════════════════════════
  // 12. FEES  (two per school)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n💳 Creating fees...');
  const [feeA1, feeA2, feeB1, feeB2] = await Fee.insertMany([
    { title: 'Monthly Tuition Fee — August',  classId: classA1._id, amount: 2500, dueDate: daysFromNow(5),  academicYear: '2024-25', type: 'tuition',   schoolId: schoolA._id },
    { title: 'Annual Exam Fee',               classId: classA2._id, amount: 1500, dueDate: daysFromNow(15), academicYear: '2024-25', type: 'exam',      schoolId: schoolA._id },
    { title: 'Monthly Tuition Fee — August',  classId: classB1._id, amount: 3000, dueDate: daysFromNow(5),  academicYear: '2024-25', type: 'tuition',   schoolId: schoolB._id },
    { title: 'Transport Fee — Q3',            classId: classB2._id, amount: 1200, dueDate: daysAgo(2),      academicYear: '2024-25', type: 'transport', schoolId: schoolB._id },
  ]);
  console.log(`   ✅ Created 4 fee schedules`);

  // ══════════════════════════════════════════════════════════════════════════════
  // 13. PAYMENTS  (mix of paid & pending)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n💰 Creating payment records...');

  const txn = (n) => `SMS-${Date.now() + n}-DEMO${n.toString().padStart(4,'0')}`;

  const payments = await Payment.insertMany([
    // Paid
    { studentId: studentsA1[0]._id, feeId: feeA1._id, amount: 2500, gatewayTxnId: txn(1), status: 'paid',    paidAt: daysAgo(3),  schoolId: schoolA._id },
    { studentId: studentsA1[1]._id, feeId: feeA1._id, amount: 2500, gatewayTxnId: txn(2), status: 'paid',    paidAt: daysAgo(5),  schoolId: schoolA._id },
    { studentId: studentsA2[0]._id, feeId: feeA2._id, amount: 1500, gatewayTxnId: txn(3), status: 'paid',    paidAt: daysAgo(10), schoolId: schoolA._id },
    { studentId: studentsB1[0]._id, feeId: feeB1._id, amount: 3000, gatewayTxnId: txn(4), status: 'paid',    paidAt: daysAgo(2),  schoolId: schoolB._id },
    // Pending
    { studentId: studentsA1[2]._id, feeId: feeA1._id, amount: 2500, gatewayTxnId: txn(5), status: 'pending',                      schoolId: schoolA._id },
    { studentId: studentsB2[0]._id, feeId: feeB2._id, amount: 1200, gatewayTxnId: txn(6), status: 'pending',                      schoolId: schoolB._id },
  ]);
  console.log(`   ✅ Created ${payments.length} payments (4 paid · 2 pending)`);

  // ══════════════════════════════════════════════════════════════════════════════
  // 14. SMS LOGS
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n📱 Creating SMS log records...');
  await SmsLog.insertMany([
    { recipient: '01711300001', message: 'Your child Abir Hassan was absent on ' + daysAgo(3).toDateString() + '.', event: 'absence',  status: 'sent',   studentId: studentsA1[0]._id, schoolId: schoolA._id, sentAt: daysAgo(3) },
    { recipient: '01711300002', message: 'Your child Riya Akter was absent on '   + daysAgo(5).toDateString() + '.', event: 'absence',  status: 'sent',   studentId: studentsA1[1]._id, schoolId: schoolA._id, sentAt: daysAgo(5) },
    { recipient: '01711300001', message: 'Fee payment of BDT 2500 received successfully via SSLCommerz.',            event: 'fee_paid', status: 'sent',   studentId: studentsA1[0]._id, schoolId: schoolA._id, sentAt: daysAgo(3) },
    { recipient: '01711300002', message: 'Fee payment of BDT 2500 received successfully via SSLCommerz.',            event: 'fee_paid', status: 'sent',   studentId: studentsA1[1]._id, schoolId: schoolA._id, sentAt: daysAgo(5) },
    { recipient: '01811300001', message: 'Fee payment of BDT 3000 received successfully via SSLCommerz.',            event: 'fee_paid', status: 'sent',   studentId: studentsB1[0]._id, schoolId: schoolB._id, sentAt: daysAgo(2) },
    { recipient: '01811300003', message: 'Your child Akib Hasan was absent on '   + daysAgo(2).toDateString() + '.', event: 'absence',  status: 'failed', studentId: studentsB1[2]._id, schoolId: schoolB._id, sentAt: daysAgo(2) },
  ]);
  console.log(`   ✅ Created 6 SMS log entries`);

  // ══════════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(60));
  console.log('🌱  DATABASE SEEDED SUCCESSFULLY');
  console.log('═'.repeat(60));
  console.log('\n📌  Login credentials (all passwords: Password@123)\n');
  console.log('  ROLE          EMAIL                              SCHOOL');
  console.log('  ─────────────────────────────────────────────────────────');
  console.log('  super_admin   superadmin@schoolms.com            (global)');
  console.log('  admin         admin@greenvalley.edu.bd           Green Valley Academy');
  console.log('  admin         admin@sunrise.edu.bd               Sunrise International');
  console.log('  teacher       kamal@greenvalley.edu.bd           Green Valley Academy');
  console.log('  teacher       fatema@greenvalley.edu.bd          Green Valley Academy');
  console.log('  teacher       arif@sunrise.edu.bd                Sunrise International');
  console.log('  teacher       sadia@sunrise.edu.bd               Sunrise International');
  console.log('  student       abir@student.gv.bd                 Green Valley Academy');
  console.log('  student       riya@student.gv.bd                 Green Valley Academy');
  console.log('  student       rafiq@student.sr.bd                Sunrise International');
  console.log('  student       lamia@student.sr.bd                Sunrise International');
  console.log('\n📊  Data summary:');
  console.log(`  • 2 schools  • 2 admins  • 4 teachers  • 12 students`);
  console.log(`  • 4 classes  • 8 subjects  • ${attendanceCount} attendance records`);
  console.log(`  • ${gradeEntries.length} grade entries  • 4 assignments  • 4 notices`);
  console.log(`  • 4 fees  • 6 payments (4 paid, 2 pending)  • 6 SMS logs`);
  console.log('\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('\n❌ Seeding failed:', err.message);
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});
