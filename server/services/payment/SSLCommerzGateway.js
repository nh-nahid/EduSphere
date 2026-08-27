const SSLCommerzPayment = require('sslcommerz-lts');
const PaymentGateway = require('./PaymentGateway');

class SSLCommerzGateway extends PaymentGateway {
  constructor() {
    super();
    this._storeId       = process.env.SSL_STORE_ID;
    this._storePassword = process.env.SSL_STORE_PASSWORD;
    this._isLive        = process.env.SSL_IS_LIVE === 'true';
  }

  get name() {
    return 'SSLCommerz';
  }

  async initiate(payload) {
    const sslcz = new SSLCommerzPayment(
      this._storeId,
      this._storePassword,
      this._isLive,
    );

    const data = {
      total_amount:    payload.amount,
      currency:        'BDT',
      tran_id:         payload.tranId,
      success_url:     `${process.env.BACKEND_URL}/api/v1/payment/success`,
      fail_url:        `${process.env.BACKEND_URL}/api/v1/payment/fail`,
      cancel_url:      `${process.env.BACKEND_URL}/api/v1/payment/cancel`,
      ipn_url:         `${process.env.BACKEND_URL}/api/v1/payment/ipn`,
      shipping_method: 'Courier',
      product_name:    payload.productName,
      product_category:'Education',
      product_profile: 'general',
      cus_name:        payload.customerName,
      cus_email:       payload.customerEmail,
      cus_add1:        'Dhaka',
      cus_city:        'Dhaka',
      cus_country:     'Bangladesh',
      cus_phone:       payload.customerPhone,
      ship_name:       payload.customerName,
      ship_add1:       'Dhaka',
      ship_city:       'Dhaka',
      ship_country:    'Bangladesh',
    };

    const apiResponse = await sslcz.init(data);
    const url = apiResponse?.GatewayPageURL;

    if (!url) {
      throw new Error(`${this.name}: gateway did not return a redirect URL`);
    }

    return url;
  }

  async verify(callbackData) {
    return !!(callbackData && callbackData.tran_id);
  }
}

module.exports = SSLCommerzGateway;
