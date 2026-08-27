const fs = require('fs');
const path = require('path');

const baseDir = 'f:\\school_management_system\\frontend';
const write = (file, content) => {
  const p = path.join(baseDir, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trim() + '\n');
};

const components = {
  'features/students/components/StudentTable.tsx': `import React from 'react'; export const StudentTable = ({data}: any) => <div>Table</div>;`,
  'features/students/components/StudentForm.tsx': `import React from 'react'; export const StudentForm = () => <form>Form</form>;`,
  'features/students/components/StudentCard.tsx': `import React from 'react'; export const StudentCard = ({student}: any) => <div>Card</div>;`,
  'features/teachers/components/TeacherTable.tsx': `import React from 'react'; export const TeacherTable = ({data}: any) => <div>Table</div>;`,
  'features/teachers/components/TeacherForm.tsx': `import React from 'react'; export const TeacherForm = () => <form>Form</form>;`,
  'features/classes/components/ClassTable.tsx': `import React from 'react'; export const ClassTable = ({data}: any) => <div>Table</div>;`,
  'features/classes/components/ClassForm.tsx': `import React from 'react'; export const ClassForm = () => <form>Form</form>;`,
  'features/classes/components/ClassDetail.tsx': `import React from 'react'; export const ClassDetail = ({data}: any) => <div>Detail</div>;`,
  'features/subjects/components/SubjectTable.tsx': `import React from 'react'; export const SubjectTable = ({data}: any) => <div>Table</div>;`,
  'features/attendance/components/AttendanceSheet.tsx': `import React from 'react'; export const AttendanceSheet = () => <div>Sheet</div>;`,
  'features/attendance/components/AttendanceSummaryChart.tsx': `import React from 'react'; export const AttendanceSummaryChart = () => <div>Chart</div>;`,
  'features/attendance/components/MyAttendanceView.tsx': `import React from 'react'; export const MyAttendanceView = () => <div>View</div>;`,
  'features/grades/components/GradeForm.tsx': `import React from 'react'; export const GradeForm = () => <form>Form</form>;`,
  'features/grades/components/ReportCard.tsx': `import React from 'react'; export const ReportCard = ({student, grades}: any) => <div>Report Card</div>;`,
  'features/assignments/components/AssignmentCard.tsx': `import React from 'react'; export const AssignmentCard = ({data}: any) => <div>Card</div>;`,
  'features/assignments/components/AssignmentForm.tsx': `import React from 'react'; export const AssignmentForm = () => <form>Form</form>;`,
  'features/assignments/components/SubmissionList.tsx': `import React from 'react'; export const SubmissionList = ({assignmentId}: any) => <div>Submissions</div>;`,
  'features/notices/components/NoticeCard.tsx': `import React from 'react'; export const NoticeCard = ({data}: any) => <div>Card</div>;`,
  'features/notices/components/NoticeForm.tsx': `import React from 'react'; export const NoticeForm = () => <form>Form</form>;`,
  'features/fees/components/FeeTable.tsx': `import React from 'react'; export const FeeTable = ({data}: any) => <div>Table</div>;`,
  'features/fees/components/FeePaymentButton.tsx': `import React from 'react'; export const FeePaymentButton = ({feeId}: any) => <button>Pay</button>;`,
  'features/fees/components/FeeReceiptDownload.tsx': `import React from 'react'; export const FeeReceiptDownload = ({paymentId}: any) => <button>Download</button>;`,
  'features/sms/components/SmsLogTable.tsx': `import React from 'react'; export const SmsLogTable = ({data}: any) => <div>Table</div>;`,
  'features/admin/components/DashboardStats.tsx': `import React from 'react'; export const DashboardStats = () => <div>Stats</div>;`,
  'features/admin/components/MonthlyFeeChart.tsx': `import React from 'react'; export const MonthlyFeeChart = () => <div>Chart</div>;`,
  'features/admin/components/AttendanceRateChart.tsx': `import React from 'react'; export const AttendanceRateChart = () => <div>Chart</div>;`,
  'features/admin/components/TopPerformersTable.tsx': `import React from 'react'; export const TopPerformersTable = () => <div>Table</div>;`,
  'features/schools/components/SchoolTable.tsx': `import React from 'react'; export const SchoolTable = ({data}: any) => <div>Table</div>;`,
  'features/schools/components/SchoolForm.tsx': `import React from 'react'; export const SchoolForm = () => <form>Form</form>;`,
};

Object.entries(components).forEach(([f, c]) => write(f, c));
console.log('Done script components');
