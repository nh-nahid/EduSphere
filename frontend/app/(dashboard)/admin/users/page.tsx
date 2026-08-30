'use client'
import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Users, Shield, RefreshCw } from 'lucide-react'

export default function AdminUsersPage() {
  const queryClient = useQueryClient()

  
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: () => api.get('/admin/users').then(r => r.data.data)
  })

  
  const { mutate: toggleStatus, isPending: isToggling } = useMutation({
    mutationFn: (userId: string) => api.patch(`/admin/users/${userId}/toggle`),
    onSuccess: () => {
      toast.success('User access status updated!')
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update user status')
    }
  })

  if (isLoading) {
    return <div className="text-teal-600 font-medium py-10 text-center">Loading system accounts...</div>
  }

  const columns = [
    {
      header: 'Account Holder',
      cell: (user: any) => (
        <div>
          <div className="font-semibold text-teal-950 font-sans">{user.name || 'N/A'}</div>
          <div className="text-teal-900/60 text-xs mt-0.5">{user.email}</div>
        </div>
      )
    },
    {
      header: 'Role Authority',
      cell: (user: any) => {
        const role = user.role || 'student'
        const pills: Record<string, string> = {
          super_admin: 'bg-purple-100 text-purple-700 border-purple-200',
          admin: 'bg-teal-100 text-teal-700 border-teal-200',
          teacher: 'bg-cyan-100 text-cyan-700 border-cyan-200',
          student: 'bg-amber-100 text-amber-700 border-amber-200'
        }
        return (
          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${pills[role]}`}>
            {role.replace('_', ' ')}
          </span>
        )
      }
    },
    {
      header: 'Contact',
      cell: (user: any) => <div className="font-mono text-sm text-teal-800">{user.phone || 'N/A'}</div>
    },
    {
      header: 'Access Status',
      cell: (user: any) => {
        const isActive = user.isActive !== false 
        return (
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
            {isActive ? 'Active' : 'Blocked'}
          </span>
        )
      }
    },
    {
      header: 'Actions',
      cell: (user: any) => {
        const isActive = user.isActive !== false
        return (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleStatus(user._id)}
              disabled={isToggling}
              className={`h-8 border font-medium rounded-xl text-xs px-3 transition-colors ${isActive ? 'border-rose-100 hover:bg-rose-50 text-rose-700' : 'border-emerald-100 hover:bg-emerald-50 text-emerald-700'}`}
            >
              <RefreshCw size={12} className="mr-1 shrink-0" />
              {isActive ? 'Block Account' : 'Activate Account'}
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {}
      <div className="px-1">
        <h2 className="text-xl font-bold text-teal-955 font-sans tracking-tight flex items-center gap-2">
          <Shield size={20} className="text-teal-600" />
          System User Accounts Administration
        </h2>
        <p className="text-xs text-teal-800/60 font-medium mt-1">
          Review, activate, or disable user profiles and permissions across the school registry.
        </p>
      </div>

      {}
      <DataTable
        data={users || []}
        columns={columns}
        emptyMessage="No system accounts registered in database."
      />
    </div>
  )
}
