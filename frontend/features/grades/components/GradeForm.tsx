'use client'
import React, { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useClasses } from '@/features/classes/hooks'
import { useStudents } from '@/features/students/hooks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gradesApi } from '../api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/shared/DataTable'
import { toast } from 'sonner'
import { Award, BookOpen, AlertTriangle } from 'lucide-react'
import api from '@/lib/axios'

export const GradeForm = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'

  const queryClient = useQueryClient()

  // ── Teacher/Admin Form States ──
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [examType, setExamType] = useState('first_term')
  const [marks, setMarks] = useState('')
  const [totalMarks, setTotalMarks] = useState('100')
  const [remarks, setRemarks] = useState('')

  // Fetch classes for drop-down
  const { data: classes } = useClasses()

  // Dynamic subjects query based on selected class
  const { data: subjects } = useQuery({
    queryKey: ['subjects-class', selectedClassId],
    queryFn: async () => {
      const res = await api.get('/subjects')
      return res.data.data?.filter((s: any) => {
        const classIdVal = typeof s.classId === 'object' && s.classId ? s.classId._id : s.classId
        return classIdVal === selectedClassId
      }) || []
    },
    enabled: !!selectedClassId
  })

  // Dynamic students query based on selected class
  const { data: students } = useQuery({
    queryKey: ['students-class-grades', selectedClassId],
    queryFn: async () => {
      const res = await api.get('/students', { params: { classId: selectedClassId } })
      return res.data.data || []
    },
    enabled: !!selectedClassId
  })

  // ── Student Mode Queries ──
  const { data: myProfile } = useQuery({
    queryKey: ['student-profile-grades'],
    queryFn: () => api.get('/students/my').then(r => r.data.data),
    enabled: isStudent
  })

  const { data: studentGrades, isLoading: isLoadingStudentGrades } = useQuery({
    queryKey: ['my-grades', myProfile?._id],
    queryFn: () => gradesApi.getStudentGrades(myProfile._id),
    enabled: !!myProfile?._id
  })

  // Record Grade Mutation
  const { mutate: submitGrade, isPending: isSaving } = useMutation({
    mutationFn: (payload: any) => gradesApi.record(payload),
    onSuccess: () => {
      toast.success('Grade recorded successfully!')
      setMarks('')
      setRemarks('')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit grade')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClassId) return toast.error('Please select a class')
    if (!selectedSubjectId) return toast.error('Please select a subject')
    if (!selectedStudentId) return toast.error('Please select a student')

    submitGrade({
      studentId: selectedStudentId,
      subjectId: selectedSubjectId,
      examType,
      marks: Number(marks),
      totalMarks: Number(totalMarks),
      remarks
    })
  }

  // ── Student View ──
  if (isStudent) {
    if (isLoadingStudentGrades) {
      return <div className="text-teal-600 font-medium py-10 text-center">Loading grades card...</div>
    }

    const columns = [
      {
        header: 'Subject',
        cell: (item: any) => <div className="font-semibold text-teal-950">{item.subjectId?.name || 'N/A'}</div>
      },
      {
        header: 'Exam Session',
        cell: (item: any) => <span className="capitalize font-medium text-teal-800 text-sm">{item.examType?.replace('_', ' ') || 'N/A'}</span>
      },
      {
        header: 'Score Marks',
        cell: (item: any) => <div className="font-mono text-sm text-teal-900 font-bold">{item.marks} / {item.totalMarks}</div>
      },
      {
        header: 'Grade Grade',
        cell: (item: any) => {
          const score = (item.marks / item.totalMarks) * 100
          let gradeLetter = 'F'
          let color = 'bg-rose-50 text-rose-700 border-rose-100'
          if (score >= 90) { gradeLetter = 'A+'; color = 'bg-emerald-50 text-emerald-700 border-emerald-100'; }
          else if (score >= 80) { gradeLetter = 'A'; color = 'bg-emerald-50 text-emerald-700 border-emerald-100'; }
          else if (score >= 70) { gradeLetter = 'A-'; color = 'bg-teal-50 text-teal-700 border-teal-100'; }
          else if (score >= 60) { gradeLetter = 'B'; color = 'bg-indigo-50 text-indigo-700 border-indigo-100'; }
          else if (score >= 50) { gradeLetter = 'C'; color = 'bg-amber-50 text-amber-700 border-amber-100'; }
          else if (score >= 40) { gradeLetter = 'D'; color = 'bg-amber-50 text-amber-700 border-amber-100'; }

          return (
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${color}`}>
              {gradeLetter}
            </span>
          )
        }
      },
      {
        header: 'Remarks',
        cell: (item: any) => <div className="text-teal-900/60 text-xs italic">{item.remarks || 'No remarks recorded.'}</div>
      }
    ]

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-teal-955 font-sans">Academic Performance Ledger</h2>
        <DataTable data={studentGrades || []} columns={columns} emptyMessage="No grades logs published yet." />
      </div>
    )
  }

  // ── Teacher/Admin View ──
  return (
    <div className="space-y-6 max-w-xl">
      <Card className="border-teal-100 bg-white rounded-2xl shadow-sm">
        <CardHeader className="brand-banner text-white p-5 rounded-t-2xl">
          <CardTitle className="text-lg font-bold font-sans tracking-tight">Record Student Grades</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Class Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Class Room</label>
              <select
                value={selectedClassId}
                onChange={e => {
                  setSelectedClassId(e.target.value)
                  setSelectedSubjectId('')
                  setSelectedStudentId('')
                }}
                className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-955 focus:outline-none focus:ring-1 focus:ring-teal-400"
                required
              >
                <option value="">Select Class Section</option>
                {classes?.map((c: any) => (
                  <option key={c._id} value={c._id}>
                    {c.name} - {c.section} ({c.academicYear})
                  </option>
                ))}
              </select>
            </div>

            {selectedClassId && (
              <>
                {/* Subject Selection */}
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
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Enrolled Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-955 focus:outline-none"
                    required
                  >
                    <option value="">Select Student</option>
                    {students?.map((s: any) => (
                      <option key={s._id} value={s._id}>
                        Roll {s.roll} - {s.userId?.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exam Session Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Exam Category</label>
                  <select
                    value={examType}
                    onChange={e => setExamType(e.target.value)}
                    className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-955 focus:outline-none"
                    required
                  >
                    <option value="first_term">First Term Examination</option>
                    <option value="second_term">Second Term Examination</option>
                    <option value="final">Final Examination</option>
                    <option value="unit_test">Class Unit Test</option>
                  </select>
                </div>

                {/* Marks input */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Score Obtained</label>
                    <input
                      type="number"
                      value={marks}
                      onChange={e => setMarks(e.target.value)}
                      className="w-full p-2 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-955 focus:outline-none"
                      placeholder="e.g. 85"
                      min={0}
                      max={Number(totalMarks) || 100}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Out Of (Total)</label>
                    <input
                      type="number"
                      value={totalMarks}
                      onChange={e => setTotalMarks(e.target.value)}
                      className="w-full p-2 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-955 focus:outline-none"
                      placeholder="e.g. 100"
                      min={1}
                      required
                    />
                  </div>
                </div>

                {/* Remarks field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Instructor Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                    placeholder="Provide performance feedback..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-10 px-5"
                  >
                    {isSaving ? 'Recording Grade...' : 'Publish Grade'}
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
