'use client'
import React from 'react'
import { useSubjects, useDeleteSubject } from '../hooks'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export const SubjectTable = () => {
  const { data: subjects, isLoading } = useSubjects()
  const { mutate: deleteSubject } = useDeleteSubject()

  if (isLoading) {
    return <div className="text-center py-10 text-teal-600 font-medium">Loading subjects...</div>
  }

  const columns = [
    {
      header: 'Subject Name',
      cell: (subject: any) => (
        <div className="font-semibold text-teal-950">{subject.name || 'N/A'}</div>
      )
    },
    {
      header: 'Subject Code',
      cell: (subject: any) => (
        <div className="font-mono text-sm text-teal-800 font-medium">{subject.code || 'N/A'}</div>
      )
    },
    {
      header: 'Associated Class',
      cell: (subject: any) => (
        <span className="px-2 py-1 bg-teal-50 border border-teal-100 text-teal-700 text-xs rounded-full font-medium">
          {subject.classId?.name || 'N/A'} ({subject.classId?.section || 'N/A'})
        </span>
      )
    },
    {
      header: 'Assigned Teacher',
      cell: (subject: any) => (
        <div className="text-teal-900/80 text-sm font-medium">
          {subject.teacherId?.userId?.name || 'Not Assigned'}
        </div>
      )
    },
    {
      header: 'Actions',
      cell: (subject: any) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${subject.name || 'this subject'}?`)) {
                deleteSubject(subject._id)
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
      <DataTable data={subjects || []} columns={columns} emptyMessage="No subjects found." />
    </div>
  )
}
