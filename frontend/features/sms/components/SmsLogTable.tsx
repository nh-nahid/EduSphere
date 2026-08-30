'use client'
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/shared/DataTable'
import { toast } from 'sonner'
import { MessageSquare, Send, Calendar, CheckCircle, XCircle, Zap } from 'lucide-react'

const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

const MESSAGE_TEMPLATES = [
  {
    label: '🔴 Absent',
    event: 'absence',
    color: 'border-rose-100 hover:bg-rose-50 text-rose-700',
    text: `📚 Attendance Alert — SchoolMS\n\nDear Parent/Guardian,\n\nThis is to inform you that your child was marked ABSENT from school today, ${today}.\n\nIf this is a mistake or your child is unwell, please contact the school office at your earliest convenience.\n\nThank you for your cooperation.\n— School Administration`
  },
  {
    label: '🕐 Late',
    event: 'absence',
    color: 'border-amber-100 hover:bg-amber-50 text-amber-700',
    text: `⏰ Late Arrival Alert — SchoolMS\n\nDear Parent/Guardian,\n\nYour child arrived LATE to school today, ${today}. Punctuality is important for academic performance.\n\nPlease ensure your child arrives on time.\n\nThank you.\n— School Administration`
  },
  {
    label: '💳 Fee Due',
    event: 'fee_due',
    color: 'border-orange-100 hover:bg-orange-50 text-orange-700',
    text: `💳 Fee Payment Reminder — SchoolMS\n\nDear Parent/Guardian,\n\nThis is a friendly reminder that your child's school fee is DUE. Please make the payment at the earliest to avoid any late charges.\n\nFor payment queries, contact the school accounts office.\n\nThank you.\n— School Administration`
  },
  {
    label: '✅ Fee Paid',
    event: 'fee_paid',
    color: 'border-emerald-100 hover:bg-emerald-50 text-emerald-700',
    text: `✅ Fee Payment Confirmed — SchoolMS\n\nDear Parent/Guardian,\n\nWe have successfully received your child's school fee payment. Thank you for your timely payment.\n\nYou may collect your receipt from the school office.\n\nThank you.\n— School Administration`
  },
  {
    label: '📝 Exam',
    event: 'notice',
    color: 'border-indigo-100 hover:bg-indigo-50 text-indigo-700',
    text: `📝 Exam Schedule Notice — SchoolMS\n\nDear Parent/Guardian,\n\nPlease be informed that your child's examinations are scheduled to begin soon. Kindly ensure your child is well-prepared and has all necessary stationery.\n\nExam schedule details are available from the school office.\n\nBest regards.\n— School Administration`
  },
  {
    label: '🏠 Holiday',
    event: 'notice',
    color: 'border-teal-100 hover:bg-teal-50 text-teal-700',
    text: `🏖️ School Holiday Notice — SchoolMS\n\nDear Parent/Guardian,\n\nPlease be informed that school will be CLOSED on ${today} due to a public holiday. Classes will resume on the next working day.\n\nThank you for your understanding.\n— School Administration`
  },
  {
    label: '📊 Result',
    event: 'grade',
    color: 'border-purple-100 hover:bg-purple-50 text-purple-700',
    text: `📊 Exam Result Published — SchoolMS\n\nDear Parent/Guardian,\n\nYour child's exam results have been published and are now available for review on the school portal.\n\nPlease visit the school office or log in to SchoolMS to view the detailed result.\n\nThank you.\n— School Administration`
  },
  {
    label: '🎓 Admission',
    event: 'admission',
    color: 'border-cyan-100 hover:bg-cyan-50 text-cyan-700',
    text: `🎓 Admission Confirmation — SchoolMS\n\nDear Parent/Guardian,\n\nWe are pleased to confirm your child's ADMISSION to our institution. Welcome to the SchoolMS family!\n\nPlease visit the school office with required documents to complete the enrollment process.\n\nWarm regards.\n— School Administration`
  }
]

