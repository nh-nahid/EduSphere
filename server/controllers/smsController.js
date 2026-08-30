const SmsLog = require('../models/SmsLog');
const axios = require('axios');


exports.getSmsLogs = async (req, res, next) => {
  const isSuperAdmin = req.user.role === 'super_admin';
  const filter = isSuperAdmin ? {} : { schoolId: req.schoolId };
  const logs = await SmsLog.find(filter).sort({ sentAt: -1 }).limit(200);
  res.status(200).json({ success: true, data: logs });
};


exports.sendManualSms = async (req, res, next) => {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ success: false, message: 'Phone and message are required' });
  }

  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  
  let to = phone.replace(/[\s+-]/g, '');
  if (to.startsWith('0')) {
    to = '880' + to.substring(1);
  }

  if (!token || !phoneId) {
    return res.status(503).json({
      success: false,
      message: 'WhatsApp credentials not configured. Set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID in .env'
    });
  }

  try {
    console.log(`[WhatsApp] Sending to: "${to}" (original input: "${phone}")`);
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
      event: 'general',
      status: 'sent',
      schoolId: req.schoolId || null,
      sentAt: new Date()
    });

    return res.status(200).json({ success: true, message: `WhatsApp message sent to ${phone}!` });
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    console.error('[WhatsApp] sendManualSms failed:', errMsg);

    try {
      await SmsLog.create({
        recipient: phone,
        message,
        event: 'general',
        status: 'failed',
        schoolId: req.schoolId || null,
        sentAt: new Date()
      });
    } catch (_) {}

    return res.status(500).json({ success: false, message: `WhatsApp error: ${errMsg}` });
  }
};