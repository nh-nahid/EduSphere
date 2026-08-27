import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { smsApi } from './api';
export const useSmsLogs = (params?: any) => useQuery({ queryKey: ['sms', params], queryFn: () => smsApi.getLogs(params) });
export const useSendManualSms = () => { const qc = useQueryClient(); return useMutation({ mutationFn: smsApi.sendManual, onSuccess: () => qc.invalidateQueries({ queryKey: ['sms'] }) }); };
