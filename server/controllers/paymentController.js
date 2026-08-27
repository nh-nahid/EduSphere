/**
 * controllers/paymentController.js
 *
 * Thin HTTP layer — validates requests, delegates all business logic to
 * PaymentService, and sends back the response or redirect.
 *
 * The gateway (SSLCommerzGateway) is instantiated once here and injected into
 * the service.  Swapping to a different gateway only means changing one import.
 */
const SSLCommerzGateway = require('../services/payment/SSLCommerzGateway');
const PaymentService    = require('../services/payment/PaymentService');

// Single shared service instance (gateway is stateless after construction)
const paymentService = new PaymentService(new SSLCommerzGateway());

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/payment/initiate
 * Student initiates a fee payment → returns the gateway redirect URL.
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { feeId } = req.body;
    if (!feeId) return res.status(400).json({ success: false, message: 'feeId is required' });

    const gatewayUrl = await paymentService.initiate({
      feeId,
      userId:    req.user._id,
      schoolId:  req.schoolId,
      userEmail: req.user.email,
    });

    res.status(200).json({ success: true, url: gatewayUrl });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/payment/success
 * SSLCommerz POSTs here after a successful payment.
 * Not protected by checkLogin — it's a public gateway callback.
 */
exports.paymentSuccess = async (req, res, next) => {
  try {
    await paymentService.confirm(req.body);
    res.redirect(`${process.env.FRONTEND_URL}/payment/success`);
  } catch (err) {
    // Even on error, redirect so the user isn't stranded on a blank page
    console.error('[paymentSuccess]', err.message);
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/payment/fail
 * SSLCommerz POSTs here when payment fails.
 */
exports.paymentFail = async (req, res, next) => {
  try {
    await paymentService.fail(req.body);
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/payment/cancel
 * SSLCommerz POSTs here when the customer cancels.
 */
exports.paymentCancel = async (req, res, next) => {
  try {
    await paymentService.cancel(req.body);
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/payment/:id/invoice
 * Download a stored PDF fee receipt.
 */
exports.downloadInvoice = async (req, res, next) => {
  try {
    const filePath = await paymentService.resolveInvoicePath(req.params.id);
    res.download(filePath);
  } catch (err) {
    next(err);
  }
};