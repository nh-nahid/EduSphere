'use client'
import React from 'react'
import { useStudent } from '../hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Phone, GraduationCap, Calendar, Mail, FileText } from 'lucide-react'

interface StudentCardProps {
  id?: string
  student?: any
}

export const StudentCard = ({ id, student: initialStudent }: StudentCardProps) => {
  
  const { data: fetchedStudent, isLoading } = useStudent(id || '')
  
  const student = initialStudent || fetchedStudent

  if (isLoading) {
    return <div className="text-teal-600 font-medium py-10 text-center">Loading student profile...</div>
  }

  if (!student) {
    return (
      <Card className="border-teal-100 bg-white">
        <CardContent className="py-10 text-center text-teal-800/60 font-medium">
          No student profile data found.
        </CardContent>
      </Card>
    )
  }

  const profileItems = [
    {
      label: 'Email Address',
      value: student.userId?.email || 'N/A',
      icon: Mail
    },
    {
      label: 'Contact Number',
      value: student.userId?.phone || 'N/A',
      icon: Phone
    },
    {
      label: 'Class Section',
      value: student.classId ? `${student.classId.name} - ${student.section || student.classId.section || 'N/A'}` : 'Not Enrolled',
      icon: GraduationCap
    },
    {
      label: 'Class Roll No.',
      value: student.roll || 'N/A',
      icon: FileText
    },
    {
      label: 'Guardian Name',
      value: student.guardianName || 'N/A',
      icon: User
    },
    {
      label: 'Guardian Contact',
      value: student.guardianPhone || 'N/A',
      icon: Phone
    },
    {
      label: 'Admission Date',
      value: student.admissionDate ? new Date(student.admissionDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A',
      icon: Calendar
    }
  ]

  return (
    <Card className="border-teal-100 bg-white shadow-sm overflow-hidden rounded-2xl max-w-2xl">
      <CardHeader className="brand-banner text-white p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold uppercase text-white border-2 border-white/40">
            {student.userId?.name?.[0] || 'S'}
          </div>
          <div>
            <CardTitle className="text-xl font-bold font-sans tracking-tight">
              {student.userId?.name || 'Student Profile'}
            </CardTitle>
            <p className="text-xs text-teal-100 mt-0.5 font-medium tracking-wide">
              Admission ID: {student._id}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {profileItems.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0 mt-0.5">
                <item.icon size={15} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-teal-800/50 uppercase tracking-widest block">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-teal-950 font-sans mt-0.5 block truncate">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
