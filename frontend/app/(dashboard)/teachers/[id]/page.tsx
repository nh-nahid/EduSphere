'use client'
import React, { use } from 'react'
import { TeacherCard } from '@/features/teachers/components/TeacherCard'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TeacherDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-teal-950 font-sans tracking-tight">Teacher Profile Details</h2>
      <TeacherCard id={resolvedParams.id} />
    </div>
  )
}
