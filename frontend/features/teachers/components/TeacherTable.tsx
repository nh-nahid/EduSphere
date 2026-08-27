'use client'
import React from 'react'
import { useTeachers, useDeleteTeacher } from '../hooks'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

export const TeacherTable = () => {
  const { data: teachers, isLoading } = useTeachers()
  const { mutate: deleteTeacher } = useDeleteTeacher()

  if (isLoading) {
    return <div className="text-center py-10 text-teal-600 font-medium">Loading teachers...</div>
  }

  const columns = [
    {
      header: 'Name',
      cell: (teacher: any) => (
        <div className="font-semibold text-teal-950">{teacher.userId?.name || 'N/A'}</div>
      )
    },
    {
      header: 'Email',
      cell: (teacher: any) => (
        <div className="text-teal-900/70 text-xs">{teacher.userId?.email || 'N/A'}</div>
      )
    },
    {
      header: 'Qualification',
      cell: (teacher: any) => (
        <div className="text-teal-800 text-sm font-medium">{teacher.qualification || 'N/A'}</div>
      )
    },
    {
      header: 'Joining Date',
      cell: (teacher: any) => (
        <div className="text-teal-900/80 text-sm font-medium">
          {teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    {
      header: 'Actions',
      cell: (teacher: any) => (
        <div className="flex gap-2 justify-end">
          <Link href={`/teachers/${teacher._id}`}>
            <Button variant="outline" size="sm" className="h-8 border-teal-100 hover:bg-teal-50 text-teal-700">
              <Eye size={14} className="mr-1" /> View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${teacher.userId?.name || 'this teacher'}?`)) {
                deleteTeacher(teacher._id)
              }
            }}
            className="h-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="mt-4">
      <DataTable data={teachers || []} columns={columns} emptyMessage="No teachers found." />
    </div>
  )
}
