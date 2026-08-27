/**
 * services/payment/PaymentGateway.js
 *
 * Abstract base class defining the contract every payment gateway must implement.
 * Using a class hierarchy here makes it trivial to swap in a new gateway
 * (e.g. Nagad, bKash direct, Stripe) without touching the rest of the codebase.
 */
class PaymentGateway {
  /**
   * Initialise a payment session with the third-party gateway.
   * @param {object} payload  - Amount, transaction id, URLs, customer info etc.
   * @returns {Promise<string>} - The gateway redirect URL to send the user to.
   */
  // eslint-disable-next-line no-unused-vars
  async initiate(payload) {
    throw new Error(`${this.constructor.name} must implement initiate()`);
  }

  /**
   * Verify a callback from the gateway and confirm the payment is genuine.
   * @param {object} callbackData - The raw POST body sent back by the gateway.
   * @returns {Promise<boolean>}
   */
  // eslint-disable-next-line no-unused-vars
  async verify(callbackData) {
    throw new Error(`${this.constructor.name} must implement verify()`);
  }

  /**
   * Human-readable name of this gateway (used in logs / SMS messages).
   * @returns {string}
   */
  get name() {
    throw new Error(`${this.constructor.name} must implement name getter`);
  }
}

module.exports = PaymentGateway;
