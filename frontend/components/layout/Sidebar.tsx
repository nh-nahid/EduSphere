'use client'
import React from 'react'
import {
  LayoutDashboard, GraduationCap, UsersRound, School, BookOpen,
  ClipboardCheck, BarChart3, FileText, Bell, CreditCard,
  MessageSquare, Settings, Building2, LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'

// ── Nav ───────────────────────────────────────────────────────────────────────
const BASE_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Academic',
    items: [
      { href: '/students',    label: 'Students',    icon: GraduationCap  },
      { href: '/teachers',    label: 'Teachers',    icon: UsersRound     },
      { href: '/classes',     label: 'Classes',     icon: School         },
      { href: '/subjects',    label: 'Subjects',    icon: BookOpen       },
    ],
  },
  {
    label: 'Learning',
    items: [
      { href: '/attendance',  label: 'Attendance',  icon: ClipboardCheck },
      { href: '/grades',      label: 'Grades',      icon: BarChart3      },
      { href: '/assignments', label: 'Assignments', icon: FileText       },
      { href: '/notices',     label: 'Notices',     icon: Bell           },
    ],
  },
  {
    label: 'Finance',
    items: [{ href: '/fees', label: 'Fees', icon: CreditCard }],
  },
]

const ROLE_PILL: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  admin:       'bg-teal-100   text-teal-700',
  teacher:     'bg-cyan-100   text-cyan-700',
  student:     'bg-amber-100  text-amber-700',
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const school = user?.schoolId && typeof user.schoolId === 'object' ? user.schoolId : null

  const groups = [...BASE_GROUPS]

  if (user?.role === 'admin' || user?.role === 'super_admin') {
    groups.push({
      label: 'System',
      items: [
        { href: '/sms-logs',    label: 'SMS Logs', icon: MessageSquare },
        { href: '/admin/users', label: 'Admin',    icon: Settings      },
      ],
    })
  }
  if (user?.role === 'super_admin') {
    groups.push({
      label: 'Network',
      items: [{ href: '/schools', label: 'Schools', icon: Building2 }],
    })
  }

  return (
    <aside
      className="hidden md:flex w-[220px] h-screen flex-col shrink-0"
      style={{
        background:  'var(--sidebar-bg)',
        borderRight: '1.5px solid var(--sidebar-border-color)',
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div
        className="px-5 py-[18px] flex items-center gap-3"
        style={{ borderBottom: '1.5px solid var(--sidebar-border-color)' }}
      >
        {/* eBooi-style icon mark — open book inside a rounded square */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 brand-banner">
          <School size={15} className="text-white" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          {school?.name ? (
            <span className="font-bold text-[14px] tracking-tight truncate block" style={{ color: 'var(--sidebar-active-text)' }}>
              {school.name}
            </span>
          ) : (
            <>
              <span className="font-bold text-[15px] tracking-tight" style={{ color: 'var(--sidebar-active-text)' }}>
                School
              </span>
              <span className="font-bold text-[15px] tracking-tight text-teal-400">MS</span>
            </>
          )}
        </div>
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {groups.map(group => (
          <div key={group.label}>
            <p
              className="px-2 mb-2 text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ color: 'var(--sidebar-label)' }}
            >
              {group.label}
            </p>

            <div className="space-y-0.5">
              {group.items.map(item => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + '/')

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-150"
                    style={
                      active
                        ? {
                            background: 'var(--sidebar-active-bg)',
                            color:      'var(--sidebar-active-text)',
                            fontWeight: 600,
                          }
                        : { color: 'var(--sidebar-text)' }
                    }
                    onMouseEnter={e => {
                      if (!active) {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'var(--brand-50)'
                        el.style.color      = 'var(--sidebar-text-hover)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'transparent'
                        el.style.color      = 'var(--sidebar-text)'
                      }
                    }}
                  >
                    {/* Active pill indicator (eBooi-style left accent) */}
                    {active && (
                      <span
                        className="absolute left-0 inset-y-[6px] w-[3px] rounded-r-full"
                        style={{ background: 'var(--sidebar-active-dot)' }}
                      />
                    )}

                    {/* Icon in a tinted box when active */}
                    <span
                      className="w-6 h-6 flex items-center justify-center rounded-lg shrink-0 transition-colors"
                      style={
                        active
                          ? { background: 'var(--brand-200)', color: 'var(--brand-700)' }
                          : {}
                      }
                    >
                      <item.icon size={15} strokeWidth={active ? 2.3 : 1.8} />
                    </span>

                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div
        className="px-4 py-4 space-y-3"
        style={{ borderTop: '1.5px solid var(--sidebar-border-color)' }}
      >
        {/* User card — eBooi-style rounded info strip */}
        <Link
          href="/profile"
          className="flex items-center gap-3 px-2 py-2 rounded-xl group transition-colors hover:bg-teal-50"
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold uppercase shrink-0 text-white"
            style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
          >
            {user?.name?.[0] ?? 'U'}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="text-[13px] font-semibold truncate leading-tight group-hover:text-teal-700 transition-colors"
              style={{ color: 'var(--foreground)' }}
            >
              {user?.name ?? 'User'}
            </p>
            <span
              className={`inline-block mt-0.5 px-2 py-0 rounded-full text-[10px] font-semibold ${ROLE_PILL[user?.role ?? 'student']}`}
            >
              {user?.role?.replace('_', ' ') ?? 'role'}
            </span>
          </div>
        </Link>

        {/* Sign out */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150"
        >
          <LogOut size={14} strokeWidth={2} />
          Sign out
        </button>
      </div>
    </aside>
  )
}