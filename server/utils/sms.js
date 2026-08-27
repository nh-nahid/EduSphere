const axios = require('axios');
const SmsLog = require('../models/SmsLog');

/**
 * Send WhatsApp message via Meta Cloud API (Free tier)
 *
 * Setup (FREE — no credit card):
 * 1. Go to https://developers.facebook.com → Create App → Business
 * 2. Add "WhatsApp" product to your app
 * 3. Go to WhatsApp → Getting Started
 * 4. Copy the temporary access token → WHATSAPP_TOKEN
 * 5. Copy the Phone Number ID → WHATSAPP_PHONE_ID
 * 6. Add recipient numbers in "To" list (test numbers only for free tier)
 *
 * Free tier limits:
 *   - 1,000 free conversations/month
 *   - Up to 5 test recipient numbers for free (verify them in the console)
 *   - For production (unlimited recipients): submit for business verification
 *
 * Required .env vars:
 *   WHATSAPP_TOKEN=your_access_token
 *   WHATSAPP_PHONE_ID=your_phone_number_id
 */
exports.sendSms = async (phone, message, { event, studentId, schoolId } = {}) => {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  // Normalize phone to E.164 without + (replace leading 0 with 880 for BD)
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