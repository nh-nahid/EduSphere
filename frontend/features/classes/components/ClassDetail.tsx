'use client'
import React from 'react'
import { useClass } from '../hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/shared/DataTable'
import { GraduationCap, BookOpen, User, Calendar } from 'lucide-react'

interface ClassDetailProps {
  id?: string
}

export const ClassDetail = ({ id }: ClassDetailProps) => {
  const { data: cls, isLoading } = useClass(id || '')

  if (isLoading) {
    return <div className="text-teal-600 font-medium py-10 text-center">Loading class details...</div>
  }

  if (!cls) {
    return (
      <Card className="border-teal-100 bg-white">
        <CardContent className="py-10 text-center text-teal-800/60 font-medium">
          No class details found.
        </CardContent>
      </Card>
    )
  }

  const studentColumns = [
    {
      header: 'Roll',
      cell: (student: any) => <div className="font-mono text-sm text-teal-800 font-semibold">{student.roll || 'N/A'}</div>
    },
    {
      header: 'Name',
      cell: (student: any) => <div className="font-semibold text-teal-950">{student.userId?.name || 'N/A'}</div>
    },
    {
      header: 'Email',
      cell: (student: any) => <div className="text-teal-900/70 text-xs">{student.userId?.email || 'N/A'}</div>
    },
    {
      header: 'Guardian Phone',
      cell: (student: any) => <div className="text-teal-800 text-sm font-medium">{student.guardianPhone || 'N/A'}</div>
    }
  ]

  const subjectColumns = [
    {
      header: 'Subject Code',
      cell: (subject: any) => <div className="font-mono text-sm text-teal-800 font-semibold">{subject.code || 'N/A'}</div>
    },
    {
      header: 'Name',
      cell: (subject: any) => <div className="font-semibold text-teal-950">{subject.name || 'N/A'}</div>
    }
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Overview Card */}
      <Card className="border-teal-100 bg-white shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="brand-banner text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold font-sans tracking-tight">
                {cls.name || 'Class Details'} (Section {cls.section || 'N/A'})
              </CardTitle>
              <p className="text-xs text-teal-100 mt-1 font-medium tracking-wide">
                Academic Session: {cls.academicYear || 'N/A'}
              </p>
            </div>
            <span className="px-3 py-1 bg-white/20 border border-white/30 rounded-xl text-xs font-semibold text-white">
              {cls.studentIds?.length || 0} Students
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <User size={18} strokeWidth={2} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-800/50 uppercase tracking-widest block">Class Teacher</span>
              <span className="text-sm font-semibold text-teal-950 font-sans mt-0.5 block">
                {cls.classTeacherId?.userId?.name || 'Not Assigned'}
              </span>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <Calendar size={18} strokeWidth={2} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-800/50 uppercase tracking-widest block">Session ID</span>
              <span className="text-sm font-mono text-teal-950 mt-0.5 block truncate">
                {cls._id}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid containing Subjects and Enrolled Students list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Subjects List */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <BookOpen size={16} className="text-teal-600" />
            <h3 className="text-sm font-bold text-teal-950 uppercase tracking-wider">Associated Subjects</h3>
          </div>
          <DataTable
            data={cls.subjectIds || []}
            columns={subjectColumns}
            emptyMessage="No subjects mapped."
          />
        </div>

        {/* Right Side: Enrolled Students */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <GraduationCap size={18} className="text-teal-600" />
            <h3 className="text-sm font-bold text-teal-950 uppercase tracking-wider">Enrolled Student List</h3>
          </div>
          <DataTable
            data={cls.studentIds || []}
            columns={studentColumns}
            emptyMessage="No enrolled students."
          />
        </div>
      </div>
    </div>
  )
}
