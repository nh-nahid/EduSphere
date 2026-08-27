/**
 * services/payment/PaymentService.js
 *
 * Orchestrates the full fee-payment lifecycle:
 *   initiate  → create pending Payment record → call gateway → return redirect URL
 *   confirm   → verify callback → mark paid → generate PDF → SMS + email (fire-and-forget)
 *   fail      → mark failed
 *   cancel    → mark failed
 *
 * The controller stays thin: it just calls methods on this class.
 * The gateway is injected via the constructor so it can be swapped in tests
 * or when a new gateway is added.
 */
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
  /**
   * @param {import('./PaymentGateway')} gateway - A PaymentGateway instance to use.
   */
  constructor(gateway) {
    this.gateway = gateway;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Initiate a new fee payment session.
   *
   * @param {{ feeId: string, userId: string, schoolId: string, userEmail: string }} options
   * @returns {Promise<string>} Gateway redirect URL
   */
  async initiate({ feeId, userId, schoolId, userEmail }) {
    const [fee, student] = await Promise.all([
      Fee.findById(feeId),
      Student.findOne({ userId, schoolId }),
    ]);

    if (!fee)     throw Object.assign(new Error('Fee not found'),     { statusCode: 404 });
    if (!student) throw Object.assign(new Error('Student not found'), { statusCode: 404 });

    // Create a pending payment record before touching the gateway
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

  /**
   * Handle a successful payment callback from the gateway.
   *
   * @param {object} callbackData - Raw POST body from gateway
   * @returns {Promise<Payment>}  - The updated payment document
   */
  async confirm(callbackData) {
    const isValid = await this.gateway.verify(callbackData);
    if (!isValid) throw Object.assign(new Error('Invalid gateway callback'), { statusCode: 400 });

    const payment = await Payment
      .findOne({ gatewayTxnId: callbackData.tran_id })
      .populate('studentId feeId schoolId');

    if (!payment) throw Object.assign(new Error('Payment record not found'), { statusCode: 404 });

    // Mark paid
    payment.status = 'paid';
    payment.paidAt = new Date();

    // Generate PDF invoice — await so invoiceUrl is persisted
    const invoiceRelPath = await generateFeeInvoice({
      payment,
      student:     payment.studentId,
      fee:         payment.feeId,
      school:      payment.schoolId,
      studentName: await this._resolveStudentName(payment.studentId),
    });
    payment.invoiceUrl = invoiceRelPath;

    await payment.save();

    // Fire-and-forget notifications — never block the redirect
    this._notifyPaymentSuccess(payment);

    return payment;
  }

  /**
   * Handle a failed payment callback.
   * @param {object} callbackData
   */
  async fail(callbackData) {
    await Payment.findOneAndUpdate(
      { gatewayTxnId: callbackData.tran_id },
      { status: 'failed' },
    );
  }

  /**
   * Handle a cancelled payment callback.
   * @param {object} callbackData
   */
  async cancel(callbackData) {
    await Payment.findOneAndUpdate(
      { gatewayTxnId: callbackData.tran_id },
      { status: 'failed' },
    );
  }

  /**
   * Resolve the absolute filesystem path of a stored invoice PDF.
   * @param {string} paymentId
   * @returns {Promise<string>} absolute path
   */
  async resolveInvoicePath(paymentId) {
    const payment = await Payment.findById(paymentId);
    if (!payment?.invoiceUrl) {
      throw Object.assign(new Error('Invoice not found'), { statusCode: 404 });
    }
    return path.join(__dirname, '../../public', payment.invoiceUrl);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────────────────────────

  /** Generate a unique transaction ID for a new payment. */
  _generateTxnId() {
    return `SMS-${Date.now()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  }

  /**
   * Resolve a student's real name from their linked User document.
   * @param {object} studentDoc - Populated Student document
   * @returns {Promise<string>}
   */
  async _resolveStudentName(studentDoc) {
    try {
      const user = await User.findById(studentDoc.userId).select('name');
      return user?.name || studentDoc.guardianName || 'Student';
    } catch {
      return studentDoc.guardianName || 'Student';
    }
  }

  /**
   * Send fee-paid SMS and email notifications.
   * Called fire-and-forget — errors are logged but never thrown.
   *
   * @param {Payment} payment - The populated Payment document
   */
  _notifyPaymentSuccess(payment) {
    const phone  = payment.studentId?.guardianPhone;
    const amount = payment.amount;

    // SMS to parent
    if (phone) {
      smsUtil
        .sendSms(
          phone,
          `Fee payment of BDT ${amount} received successfully via ${this.gateway.name}. Receipt: ${process.env.FRONTEND_URL}/fees`,
          { event: 'fee_paid', studentId: payment.studentId._id, schoolId: payment.schoolId._id },
        )
        .catch((err) => console.error('[PaymentService] SMS failed:', err.message));
    }

    // Email (populate userId on studentId before calling if needed)
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
