'use client'
import React from 'react'
import { useStudents, useDeleteStudent } from '../hooks'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

export const StudentTable = () => {
  const { data: students, isLoading } = useStudents()
  const { mutate: deleteStudent } = useDeleteStudent()

  if (isLoading) {
    return <div className="text-center py-10 text-teal-600 font-medium">Loading students...</div>
  }

  const columns = [
    {
      header: 'Name',
      cell: (student: any) => (
        <div className="font-semibold text-teal-950">{student.userId?.name || 'N/A'}</div>
      )
    },
    {
      header: 'Email',
      cell: (student: any) => (
        <div className="text-teal-900/70 text-xs">{student.userId?.email || 'N/A'}</div>
      )
    },
    {
      header: 'Class',
      cell: (student: any) => (
        <span className="px-2 py-1 bg-teal-50 border border-teal-100 text-teal-700 text-xs rounded-full font-medium">
          {student.classId?.name || 'N/A'}
        </span>
      )
    },
    {
      header: 'Roll',
      cell: (student: any) => (
        <div className="font-mono text-sm text-teal-800 font-medium">{student.roll || 'N/A'}</div>
      )
    },
    {
      header: 'Section',
      cell: (student: any) => (
        <div className="text-teal-800 font-medium">{student.section || 'N/A'}</div>
      )
    },
    {
      header: 'Guardian Phone',
      cell: (student: any) => (
        <div className="text-teal-900/80 text-sm font-medium">{student.guardianPhone || 'N/A'}</div>
      )
    },
    {
      header: 'Actions',
      cell: (student: any) => (
        <div className="flex gap-2 justify-end">
          <Link href={`/students/${student._id}`}>
            <Button variant="outline" size="sm" className="h-8 border-teal-100 hover:bg-teal-50 text-teal-700">
              <Eye size={14} className="mr-1" /> View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${student.userId?.name || 'this student'}?`)) {
                deleteStudent(student._id)
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
      <DataTable data={students || []} columns={columns} emptyMessage="No students found matching current criteria." />
    </div>
  )
}
