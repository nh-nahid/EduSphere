'use client'
import React, { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useClasses } from '@/features/classes/hooks'
import { useStudents } from '@/features/students/hooks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { attendanceApi } from '../api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/shared/DataTable'
import { toast } from 'sonner'
import { Calendar as CalendarIcon, Check, X, AlertTriangle } from 'lucide-react'

export const AttendanceSheet = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'

  const queryClient = useQueryClient()

  
  const [selectedClassId, setSelectedClassId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'present' | 'absent' | 'late'>>({})

  
  const { data: classes } = useClasses()

  
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students-class', selectedClassId],
    queryFn: () => apiGetStudentsByClass(selectedClassId),
    enabled: !!selectedClassId
  })

  async function apiGetStudentsByClass(classId: string) {
    const res = await fetch(`http://localhost:5000/api/v1/students?classId=${classId}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    const body = await res.json()
    return body.data || []
  }

  
  const { data: studentAttendance, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['my-attendance'],
    queryFn: () => attendanceApi.getMy(),
    enabled: isStudent
  })

  
  const { mutate: submitAttendance, isPending: isSaving } = useMutation({
    mutationFn: (payload: any) => attendanceApi.mark(payload),
    onSuccess: () => {
      toast.success('Attendance recorded successfully!')
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit attendance')
    }
  })

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClassId) return toast.error('Please select a class')

    const records = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      studentId,
      status
    }))

    if (records.length === 0) return toast.error('No attendance records logged')

    submitAttendance({
      classId: selectedClassId,
      date,
      records
    })
  }

  
  if (isStudent) {
    if (isLoadingStudent) {
      return <div className="text-teal-600 font-medium py-10 text-center">Loading attendance history...</div>
    }

    const columns = [
      {
        header: 'Date',
        cell: (item: any) => <div className="text-sm font-semibold font-sans">{new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
      },
      {
        header: 'Status',
        cell: (item: any) => {
          const status = item.status || 'absent'
          const badges: Record<string, string> = {
            present: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            absent: 'bg-rose-50 text-rose-700 border-rose-100',
            late: 'bg-amber-50 text-amber-700 border-amber-100'
          }
          return (
            <span className={`px-3 py-1 text-xs font-bold rounded-full border capitalize ${badges[status]}`}>
              {status}
            </span>
          )
        }
      }
    ]

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-teal-950 font-sans">My Attendance Log</h2>
        <DataTable data={studentAttendance || []} columns={columns} emptyMessage="No attendance logs registered." />
      </div>
    )
  }

  
  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="border-teal-100 bg-white rounded-2xl shadow-sm">
        <CardHeader className="brand-banner text-white p-5 rounded-t-2xl">
          <CardTitle className="text-lg font-bold font-sans tracking-tight">Record Class Attendance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Target Class</label>
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-950 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  required
                >
                  <option value="">Select a Class Section</option>
                  {classes?.map((c: any) => (
                    <option key={c._id} value={c._id}>
                      {c.name} - {c.section} ({c.academicYear})
                    </option>
                  ))}
                </select>
              </div>

              {}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Attendance Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full p-2 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-950 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  required
                />
              </div>
            </div>

            {selectedClassId && (
              <div className="space-y-4">
                <div className="border-t border-teal-50 pt-4 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-teal-955 uppercase tracking-wider">Student Roster</h3>
                  <span className="text-xs text-teal-700/60 font-semibold">{students?.length || 0} Registered Students</span>
                </div>

                {isLoadingStudents ? (
                  <div className="text-teal-600 font-medium py-6 text-center text-sm">Loading rosters...</div>
                ) : (
                  <div className="border border-teal-100/50 rounded-2xl overflow-hidden bg-white">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-teal-50/50 border-b border-teal-100">
                          <th className="p-3 text-left text-xs font-bold text-teal-950 uppercase tracking-wider">Roll</th>
                          <th className="p-3 text-left text-xs font-bold text-teal-950 uppercase tracking-wider">Student Name</th>
                          <th className="p-3 text-right text-xs font-bold text-teal-950 uppercase tracking-wider">Status Log</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students?.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="p-6 text-center text-sm text-teal-800/40 font-medium">No students enrolled in this class.</td>
                          </tr>
                        ) : (
                          students?.map((student: any) => {
                            const status = attendanceRecords[student._id]
                            return (
                              <tr key={student._id} className="border-b border-teal-50 hover:bg-teal-50/20">
                                <td className="p-3 font-mono text-sm text-teal-800 font-semibold">{student.roll || '00'}</td>
                                <td className="p-3 font-semibold text-teal-950 text-sm">{student.userId?.name || 'N/A'}</td>
                                <td className="p-3 text-right">
                                  <div className="inline-flex gap-1">
                                    {(['present', 'absent', 'late'] as const).map(option => {
                                      const isActive = status === option
                                      const colors: Record<string, string> = {
                                        present: isActive ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-50 text-emerald-600',
                                        absent: isActive ? 'bg-rose-500 text-white' : 'hover:bg-rose-50 text-rose-600',
                                        late: isActive ? 'bg-amber-500 text-white' : 'hover:bg-amber-50 text-amber-600'
                                      }
                                      return (
                                        <button
                                          key={option}
                                          type="button"
                                          onClick={() => handleStatusChange(student._id, option)}
                                          className={`px-3 py-1 text-xs font-bold rounded-xl border border-transparent transition-all capitalize ${colors[option]}`}
                                        >
                                          {option}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving || !students?.length}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-10 px-5"
                  >
                    {isSaving ? 'Submitting Log...' : 'Record Roster'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
