'use client'
import React from 'react'
import { useClasses, useDeleteClass } from '../hooks'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

export const ClassTable = () => {
  const { data: classes, isLoading } = useClasses()
  const { mutate: deleteClass } = useDeleteClass()

  if (isLoading) {
    return <div className="text-center py-10 text-teal-600 font-medium">Loading classes...</div>
  }

  const columns = [
    {
      header: 'Class Name',
      cell: (cls: any) => (
        <div className="font-semibold text-teal-950">{cls.name || 'N/A'}</div>
      )
    },
    {
      header: 'Section',
      cell: (cls: any) => (
        <div className="text-teal-800 font-medium">{cls.section || 'N/A'}</div>
      )
    },
    {
      header: 'Class Teacher',
      cell: (cls: any) => (
        <div className="text-teal-900/80 text-sm font-medium">
          {cls.classTeacherId?.userId?.name || 'Not Assigned'}
        </div>
      )
    },
    {
      header: 'Academic Year',
      cell: (cls: any) => (
        <div className="text-teal-900/70 text-xs font-mono">{cls.academicYear || 'N/A'}</div>
      )
    },
    {
      header: 'Students Enrolled',
      cell: (cls: any) => (
        <span className="px-2.5 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold rounded-full">
          {cls.studentIds?.length || 0} Students
        </span>
      )
    },
    {
      header: 'Actions',
      cell: (cls: any) => (
        <div className="flex gap-2 justify-end">
          <Link href={`/classes/${cls._id}`}>
            <Button variant="outline" size="sm" className="h-8 border-teal-100 hover:bg-teal-50 text-teal-700">
              <Eye size={14} className="mr-1" /> View Details
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${cls.name || 'this class'}?`)) {
                deleteClass(cls._id)
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
      <DataTable data={classes || []} columns={columns} emptyMessage="No classes found." />
    </div>
  )
}
