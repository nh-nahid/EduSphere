'use client'
import React, { use } from 'react'
import { StudentCard } from '@/features/students/components/StudentCard'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function StudentDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-teal-950 font-sans tracking-tight">Student Profile Details</h2>
      <StudentCard id={resolvedParams.id} />
    </div>
  )
}
