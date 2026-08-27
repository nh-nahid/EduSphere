'use client'
import React from 'react'
import { useTeacher } from '../hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Phone, BookOpen, Calendar, Mail, GraduationCap } from 'lucide-react'

interface TeacherCardProps {
  id?: string
  teacher?: any
}

export const TeacherCard = ({ id, teacher: initialTeacher }: TeacherCardProps) => {
  const { data: fetchedTeacher, isLoading } = useTeacher(id || '')
  
  const teacher = initialTeacher || fetchedTeacher

  if (isLoading) {
    return <div className="text-teal-600 font-medium py-10 text-center">Loading teacher profile...</div>
  }

  if (!teacher) {
    return (
      <Card className="border-teal-100 bg-white">
        <CardContent className="py-10 text-center text-teal-800/60 font-medium">
          No teacher profile data found.
        </CardContent>
      </Card>
    )
  }

  const profileItems = [
    {
      label: 'Email Address',
      value: teacher.userId?.email || 'N/A',
      icon: Mail
    },
    {
      label: 'Contact Number',
      value: teacher.userId?.phone || 'N/A',
      icon: Phone
    },
    {
      label: 'Qualification',
      value: teacher.qualification || 'N/A',
      icon: User
    },
    {
      label: 'Joining Date',
      value: teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A',
      icon: Calendar
    }
  ]

  return (
    <Card className="border-teal-100 bg-white shadow-sm overflow-hidden rounded-2xl max-w-2xl">
      <CardHeader className="brand-banner text-white p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold uppercase text-white border-2 border-white/40">
            {teacher.userId?.name?.[0] || 'T'}
          </div>
          <div>
            <CardTitle className="text-xl font-bold font-sans tracking-tight">
              {teacher.userId?.name || 'Teacher Profile'}
            </CardTitle>
            <p className="text-xs text-teal-100 mt-0.5 font-medium tracking-wide">
              Teacher ID: {teacher._id}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
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

        {/* Subjects & Classes */}
        <div className="border-t border-teal-50 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Subjects */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-teal-600" /> Subjects Taught
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {teacher.subjects && teacher.subjects.length > 0 ? (
                teacher.subjects.map((sub: any, idx: number) => (
                  <span key={idx} className="px-2.5 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs rounded-full font-medium">
                    {sub.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-teal-800/40">No assigned subjects</span>
              )}
            </div>
          </div>

          {/* Classes Managed */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap size={14} className="text-teal-600" /> Managed Classes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {teacher.classIds && teacher.classIds.length > 0 ? (
                teacher.classIds.map((cls: any, idx: number) => (
                  <span key={idx} className="px-2.5 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs rounded-full font-medium">
                    {cls.name} ({cls.section || 'N/A'})
                  </span>
                ))
              ) : (
                <span className="text-xs text-teal-800/40">No assigned classes</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
