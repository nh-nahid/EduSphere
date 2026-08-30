'use client'
import React, { useState } from 'react'
import { useSchools, useCreateSchool, useToggleSchoolStatus } from '../hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/shared/DataTable'
import { toast } from 'sonner'
import { Building2, Plus, Calendar, RefreshCw } from 'lucide-react'

export const SchoolTable = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [plan, setPlan] = useState('basic')

  
  const { data: schools, isLoading } = useSchools()
  const { mutate: createSchool, isPending: isCreating } = useCreateSchool()
  const { mutate: toggleSchool, isPending: isToggling } = useToggleSchoolStatus()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return toast.error('Please enter school name')
    
    createSchool({
      name,
      email,
      phone,
      address,
      plan
    }, {
      onSuccess: () => {
        toast.success('School added to system registry!')
        setName('')
        setEmail('')
        setPhone('')
        setAddress('')
        setPlan('basic')
        setShowAddForm(false)
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to register school')
      }
    })
  }

  const handleToggle = (id: string) => {
    toggleSchool(id, {
      onSuccess: () => {
        toast.success('School status updated successfully!')
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to toggle status')
      }
    })
  }

  if (isLoading) {
    return <div className="text-teal-600 font-medium py-10 text-center">Loading school network registry...</div>
  }

  const columns = [
    {
      header: 'School Institution',
      cell: (sch: any) => (
        <div>
          <div className="font-semibold text-teal-950 font-sans">{sch.name || 'N/A'}</div>
          <div className="text-teal-900/60 text-xs mt-0.5">{sch.address || 'No address logged'}</div>
        </div>
      )
    },
    {
      header: 'Slug Alias',
      cell: (sch: any) => <span className="font-mono text-xs text-teal-800 font-semibold">{sch.slug || 'N/A'}</span>
    },
    {
      header: 'Sub Plan',
      cell: (sch: any) => {
        const p = sch.plan || 'basic'
        const color = p === 'pro' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-teal-50 text-teal-700 border-teal-100'
        return (
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border uppercase tracking-wider ${color}`}>
            {p}
          </span>
        )
      }
    },
    {
      header: 'Network Status',
      cell: (sch: any) => {
        const active = sch.isActive !== false
        return (
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
            {active ? 'Active' : 'Suspended'}
          </span>
        )
      }
    },
    {
      header: 'Registered',
      cell: (sch: any) => (
        <div className="text-xs text-teal-800/60 font-semibold flex items-center gap-1">
          <Calendar size={12} />
          {sch.createdAt ? new Date(sch.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    {
      header: 'Actions',
      cell: (sch: any) => {
        const active = sch.isActive !== false
        return (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggle(sch._id)}
              disabled={isToggling}
              className={`h-8 border font-medium rounded-xl text-xs px-3 transition-colors ${active ? 'border-rose-100 hover:bg-rose-50 text-rose-700' : 'border-emerald-100 hover:bg-emerald-50 text-emerald-700'}`}
            >
              <RefreshCw size={12} className="mr-1 shrink-0" />
              {active ? 'Suspend' : 'Activate'}
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {}
      <div className="flex justify-between items-center px-1">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-teal-955 font-sans tracking-tight flex items-center gap-2">
            <Building2 size={20} className="text-teal-600" />
            School Network Administration
          </h2>
          <p className="text-xs text-teal-800/60 font-medium">
            Manage global school licenses, plans, and active tenant nodes.
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-9 px-4 flex items-center gap-1.5"
        >
          <Plus size={15} />
          {showAddForm ? 'View Registry' : 'Register School'}
        </Button>
      </div>

      {}
      {showAddForm && (
        <Card className="border-teal-100 bg-white rounded-2xl shadow-sm max-w-xl">
          <CardHeader className="brand-banner text-white p-5 rounded-t-2xl">
            <CardTitle className="text-sm font-bold uppercase tracking-wider font-sans">Register New School Tenant</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">School Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                  placeholder="e.g. Green Valley Academy"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                    placeholder="e.g. info@greenvalley.edu.bd"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 font-mono focus:outline-none"
                    placeholder="e.g. 02-9112233"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Subscription Plan</label>
                <select
                  value={plan}
                  onChange={e => setPlan(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm font-semibold text-teal-955 focus:outline-none"
                  required
                >
                  <option value="basic">Basic License Plan</option>
                  <option value="pro">Pro Enterprise Plan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Physical Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none"
                  placeholder="Street address, City..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-10 px-5"
                >
                  {isCreating ? 'Registering...' : 'Register School'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {}
      {!showAddForm && (
        <DataTable
          data={schools || []}
          columns={columns}
          emptyMessage="No schools registered in network registry."
        />
      )}
    </div>
  )
}
