'use client'
import React from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { DashboardStats } from '@/features/admin/components/DashboardStats'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
  GraduationCap, BookOpen, ClipboardCheck, Award,
  School, CreditCard, ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'

  // ── Teacher Profile Query ──
  const { data: teacherProfile, isLoading: isLoadingTeacher } = useQuery({
    queryKey: ['teacher-my-profile'],
    queryFn: () => api.get('/teachers/me/profile').then(r => r.data.data),
    enabled: isTeacher
  })

  // ── Student Profile Query ──
  const { data: studentProfile, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student-my-profile'],
    queryFn: () => api.get('/students/my').then(r => r.data.data),
    enabled: isStudent
  })

  // ── Student Attendance Query ──
  const { data: studentAttendance } = useQuery({
    queryKey: ['student-my-attendance'],
    queryFn: () => api.get('/attendance/my').then(r => r.data.data),
    enabled: isStudent
  })

  // ── Student Fees Query ──
  const { data: studentFees } = useQuery({
    queryKey: ['student-my-fees'],
    queryFn: () => api.get('/fees/student').then(r => r.data.data),
    enabled: isStudent
  })

  // ── Student Attendance Stats ──
  const totalDays = studentAttendance?.length || 0
  const presentDays = studentAttendance?.filter((r: any) => r.status === 'present').length || 0
  const attendanceRate = totalDays ? (presentDays / totalDays) * 100 : 0

  // ── Student Fee Stats ──
  const pendingFeesCount = studentFees?.filter((f: any) => f.paymentStatus !== 'paid').length || 0

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="px-1">
        <h2 className="text-2xl font-bold text-teal-955 font-sans tracking-tight">
          Welcome back, {user?.name || 'User'}!
        </h2>
        <p className="text-sm text-teal-600/70 capitalize font-semibold mt-0.5">
          Role Portal: {user?.role?.replace('_', ' ')}
        </p>
      </div>

      {isAdmin && (
        // ── Admin Dashboard (All database stats) ──
        <div className="space-y-6">
          <DashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardLayout title="Recent Announcements" icon={BookOpen}>
              <p className="text-sm text-teal-900/70 leading-relaxed">
                School management portal is fully connected to the MongoDB database. Create academic classes, enroll students, and schedule fee structures to track real-time billing metrics.
              </p>
            </CardLayout>

            <CardLayout title="Academic Summary" icon={Award}>
              <p className="text-sm text-teal-900/70 leading-relaxed">
                Add teacher profiles and map them to their corresponding courses. Terminal grade sheets and sports announcements will feed dynamically into individual parent SMS alerts.
              </p>
            </CardLayout>
          </div>
        </div>
      )}

      {isTeacher && (
        // ── Teacher Dashboard ──
        <div className="space-y-6">
          {isLoadingTeacher ? (
            <div className="text-teal-600 font-medium py-6">Loading teacher stats...</div>
          ) : (
            <>
              {/* Stats Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatBox
                  title="My Assigned Classes"
                  value={teacherProfile?.classIds?.length || 0}
                  icon={School}
                />
                <StatBox
                  title="My Subjects Taught"
                  value={teacherProfile?.subjects?.length || 0}
                  icon={BookOpen}
                />
                <StatBox
                  title="Qualification Rank"
                  value={teacherProfile?.qualification || 'Teacher'}
                  icon={Award}
                />
              </div>

              {/* Detail Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Classes Managed List */}
                <CardLayout title="My Assigned Classes" icon={School}>
                  <div className="space-y-2">
                    {teacherProfile?.classIds && teacherProfile.classIds.length > 0 ? (
                      teacherProfile.classIds.map((cls: any) => (
                        <Link
                          key={cls._id}
                          href={`/classes/${cls._id}`}
                          className="flex items-center justify-between p-3 bg-teal-50/50 hover:bg-teal-50 border border-teal-100/50 rounded-xl transition-all group"
                        >
                          <span className="font-semibold text-teal-950 text-sm">
                            {cls.name} — Section {cls.section || 'A'}
                          </span>
                          <ChevronRight size={16} className="text-teal-600 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-teal-800/40">No assigned classes found.</p>
                    )}
                  </div>
                </CardLayout>

                {/* Subjects List */}
                <CardLayout title="My Subjects" icon={BookOpen}>
                  <div className="flex flex-wrap gap-2">
                    {teacherProfile?.subjects && teacherProfile.subjects.length > 0 ? (
                      teacherProfile.subjects.map((sub: any) => (
                        <span
                          key={sub._id}
                          className="px-3 py-1.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold rounded-xl"
                        >
                          {sub.name} ({sub.code || 'N/A'})
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-teal-800/40">No subjects assigned.</p>
                    )}
                  </div>
                </CardLayout>
              </div>
            </>
          )}
        </div>
      )}

      {isStudent && (
        // ── Student Dashboard ──
        <div className="space-y-6">
          {isLoadingStudent ? (
            <div className="text-teal-600 font-medium py-6">Loading portal stats...</div>
          ) : (
            <>
              {/* Stats Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatBox
                  title="My Attendance Rate"
                  value={totalDays ? `${attendanceRate.toFixed(1)}%` : 'N/A'}
                  icon={ClipboardCheck}
                />
                <StatBox
                  title="Pending Bills"
                  value={pendingFeesCount ? `${pendingFeesCount} Bills` : 'No Dues'}
                  icon={CreditCard}
                  color={pendingFeesCount > 0 ? 'text-amber-600 bg-amber-50 border-amber-100' : undefined}
                />
                <StatBox
                  title="Class Roll Number"
                  value={studentProfile?.roll || 'N/A'}
                  icon={GraduationCap}
                />
              </div>

              {/* Detail Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Enrollment Details */}
                <CardLayout title="Enrollment Details" icon={School}>
                  <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                    <div>
                      <span className="text-[10px] font-bold text-teal-800/50 uppercase tracking-wider block">Assigned Class</span>
                      <span className="font-semibold text-teal-950 mt-1 block">
                        {studentProfile?.classId?.name || 'Not Enrolled'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-800/50 uppercase tracking-wider block">Class Section</span>
                      <span className="font-semibold text-teal-950 mt-1 block">
                        {studentProfile?.section || studentProfile?.classId?.section || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-800/50 uppercase tracking-wider block">Parent Guardian</span>
                      <span className="font-semibold text-teal-950 mt-1 block truncate">
                        {studentProfile?.guardianName || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-800/50 uppercase tracking-wider block">Admission Date</span>
                      <span className="font-semibold text-teal-950 mt-1 block">
                        {studentProfile?.admissionDate ? new Date(studentProfile.admissionDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardLayout>

                {/* Quick actions for student */}
                <CardLayout title="Quick Links" icon={BookOpen}>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/attendance"
                      className="p-3 border border-teal-100/50 bg-teal-50/20 hover:bg-teal-50 text-teal-700 font-semibold text-xs rounded-xl flex items-center justify-between group transition-all"
                    >
                      View Attendance Calendar
                      <ChevronRight size={14} className="text-teal-600 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/fees"
                      className="p-3 border border-teal-100/50 bg-teal-50/20 hover:bg-teal-50 text-teal-700 font-semibold text-xs rounded-xl flex items-center justify-between group transition-all"
                    >
                      Pay Online Fees
                      <ChevronRight size={14} className="text-teal-600 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </CardLayout>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Shared Dashboard Layout Elements ──────────────────────────────────────────

interface CardLayoutProps {
  title: string
  icon: React.ComponentType<any>
  children: React.ReactNode
}

function CardLayout({ title, icon: Icon, children }: CardLayoutProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-teal-100/60 space-y-4">
      <h3 className="text-sm font-bold text-teal-955 uppercase tracking-wider flex items-center gap-2">
        <Icon size={16} className="text-teal-600" />
        {title}
      </h3>
      <div>{children}</div>
    </div>
  )
}

interface StatBoxProps {
  title: string
  value: string | number
  icon: React.ComponentType<any>
  color?: string
}

function StatBox({ title, value, icon: Icon, color }: StatBoxProps) {
  const wrapperClass = color || 'text-teal-600 bg-teal-50 border-teal-100'
  return (
    <div className="bg-white p-5 rounded-2xl border border-teal-100/60 card-lift flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-teal-800/60 uppercase tracking-widest leading-none">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${wrapperClass}`}>
          <Icon size={15} strokeWidth={2} />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-xl font-bold text-teal-955 tracking-tight font-sans">
          {value}
        </span>
      </div>
    </div>
  )
}