export const SmsLogTable = () => {
  const queryClient = useQueryClient()
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [showSendForm, setShowSendForm] = useState(false)

  
  const { data: logs, isLoading } = useQuery({
    queryKey: ['sms-logs'],
    queryFn: () => api.get('/sms/logs').then(r => r.data.data)
  })

  
  const { mutate: sendSms, isPending: isSending } = useMutation({
    mutationFn: (payload: { phone: string; message: string }) => api.post('/sms/send', payload),
    onSuccess: (res) => {
      const msg = res.data?.message || 'SMS dispatched.'
      if (res.data?.success) {
        toast.success(msg)
      } else {
        toast.error(msg)
      }
      setPhone('')
      setMessage('')
      setShowSendForm(false)
      queryClient.invalidateQueries({ queryKey: ['sms-logs'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to dispatch SMS')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return toast.error('Please enter a recipient phone number')
    if (!message) return toast.error('Please enter a message body')
    sendSms({ phone, message })
  }

  if (isLoading) {
    return <div className="text-teal-600 font-medium py-10 text-center">Loading message logs...</div>
  }

  const columns = [
    {
      header: 'Recipient Phone',
      cell: (log: any) => <div className="font-mono text-sm font-semibold text-teal-950">{log.recipient || 'N/A'}</div>
    },
    {
      header: 'Event Trigger',
      cell: (log: any) => {
        const event = log.event || 'general'
        const badges: Record<string, string> = {
          absence: 'bg-rose-50 text-rose-700 border-rose-100',
          notice: 'bg-teal-50 text-teal-700 border-teal-100',
          grade: 'bg-indigo-50 text-indigo-700 border-indigo-100',
          fee_due: 'bg-amber-50 text-amber-700 border-amber-100',
          fee_paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          admission: 'bg-purple-50 text-purple-700 border-purple-100'
        }
        return (
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border capitalize ${badges[event] || 'bg-teal-50 border-teal-100 text-teal-700'}`}>
            {event.replace('_', ' ')}
          </span>
        )
      }
    },
    {
      header: 'Message Body',
      cell: (log: any) => <div className="text-teal-950/80 text-xs max-w-xs font-sans truncate" title={log.message}>{log.message}</div>
    },
    {
      header: 'Status',
      cell: (log: any) => {
        const isSent = log.status === 'sent'
        return (
          <div className="flex items-center gap-1 font-semibold text-xs capitalize">
            {isSent ? (
              <>
                <CheckCircle size={14} className="text-emerald-500" />
                <span className="text-emerald-700">Sent</span>
              </>
            ) : (
              <>
                <XCircle size={14} className="text-rose-500" />
                <span className="text-rose-700">Failed</span>
              </>
            )}
          </div>
        )
      }
    },
    {
      header: 'Timestamp',
      cell: (log: any) => (
        <div className="text-xs text-teal-800/60 font-semibold flex items-center gap-1">
          <Calendar size={12} />
          {log.sentAt ? new Date(log.sentAt).toLocaleString() : 'N/A'}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold text-teal-955 font-sans tracking-tight flex items-center gap-2">
          <MessageSquare size={20} className="text-teal-600" />
          SMS Notification Logs
        </h2>
        <Button
          onClick={() => setShowSendForm(!showSendForm)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-9 px-4 flex items-center gap-1.5"
        >
          <Send size={14} />
          {showSendForm ? 'View Logs' : 'Send Manual SMS'}
        </Button>
      </div>

      {}
      {showSendForm && (
        <Card className="border-teal-100 bg-white rounded-2xl shadow-sm max-w-md">
          <CardHeader className="brand-banner text-white p-5 rounded-t-2xl">
            <CardTitle className="text-sm font-bold uppercase tracking-wider font-sans">Dispatch WhatsApp Alert</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Recipient Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 font-mono focus:outline-none"
                  placeholder="e.g. 01711000000"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={11} className="text-teal-600" />
                  Quick Templates
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MESSAGE_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => setMessage(tpl.text)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${tpl.color}`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-teal-900 uppercase tracking-wider block">Message Content</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-955 focus:outline-none resize-none"
                  placeholder="Type WhatsApp message (up to 4096 characters)..."
                  rows={6}
                  maxLength={4096}
                  required
                />
                <div className="flex justify-between items-center mt-1 px-0.5">
                  <span className="text-[10px] text-teal-800/40">WhatsApp supports up to 4096 characters</span>
                  <span className={`text-[10px] font-semibold ${message.length > 3800 ? 'text-rose-500' : 'text-teal-800/50'}`}>
                    {message.length} / 4096
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSending}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl h-10 px-5"
                >
                  {isSending ? 'Sending alert...' : 'Dispatch Alert'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {}
      {!showSendForm && (
        <DataTable
          data={logs || []}
          columns={columns}
          emptyMessage="No SMS logs recorded in database."
        />
      )}
    </div>
  )
}
