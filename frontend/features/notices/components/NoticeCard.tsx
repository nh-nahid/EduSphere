'use client'
import React, { useState } from 'react'
import { useNotices, useCreateNotice, useDeleteNotice } from '../hooks'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Bell, Trash2, Calendar, Plus } from 'lucide-react'

export const NoticeCard = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const isTeacher = user?.role === 'teacher'
  const canPublish = isAdmin || isTeacher

  const { data: notices, isLoading } = useNotices()
  const { mutate: createNotice, isPending: isPublishing } = useCreateNotice()
  const { mutate: deleteNotice } = useDeleteNotice()

  
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [targetRole, setTargetRole] = useState('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createNotice({
      title,
      content,
      targetRole
    }, {
      onSuccess: () => {
        toast.success('Notice published successfully!')
        setTitle('')
        setContent('')
        setTargetRole('all')
        setShowForm(false)
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to publish notice')
      }
    })
  }

  if (isLoading) {
    return <div className="text-teal-600 font-medium py-10 text-center">Loading notice board...</div>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold text-teal-955 font-sans tracking-tight flex items-center gap-2">
          <Bell size={20} className="text-teal-600" />
          School Notice Board
        </h2>
        {canPublish && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-9 px-4 flex items-center gap-1.5"
          >
            <Plus size={15} />
            {showForm ? 'View Notice Board' : 'Add Notice'}
          </Button>
        )}
      </div>

      {}
      {showForm && canPublish && (
        <Card className="border-teal-100 bg-white rounded-2xl shadow-sm max-w-xl">
          <CardHeader className="brand-banner text-white p-5 rounded-t-2xl">
            <CardTitle className="text-sm font-bold uppercase tracking-wider font-sans">Publish Announcement</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Notice Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                  placeholder="e.g. Terminal Exam Timetable Post"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Announcement Target Audience</label>
                <select
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-955 focus:outline-none"
                  required
                >
                  <option value="all">All Roles (Teachers & Students)</option>
                  <option value="teacher">Teachers Only</option>
                  <option value="student">Students Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Announcement Content</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                  placeholder="Enter notice announcement details here..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isPublishing}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-10 px-5"
                >
                  {isPublishing ? 'Publishing...' : 'Publish Announcement'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {}
      {!showForm && (
        <div className="space-y-4">
          {notices?.length === 0 ? (
            <Card className="border-teal-100/50 bg-white">
              <CardContent className="py-10 text-center text-teal-800/40 text-sm font-medium">
                No active announcements posted.
              </CardContent>
            </Card>
          ) : (
            notices?.map((notice: any) => (
              <Card key={notice._id} className="border-teal-100/60 bg-white rounded-2xl shadow-sm overflow-hidden card-lift">
                <CardHeader className="bg-teal-50/30 px-6 py-4 border-b border-teal-100/50 flex justify-between items-center flex-row">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-teal-950">{notice.title}</CardTitle>
                    <div className="text-xs text-teal-800/50 font-semibold flex items-center gap-1">
                      <Calendar size={12} />
                      Published: {notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold uppercase rounded-full tracking-wider">
                      Audience: {notice.targetRole || 'All'}
                    </span>
                    {canPublish && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this notice?')) {
                            deleteNotice(notice._id)
                          }
                        }}
                        className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 rounded-xl"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-6 py-5 text-sm text-teal-900/80 leading-relaxed font-medium whitespace-pre-wrap">
                  {notice.content}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
