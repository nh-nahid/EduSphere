'use client'
import React, { use } from 'react'
import { ClassDetail } from '@/features/classes/components/ClassDetail'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ClassDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-teal-950 font-sans tracking-tight">Class Administration</h2>
      <ClassDetail id={resolvedParams.id} />
    </div>
  )
}
