'use client'
import React from 'react'
import { useFees, useInitiatePayment } from '../hooks'
import { useAuth } from '@/providers/AuthProvider'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { toast } from 'sonner'

export const FeeTable = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  
  const { data: adminFees, isLoading: isLoadingAdmin } = useFees()
  const { mutate: initiatePayment, isPending: isPaying } = useInitiatePayment()

  
  const { data: studentFees, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student-fees'],
    queryFn: () => api.get('/fees/student').then(r => r.data.data),
    enabled: !isAdmin
  })

  const handlePay = (feeId: string) => {
    initiatePayment(feeId, {
      onSuccess: (res: any) => {
        if (res.url) {
          toast.success('Redirecting to SSLCommerz payment page...')
          window.location.href = res.url
        } else {
          toast.error('Could not initiate payment session.')
        }
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Payment initiation failed')
      }
    })
  }

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      toast.success('Generating invoice...')
      const response = await api.get(`/payment/${paymentId}/invoice`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `receipt-${paymentId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch {
      toast.error('Failed to download invoice receipt.')
    }
  }

  if (isAdmin) {
    if (isLoadingAdmin) {
      return <div className="text-center py-10 text-teal-600 font-medium">Loading fees...</div>
    }

    const columns = [
      {
        header: 'Title',
        cell: (fee: any) => <div className="font-semibold text-teal-950">{fee.title || 'N/A'}</div>
      },
      {
        header: 'Type',
        cell: (fee: any) => <span className="capitalize font-medium text-sm">{fee.type || 'N/A'}</span>
      },
      {
        header: 'Amount',
        cell: (fee: any) => <div className="font-semibold text-teal-900">৳ {fee.amount || 0}</div>
      },
      {
        header: 'Due Date',
        cell: (fee: any) => (
          <div className="text-teal-955 text-sm">
            {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}
          </div>
        )
      },
      {
        header: 'Academic Year',
        cell: (fee: any) => <div className="text-xs font-mono text-teal-800">{fee.academicYear || 'N/A'}</div>
      }
    ]

    return (
      <div className="mt-4 space-y-4">
        <h2 className="text-xl font-bold text-teal-950">Active Fee Schedules</h2>
        <DataTable data={adminFees || []} columns={columns} emptyMessage="No fee schedules found." />
      </div>
    )
  }

  
  if (isLoadingStudent) {
    return <div className="text-center py-10 text-teal-600 font-medium">Loading your fees...</div>
  }

  const studentColumns = [
    {
      header: 'Fee Title',
      cell: (item: any) => <div className="font-semibold text-teal-950">{item.fee?.title || 'N/A'}</div>
    },
    {
      header: 'Type',
      cell: (item: any) => <span className="capitalize font-medium text-sm">{item.fee?.type || 'N/A'}</span>
    },
    {
      header: 'Amount',
      cell: (item: any) => <div className="font-semibold text-teal-900">৳ {item.fee?.amount || 0}</div>
    },
    {
      header: 'Due Date',
      cell: (item: any) => (
        <div className="text-teal-955 text-sm">
          {item.fee?.dueDate ? new Date(item.fee?.dueDate).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    {
      header: 'Status',
      cell: (item: any) => {
        const isPaid = item.paymentStatus === 'paid'
        return (
          <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
            {item.paymentStatus || 'Pending'}
          </span>
        )
      }
    },
    {
      header: 'Actions',
      cell: (item: any) => {
        const isPaid = item.paymentStatus === 'paid'
        if (isPaid) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadInvoice(item.payment?._id)}
              className="h-8 border-teal-100 hover:bg-teal-50 text-teal-700"
            >
              Receipt (PDF)
            </Button>
          )
        } else {
          return (
            <Button
              onClick={() => handlePay(item.fee?._id)}
              disabled={isPaying}
              className="h-8 bg-teal-600 hover:bg-teal-700 text-white"
            >
              Pay Now (SSLCommerz)
            </Button>
          )
        }
      }
    }
  ]

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-xl font-bold text-teal-950 font-sans">My Tuition & Other Fees</h2>
      <DataTable data={studentFees || []} columns={studentColumns} emptyMessage="No fees registered for your class." />
    </div>
  )
}
