const axios = require('axios');
const SmsLog = require('../models/SmsLog');


exports.sendSms = async (phone, message, { event, studentId, schoolId } = {}) => {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  
  let to = phone.replace(/[\s+-]/g, '');
  if (to.startsWith('0')) {
    to = '880' + to.substring(1);
  }

  if (!token || !phoneId) {
    console.warn('[WhatsApp] Credentials not configured — message skipped. Set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID in .env');
    try {
      await SmsLog.create({
        recipient: phone,
        message,
        event: event || 'general',
        status: 'failed',
        studentId: studentId || null,
        schoolId: schoolId || null,
        sentAt: new Date()
      });
    } catch (_) {}
    return;
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    await SmsLog.create({
      recipient: phone,
      message,
      event: event || 'general',
      status: 'sent',
      studentId: studentId || null,
      schoolId: schoolId || null,
      sentAt: new Date()
    });

    console.log(`[WhatsApp] Message sent to ${phone}`);
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    console.error('[WhatsApp] Send failed:', errMsg);
    try {
      await SmsLog.create({
        recipient: phone,
        message,
        event: event || 'general',
        status: 'failed',
        studentId: studentId || null,
        schoolId: schoolId || null,
        sentAt: new Date()
      });
    } catch (logErr) {
      console.error('[WhatsApp] Log error:', logErr.message);
    }
  }
};