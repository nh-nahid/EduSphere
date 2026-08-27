'use client'
import React from 'react'
import { useDashboardStats } from '../hooks'
import { GraduationCap, UsersRound, School, CreditCard, ClipboardCheck, MessageSquare } from 'lucide-react'

export const DashboardStats = () => {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5 mt-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-28 bg-white border border-teal-100/50 rounded-2xl animate-pulse"></div>
      ))}
    </div>
  }

  const statItems = [
    {
      title: 'Total Students',
      value: stats?.totalStudents ?? 0,
      icon: GraduationCap,
      color: 'text-teal-600 bg-teal-50 border-teal-100'
    },
    {
      title: 'Total Teachers',
      value: stats?.totalTeachers ?? 0,
      icon: UsersRound,
      color: 'text-teal-600 bg-teal-50 border-teal-100'
    },
    {
      title: 'Total Classes',
      value: stats?.totalClasses ?? 0,
      icon: School,
      color: 'text-teal-600 bg-teal-50 border-teal-100'
    },
    {
      title: 'Total Revenue',
      value: `৳ ${stats?.totalRevenue ?? 0}`,
      icon: CreditCard,
      color: 'text-teal-700 bg-emerald-50 border-emerald-100'
    },
    stats?.isSuperAdmin ? {
      title: 'Registered Schools',
      value: stats?.totalSchools ?? 0,
      icon: School,
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    } : {
      title: 'Attendance Rate',
      value: `${(stats?.attendanceRate ?? 0).toFixed(1)}%`,
      icon: ClipboardCheck,
      color: 'text-teal-600 bg-teal-50 border-teal-100'
    },
    {
      title: 'SMS Sent (Today)',
      value: stats?.smsCount ?? 0,
      icon: MessageSquare,
      color: 'text-teal-600 bg-teal-50 border-teal-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mt-4">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-2xl border border-teal-100/60 card-lift flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-teal-800/60 uppercase tracking-wider leading-none">
              {item.title}
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${item.color}`}>
              <item.icon size={16} strokeWidth={2} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-teal-950 font-sans tracking-tight">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
