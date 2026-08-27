const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const errorHandler = require('./middlewares/common/errorHandler');

const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const schoolRouter = require('./routers/schoolRouter');
const studentRouter = require('./routers/studentRouter');
const teacherRouter = require('./routers/teacherRouter');
const classRouter = require('./routers/classRouter');
const subjectRouter = require('./routers/subjectRouter');
const attendanceRouter = require('./routers/attendanceRouter');
const gradeRouter = require('./routers/gradeRouter');
const assignmentRouter = require('./routers/assignmentRouter');
const submissionRouter = require('./routers/submissionRouter');
const noticeRouter = require('./routers/noticeRouter');
const feeRouter = require('./routers/feeRouter');
const paymentRouter = require('./routers/paymentRouter');
const smsRouter = require('./routers/smsRouter');
const adminRouter = require('./routers/adminRouter');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/schools', schoolRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/teachers', teacherRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/subjects', subjectRouter);
app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/grades', gradeRouter);
app.use('/api/v1/assignments', assignmentRouter);
app.use('/api/v1/submissions', submissionRouter);
app.use('/api/v1/notices', noticeRouter);
app.use('/api/v1/fees', feeRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/sms', smsRouter);
app.use('/api/v1/admin', adminRouter);

app.use(errorHandler);

module.exports = app;