'use client'
import React, { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useClasses } from '@/features/classes/hooks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assignmentsApi } from '../api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/shared/DataTable'
import { toast } from 'sonner'
import { FileText, Calendar, BookOpen, AlertCircle, Plus } from 'lucide-react'
import api from '@/lib/axios'

export const AssignmentCard = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'

  const queryClient = useQueryClient()

  
  const [selectedClassId, setSelectedClassId] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [fileUrl, setFileUrl] = useState('')

  
  const { data: classes } = useClasses()

  
  const { data: subjects } = useQuery({
    queryKey: ['subjects-assignments', selectedClassId],
    queryFn: async () => {
      const res = await api.get('/subjects')
      return res.data.data?.filter((s: any) => {
        const classIdVal = typeof s.classId === 'object' && s.classId ? s.classId._id : s.classId
        return classIdVal === selectedClassId
      }) || []
    },
    enabled: !!selectedClassId
  })

  
  const { data: studentProfile } = useQuery({
    queryKey: ['student-profile-assignments'],
    queryFn: () => api.get('/students/my').then(r => r.data.data),
    enabled: isStudent
  })

  const targetClassId = isStudent ? studentProfile?.classId?._id : selectedClassId

  
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments-list', targetClassId],
    queryFn: () => assignmentsApi.getAll({ classId: targetClassId }),
    enabled: !!targetClassId
  })

  
  const { mutate: createAssignment, isPending: isCreating } = useMutation({
    mutationFn: (payload: any) => assignmentsApi.create(payload),
    onSuccess: () => {
      toast.success('Assignment published successfully!')
      setTitle('')
      setDescription('')
      setSelectedSubjectId('')
      setDueDate('')
      setFileUrl('')
      setShowCreateForm(false)
      queryClient.invalidateQueries({ queryKey: ['assignments-list'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to publish assignment')
    }
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClassId) return toast.error('Please select a class')
    if (!selectedSubjectId) return toast.error('Please select a subject')

    createAssignment({
      title,
      description,
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      dueDate,
      fileUrl: fileUrl || 'https://example.com/homework-resource.pdf'
    })
  }

  if (isLoading && targetClassId) {
    return <div className="text-teal-600 font-medium py-10 text-center">Loading assignments roster...</div>
  }

  const columns = [
    {
      header: 'Assignment Title',
      cell: (asg: any) => (
        <div>
          <div className="font-semibold text-teal-950 flex items-center gap-1.5">
            <FileText size={15} className="text-teal-600" />
            {asg.title || 'N/A'}
          </div>
          <div className="text-teal-900/60 text-xs mt-1 pl-5 max-w-sm truncate">{asg.description}</div>
        </div>
      )
    },
    {
      header: 'Subject',
      cell: (asg: any) => (
        <span className="px-2 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold rounded-full">
          {asg.subjectId?.name || 'N/A'}
        </span>
      )
    },
    {
      header: 'Due Date',
      cell: (asg: any) => {
        const isOverdue = new Date(asg.dueDate) < new Date()
        return (
          <div className={`text-sm font-semibold flex items-center gap-1 ${isOverdue ? 'text-rose-600' : 'text-teal-950'}`}>
            <Calendar size={14} />
            {asg.dueDate ? new Date(asg.dueDate).toLocaleDateString() : 'N/A'}
          </div>
        )
      }
    },
    {
      header: 'Actions',
      cell: (asg: any) => {
        const downloadUrl = asg.fileUrl || 'http://localhost:5000/documents/assignment-lorem.pdf'
        return (
          <div className="flex gap-2 justify-end">
            <a href={downloadUrl} target="_blank" rel="noreferrer" download>
              <Button variant="outline" size="sm" className="h-8 border-teal-100 hover:bg-teal-50 text-teal-700 font-medium">
                Download File
              </Button>
            </a>
          </div>
        )
      }
    }
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {}
      {!isStudent && (
        <div className="flex justify-between items-center bg-white p-4 border border-teal-100/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-teal-900 uppercase tracking-wider">Filter Class:</label>
            <select
              value={selectedClassId}
              onChange={e => {
                setSelectedClassId(e.target.value)
                setShowCreateForm(false)
              }}
              className="p-2 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-955 focus:outline-none"
            >
              <option value="">Select a Class</option>
              {classes?.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.name} - {c.section}
                </option>
              ))}
            </select>
          </div>

          {selectedClassId && (
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-9 px-4 flex items-center gap-1.5"
            >
              <Plus size={15} />
              {showCreateForm ? 'View List' : 'Add Homework'}
            </Button>
          )}
        </div>
      )}

      {}
      {showCreateForm && selectedClassId && (
        <Card className="border-teal-100 bg-white rounded-2xl shadow-sm max-w-xl">
          <CardHeader className="brand-banner text-white p-5 rounded-t-2xl">
            <CardTitle className="text-sm font-bold uppercase tracking-wider font-sans">Publish Assignment</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Assignment Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                  placeholder="e.g. Chapter 4 Exercises"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Subject Course</label>
                <select
                  value={selectedSubjectId}
                  onChange={e => setSelectedSubjectId(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-955 focus:outline-none"
                  required
                >
                  <option value="">Select Course</option>
                  {subjects?.map((s: any) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Task Instructions</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                  placeholder="Explain submission instructions..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full p-2 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-955 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Resource Attachment URL</label>
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={e => setFileUrl(e.target.value)}
                    className="w-full p-2 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                    placeholder="https://example.com/file.pdf"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-10 px-5"
                >
                  {isCreating ? 'Publishing...' : 'Publish Homework'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {}
      {!showCreateForm && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-teal-955 font-sans">
            {isStudent ? 'My Class Assignments' : 'Active Class Assignments'}
          </h2>
          {targetClassId ? (
            <DataTable data={assignments || []} columns={columns} emptyMessage="No assignments registered for this class." />
          ) : (
            <Card className="border-teal-100/50 bg-white">
              <CardContent className="py-10 text-center text-teal-800/40 text-sm font-medium flex flex-col items-center justify-center gap-2">
                <AlertCircle size={24} className="text-teal-600/40" />
                Please select a class filter to view assignment logs.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
