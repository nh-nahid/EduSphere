const fs = require('fs');
const path = require('path');

const baseDir = 'f:\\school_management_system\\frontend';
const write = (file, content) => {
  const p = path.join(baseDir, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trim() + '\n');
};

const pages = {
  'app/(auth)/forgot-password/page.tsx': `'use client';\nimport React from 'react'; export default function ForgotPasswordPage() { return <div>Forgot Password</div>; }`,
  'app/(dashboard)/students/page.tsx': `'use client';\nimport React from 'react'; import { StudentTable } from '@/features/students/components/StudentTable'; export default function StudentsPage() { return <div>Students <StudentTable/></div>; }`,
  'app/(dashboard)/students/new/page.tsx': `'use client';\nimport React from 'react'; import { StudentForm } from '@/features/students/components/StudentForm'; export default function NewStudentPage() { return <div><StudentForm/></div>; }`,
  'app/(dashboard)/students/[id]/page.tsx': `'use client';\nimport React from 'react'; import { StudentCard } from '@/features/students/components/StudentCard'; export default function StudentDetailPage() { return <div><StudentCard/></div>; }`,
  'app/(dashboard)/teachers/page.tsx': `'use client';\nimport React from 'react'; import { TeacherTable } from '@/features/teachers/components/TeacherTable'; export default function TeachersPage() { return <div><TeacherTable/></div>; }`,
  'app/(dashboard)/teachers/new/page.tsx': `'use client';\nimport React from 'react'; import { TeacherForm } from '@/features/teachers/components/TeacherForm'; export default function NewTeacherPage() { return <div><TeacherForm/></div>; }`,
  'app/(dashboard)/teachers/[id]/page.tsx': `'use client';\nimport React from 'react'; export default function TeacherDetailPage() { return <div>Teacher</div>; }`,
  'app/(dashboard)/classes/page.tsx': `'use client';\nimport React from 'react'; import { ClassTable } from '@/features/classes/components/ClassTable'; export default function ClassesPage() { return <div><ClassTable/></div>; }`,
  'app/(dashboard)/classes/[id]/page.tsx': `'use client';\nimport React from 'react'; import { ClassDetail } from '@/features/classes/components/ClassDetail'; export default function ClassDetailPage() { return <div><ClassDetail/></div>; }`,
  'app/(dashboard)/subjects/page.tsx': `'use client';\nimport React from 'react'; import { SubjectTable } from '@/features/subjects/components/SubjectTable'; export default function SubjectsPage() { return <div><SubjectTable/></div>; }`,
  'app/(dashboard)/attendance/page.tsx': `'use client';\nimport React from 'react'; import { AttendanceSheet } from '@/features/attendance/components/AttendanceSheet'; export default function AttendancePage() { return <div><AttendanceSheet/></div>; }`,
  'app/(dashboard)/attendance/report/page.tsx': `'use client';\nimport React from 'react'; export default function AttendanceReportPage() { return <div>Report</div>; }`,
  'app/(dashboard)/grades/page.tsx': `'use client';\nimport React from 'react'; import { GradeForm } from '@/features/grades/components/GradeForm'; export default function GradesPage() { return <div><GradeForm/></div>; }`,
  'app/(dashboard)/grades/report-card/[studentId]/page.tsx': `'use client';\nimport React from 'react'; import { ReportCard } from '@/features/grades/components/ReportCard'; export default function ReportCardPage() { return <div><ReportCard/></div>; }`,
  'app/(dashboard)/assignments/page.tsx': `'use client';\nimport React from 'react'; import { AssignmentCard } from '@/features/assignments/components/AssignmentCard'; export default function AssignmentsPage() { return <div><AssignmentCard/></div>; }`,
  'app/(dashboard)/assignments/[id]/page.tsx': `'use client';\nimport React from 'react'; import { SubmissionList } from '@/features/assignments/components/SubmissionList'; export default function AssignmentDetailPage() { return <div><SubmissionList/></div>; }`,
  'app/(dashboard)/notices/page.tsx': `'use client';\nimport React from 'react'; import { NoticeCard } from '@/features/notices/components/NoticeCard'; export default function NoticesPage() { return <div><NoticeCard/></div>; }`,
  'app/(dashboard)/fees/page.tsx': `'use client';\nimport React from 'react'; import { FeeTable } from '@/features/fees/components/FeeTable'; export default function FeesPage() { return <div><FeeTable/></div>; }`,
  'app/(dashboard)/fees/pay/[feeId]/page.tsx': `'use client';\nimport React from 'react'; import { FeePaymentButton } from '@/features/fees/components/FeePaymentButton'; export default function FeePayPage() { return <div><FeePaymentButton/></div>; }`,
  'app/(dashboard)/sms-logs/page.tsx': `'use client';\nimport React from 'react'; import { SmsLogTable } from '@/features/sms/components/SmsLogTable'; export default function SmsLogsPage() { return <div><SmsLogTable/></div>; }`,
  'app/(dashboard)/profile/page.tsx': `'use client';\nimport React from 'react'; export default function ProfilePage() { return <div>Profile</div>; }`,
  'app/(dashboard)/admin/page.tsx': `'use client';\nimport React from 'react'; import { DashboardStats } from '@/features/admin/components/DashboardStats'; export default function AdminPage() { return <div><DashboardStats/></div>; }`,
  'app/(dashboard)/admin/users/page.tsx': `'use client';\nimport React from 'react'; export default function AdminUsersPage() { return <div>Users</div>; }`,
  'app/(dashboard)/schools/page.tsx': `'use client';\nimport React from 'react'; import { SchoolTable } from '@/features/schools/components/SchoolTable'; export default function SchoolsPage() { return <div><SchoolTable/></div>; }`,
  'app/(dashboard)/schools/[id]/page.tsx': `'use client';\nimport React from 'react'; export default function SchoolDetailPage() { return <div>School Detail</div>; }`,
  'app/payment/success/page.tsx': `'use client';\nimport React from 'react'; export default function PaymentSuccessPage() { return <div>Success</div>; }`,
  'app/payment/fail/page.tsx': `'use client';\nimport React from 'react'; export default function PaymentFailPage() { return <div>Fail</div>; }`,
  'app/payment/cancel/page.tsx': `'use client';\nimport React from 'react'; export default function PaymentCancelPage() { return <div>Cancel</div>; }`,
  'app/(dashboard)/loading.tsx': `export default function Loading() { return <div>Loading...</div>; }`,
  'app/not-found.tsx': `export default function NotFound() { return <div>Not Found</div>; }`
};

Object.entries(pages).forEach(([f, c]) => write(f, c));
console.log('Done script pages');
