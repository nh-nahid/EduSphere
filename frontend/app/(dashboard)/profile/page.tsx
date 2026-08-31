'use client'

import React, { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { User, Phone, Mail, Shield, Key, Edit, Save, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const { user, setUser } = useAuth()

  // Profile Info State
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Update Profile Info
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return toast.error('Name cannot be empty')

    setIsUpdatingInfo(true)
    try {
      const res = await api.put('/users/profile', { name, phone })
      if (res.data.success) {
        setUser({ ...user, ...res.data.data })
        toast.success('Profile details updated successfully!')
        setIsEditingInfo(false)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile details')
    } finally {
      setIsUpdatingInfo(false)
    }
  }

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) return toast.error('Please enter your current password')
    if (!newPassword) return toast.error('Please enter your new password')
    if (newPassword.length < 6) return toast.error('New password must be at least 6 characters')
    if (newPassword !== confirmPassword) return toast.error('New passwords do not match')

    setIsUpdatingPassword(true)
    try {
      const res = await api.put('/users/change-password', { currentPassword, newPassword })
      if (res.data.success) {
        toast.success('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  if (!user) {
    return <div className="text-center py-20 text-teal-600 font-medium">Loading profile credentials...</div>
  }

  const rolePills: Record<string, string> = {
    super_admin: 'bg-purple-50 text-purple-700 border-purple-100',
    admin: 'bg-teal-50 text-teal-700 border-teal-100',
    teacher: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    student: 'bg-amber-50 text-amber-700 border-amber-100'
  }

  const school = user.schoolId && typeof user.schoolId === 'object' ? user.schoolId : null

  return (
    <div className="space-y-6 max-w-4xl p-1">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-teal-955 font-sans tracking-tight">My Profile Settings</h2>
        <p className="text-xs text-teal-800/60 font-medium mt-1">
          Manage your personal details, credentials, and password security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-teal-100 bg-white rounded-2xl shadow-sm text-center p-6">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold uppercase text-white shadow-inner mb-4"
                style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }}>
                {user.name?.[0] ?? 'U'}
              </div>
              <h3 className="text-base font-bold text-teal-950 font-sans">{user.name}</h3>
              <p className="text-xs text-teal-800/50 font-medium mt-0.5">{user.email}</p>
              
              <div className="mt-4 flex flex-col gap-2 w-full">
                <span className={`px-3 py-1 text-xs font-bold rounded-full border mx-auto uppercase tracking-wide ${rolePills[user.role] || 'bg-teal-50 text-teal-700 border-teal-100'}`}>
                  {user.role.replace('_', ' ')}
                </span>
                {school?.name && (
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100/50 px-2 py-0.5 rounded-full mx-auto font-sans mt-1">
                    {school.name}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Editing details and password change */}
        <div className="md:col-span-2 space-y-6">
          {/* General Information Card */}
          <Card className="border-teal-100 bg-white rounded-2xl shadow-sm">
            <CardHeader className="border-b border-teal-50 px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-teal-950 flex items-center gap-2">
                <User size={16} className="text-teal-600" />
                Account Details
              </CardTitle>
              {!isEditingInfo && (
                <Button
                  onClick={() => {
                    setName(user.name)
                    setPhone(user.phone || '')
                    setIsEditingInfo(true)
                  }}
                  variant="outline"
                  size="sm"
                  className="h-8 border-teal-100 hover:bg-teal-50 text-teal-700 font-medium rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Edit size={12} />
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {isEditingInfo ? (
                <form onSubmit={handleUpdateInfo} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full p-2.5 bg-teal-50/30 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-teal-50/30 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingInfo(false)}
                      className="h-9 border-teal-100 text-teal-800 rounded-xl px-4 text-xs font-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdatingInfo}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-9 px-4 text-xs flex items-center gap-1.5"
                    >
                      <Save size={13} />
                      {isUpdatingInfo ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                      <User size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-800/40 uppercase tracking-wider block">Full Name</span>
                      <span className="text-sm font-semibold text-teal-950">{user.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                      <Mail size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-800/40 uppercase tracking-wider block">Email Address</span>
                      <span className="text-sm font-semibold text-teal-950">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-800/40 uppercase tracking-wider block">Phone Number</span>
                      <span className="text-sm font-semibold text-teal-950">{user.phone || 'Not Logged'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                      <Shield size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-800/40 uppercase tracking-wider block">Security Role</span>
                      <span className="text-sm font-semibold text-teal-950 capitalize">{user.role.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="border-teal-100 bg-white rounded-2xl shadow-sm">
            <CardHeader className="border-b border-teal-50 px-6 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-teal-950 flex items-center gap-2">
                <Key size={16} className="text-teal-600" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 bg-teal-50/30 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full p-2.5 bg-teal-50/30 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full p-2.5 bg-teal-50/30 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                      placeholder="Repeat new password"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-10 px-5 text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    {isUpdatingPassword ? 'Updating...' : 'Change Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
