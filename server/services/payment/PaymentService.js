const crypto = require('crypto');
const path   = require('path');

const Payment             = require('../../models/Payment');
const Fee                 = require('../../models/Fee');
const Student             = require('../../models/Student');
const User                = require('../../models/User');
const School              = require('../../models/School');
const { generateFeeInvoice } = require('../../utils/generateFeeInvoice');
const smsUtil             = require('../../utils/sms');
const emailUtil           = require('../../utils/email');

class PaymentService {
  constructor(gateway) {
    this.gateway = gateway;
  }

  async initiate({ feeId, userId, schoolId, userEmail }) {
    const [fee, student] = await Promise.all([
      Fee.findById(feeId),
      Student.findOne({ userId, schoolId }),
    ]);

    if (!fee)     throw Object.assign(new Error('Fee not found'),     { statusCode: 404 });
    if (!student) throw Object.assign(new Error('Student not found'), { statusCode: 404 });

    const payment = await Payment.create({
      studentId:    student._id,
      feeId:        fee._id,
      amount:       fee.amount,
      schoolId,
      status:       'pending',
      gatewayTxnId: this._generateTxnId(),
    });

    const gatewayUrl = await this.gateway.initiate({
      amount:        fee.amount,
      tranId:        payment.gatewayTxnId,
      productName:   fee.title,
      customerName:  student.guardianName  || 'Student',
      customerEmail: userEmail,
      customerPhone: student.guardianPhone || '01700000000',
    });

    return gatewayUrl;
  }

  async confirm(callbackData) {
    const isValid = await this.gateway.verify(callbackData);
    if (!isValid) throw Object.assign(new Error('Invalid gateway callback'), { statusCode: 400 });

    const payment = await Payment
      .findOne({ gatewayTxnId: callbackData.tran_id })
      .populate('studentId feeId schoolId');

    if (!payment) throw Object.assign(new Error('Payment record not found'), { statusCode: 404 });

    payment.status = 'paid';
    payment.paidAt = new Date();

    const invoiceRelPath = await generateFeeInvoice({
      payment,
      student:     payment.studentId,
      fee:         payment.feeId,
      school:      payment.schoolId,
      studentName: await this._resolveStudentName(payment.studentId),
    });
    payment.invoiceUrl = invoiceRelPath;

    await payment.save();

    this._notifyPaymentSuccess(payment);

    return payment;
  }

  async fail(callbackData) {
    await Payment.findOneAndUpdate(
      { gatewayTxnId: callbackData.tran_id },
      { status: 'failed' },
    );
  }

  async cancel(callbackData) {
    await Payment.findOneAndUpdate(
      { gatewayTxnId: callbackData.tran_id },
      { status: 'failed' },
    );
  }

  async resolveInvoicePath(paymentId) {
    const payment = await Payment.findById(paymentId);
    if (!payment?.invoiceUrl) {
      throw Object.assign(new Error('Invoice not found'), { statusCode: 404 });
    }
    return path.join(__dirname, '../../public', payment.invoiceUrl);
  }

  _generateTxnId() {
    return `SMS-${Date.now()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  }

  async _resolveStudentName(studentDoc) {
    try {
      const user = await User.findById(studentDoc.userId).select('name');
      return user?.name || studentDoc.guardianName || 'Student';
    } catch {
      return studentDoc.guardianName || 'Student';
    }
  }

  _notifyPaymentSuccess(payment) {
    const phone  = payment.studentId?.guardianPhone;
    const amount = payment.amount;

    if (phone) {
      smsUtil
        .sendSms(
          phone,
          `Fee payment of BDT ${amount} received successfully via ${this.gateway.name}. Receipt: ${process.env.FRONTEND_URL}/fees`,
          { event: 'fee_paid', studentId: payment.studentId._id, schoolId: payment.schoolId._id },
        )
        .catch((err) => console.error('[PaymentService] SMS failed:', err.message));
    }

    emailUtil
      .sendEmail({
        to:           payment.studentId?.userId?.email,
        subject:      'Fee Payment Confirmed',
        templateName: 'feeReceipt',
        replacements: {
          amount:   `BDT ${amount}`,
          feeTitle: payment.feeId?.title || 'Fee',
          txnId:    payment.gatewayTxnId,
          date:     new Date(payment.paidAt).toDateString(),
        },
      })
      .catch((err) => console.error('[PaymentService] Email failed:', err.message));
  }
}

module.exports = PaymentService;
