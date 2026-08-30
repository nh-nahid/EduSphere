
const SSLCommerzGateway = require('../services/payment/SSLCommerzGateway');
const PaymentService    = require('../services/payment/PaymentService');


const paymentService = new PaymentService(new SSLCommerzGateway());




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




exports.paymentSuccess = async (req, res, next) => {
  try {
    await paymentService.confirm(req.body);
    res.redirect(`${process.env.FRONTEND_URL}/payment/success`);
  } catch (err) {
    
    console.error('[paymentSuccess]', err.message);
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  }
};




exports.paymentFail = async (req, res, next) => {
  try {
    await paymentService.fail(req.body);
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  } catch (err) {
    next(err);
  }
};




exports.paymentCancel = async (req, res, next) => {
  try {
    await paymentService.cancel(req.body);
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancel`);
  } catch (err) {
    next(err);
  }
};




exports.downloadInvoice = async (req, res, next) => {
  try {
    const filePath = await paymentService.resolveInvoicePath(req.params.id);
    res.download(filePath);
  } catch (err) {
    next(err);
  }
};