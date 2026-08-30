'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Bell, Search, X, Calendar, GraduationCap, UsersRound, School } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { useNotices } from '@/features/notices/hooks'
import { useStudents } from '@/features/students/hooks'
import { useTeachers } from '@/features/teachers/hooks'
import { useClasses } from '@/features/classes/hooks'
import Link from 'next/link'

function buildTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const raw = segments[segments.length - 1] ?? 'dashboard'
  return raw.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  
  const title = buildTitle(pathname)
  const school = user?.schoolId && typeof user.schoolId === 'object' ? user.schoolId : null

  
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  
  const { data: notices } = useNotices()
  const { data: students } = useStudents()
  const { data: teachers } = useTeachers()
  const { data: classes } = useClasses()

  const notifRef = useRef<HTMLDivElement>(null)

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  
  useEffect(() => {
    setIsSearchOpen(false)
    setIsNotifOpen(false)
    setSearchQuery('')
  }, [pathname])

  
  const query = searchQuery.trim().toLowerCase()
  const matchedStudents = query
    ? students?.filter((s: any) => s.userId?.name?.toLowerCase().includes(query)) || []
    : []
  const matchedTeachers = query
    ? teachers?.filter((t: any) => t.userId?.name?.toLowerCase().includes(query)) || []
    : []
  const matchedClasses = query
    ? classes?.filter((c: any) => c.name?.toLowerCase().includes(query)) || []
    : []

  const hasResults = matchedStudents.length > 0 || matchedTeachers.length > 0 || matchedClasses.length > 0

  return (
    <header
      className="h-14 flex items-center justify-between px-6 shrink-0 bg-white relative"
      style={{ borderBottom: '1.5px solid var(--border)' }}
    >
      {}
      <div className="flex items-center gap-2.5">
        <h1 className="text-[15px] font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
          {title}
        </h1>
        {school?.name && (
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold bg-teal-50 border border-teal-100 text-teal-700 rounded-full font-sans">
            {school.name}
          </span>
        )}
      </div>

      {}
      <div className="flex items-center gap-1">
        {}
        <button
          aria-label="Search"
          onClick={() => setIsSearchOpen(true)}
          className="p-2 rounded-xl transition-colors hover:bg-teal-50 text-teal-650"
        >
          <Search size={16} strokeWidth={2} />
        </button>

        {}
        <div className="relative" ref={notifRef}>
          <button
            aria-label="Notifications"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl transition-colors hover:bg-teal-50 text-teal-650"
          >
            <Bell size={16} strokeWidth={2} />
            {notices && notices.length > 0 && (
              <span className="absolute top-[6px] right-[6px] w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            )}
          </button>

          {}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-teal-100/60 rounded-2xl shadow-xl overflow-hidden z-50 py-1">
              <div className="px-4 py-2.5 border-b border-teal-50 bg-teal-50/20 flex justify-between items-center">
                <span className="text-xs font-bold text-teal-950 uppercase tracking-wider">Announcements</span>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{notices?.length || 0} Total</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-teal-50">
                {notices && notices.length > 0 ? (
                  notices.slice(0, 3).map((notice: any) => (
                    <Link
                      key={notice._id}
                      href="/notices"
                      className="block p-4 hover:bg-teal-50/20 transition-colors space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-teal-950 truncate">{notice.title}</h4>
                      <p className="text-xs text-teal-900/60 leading-relaxed line-clamp-2">{notice.content}</p>
                      <div className="text-[10px] font-semibold text-teal-700/60 flex items-center gap-1">
                        <Calendar size={10} />
                        {notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-teal-800/40 font-medium">No announcements published.</div>
                )}
              </div>
              <div className="border-t border-teal-50 p-2 text-center bg-teal-50/10">
                <Link
                  href="/notices"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 block"
                >
                  View All Notices
                </Link>
              </div>
            </div>
          )}
        </div>

        {}
        <div className="mx-2 h-4 w-px bg-teal-100/60" />

        {}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-colors hover:bg-teal-50 group"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold uppercase text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
          >
            {user?.name?.[0] ?? 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold leading-tight text-teal-950 group-hover:text-teal-700 transition-colors">
              {user?.name ?? 'User'}
            </p>
          </div>
        </Link>
      </div>

      {}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-teal-950/20 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-lg bg-white border border-teal-100/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[480px]">
            {}
            <div className="p-4 border-b border-teal-100 flex items-center gap-3">
              <Search size={18} className="text-teal-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search students, teachers, or classes..."
                className="flex-1 bg-transparent border-none text-sm text-teal-950 font-medium placeholder-teal-800/40 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg hover:bg-teal-50 text-teal-800/50"
              >
                <X size={16} />
              </button>
            </div>

            {}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {searchQuery ? (
                hasResults ? (
                  <>
                    {}
                    {matchedStudents.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-teal-800/45 uppercase tracking-wider block px-2.5">Students</span>
                        {matchedStudents.map((student: any) => (
                          <Link
                            key={student._id}
                            href={`/students/${student._id}`}
                            className="flex items-center justify-between p-2.5 hover:bg-teal-50/50 rounded-xl transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <GraduationCap size={15} className="text-teal-600 shrink-0" />
                              <span className="text-sm font-semibold text-teal-950">{student.userId?.name}</span>
                            </div>
                            <span className="text-xs text-teal-900/60">Roll {student.roll || 'N/A'}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {}
                    {matchedTeachers.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-teal-800/45 uppercase tracking-wider block px-2.5">Teachers</span>
                        {matchedTeachers.map((teacher: any) => (
                          <Link
                            key={teacher._id}
                            href={`/teachers/${teacher._id}`}
                            className="flex items-center justify-between p-2.5 hover:bg-teal-50/50 rounded-xl transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <UsersRound size={15} className="text-teal-600 shrink-0" />
                              <span className="text-sm font-semibold text-teal-950">{teacher.userId?.name}</span>
                            </div>
                            <span className="text-xs text-teal-900/60 font-medium italic">{teacher.qualification || 'Instructor'}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {}
                    {matchedClasses.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-teal-800/45 uppercase tracking-wider block px-2.5">Classes</span>
                        {matchedClasses.map((cls: any) => (
                          <Link
                            key={cls._id}
                            href={`/classes/${cls._id}`}
                            className="flex items-center justify-between p-2.5 hover:bg-teal-50/50 rounded-xl transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <School size={15} className="text-teal-600 shrink-0" />
                              <span className="text-sm font-semibold text-teal-950">{cls.name}</span>
                            </div>
                            <span className="text-xs text-teal-900/60 font-semibold">Section {cls.section || 'A'}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-8 text-center text-xs text-teal-800/40 font-medium">No results match your search query.</div>
                )
              ) : (
                <div className="py-8 text-center text-xs text-teal-800/40 font-medium">
                  Type a student name, instructor name, or class level to search the database.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}