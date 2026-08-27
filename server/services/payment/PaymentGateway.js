class PaymentGateway {
  async initiate(payload) {
    throw new Error(`${this.constructor.name} must implement initiate()`);
  }

  async verify(callbackData) {
    throw new Error(`${this.constructor.name} must implement verify()`);
  }

  get name() {
    throw new Error(`${this.constructor.name} must implement name getter`);
  }
}

module.exports = PaymentGateway;
