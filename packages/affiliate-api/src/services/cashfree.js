import {Payouts} from 'cashfree-sdk';
import {logError} from "./cloudwatchlogs";

class CashfreeAPIError extends Error {
  constructor (message, status, source) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.source = source;
    Error.captureStackTrace(this, this.constructor);
  }
}

class CashfreePayout extends Payouts {
  constructor(args) {
    super(args);
  }
  async processResponse (apiResponse) {
    // refer cashfree docs for subCodes: https://dev.cashfree.com/bank-account-verification-api#response-codes-2
    if (apiResponse.subCode === '200') {
      return {
        status: 'success',
        message: apiResponse,
      }
    }
  
    else if (apiResponse.subCode === '422' || apiResponse.subCode === '520') {
      throw new CashfreeAPIError(apiResponse.message, 'failed', 'user');
    }
  
    else {
      await logError({
        logGroupName: 'aff-api/upi-verification-error',
        logStreamName: `${new Date().getTime()} ${apiResponse.subCode}`,
        errMessage: apiResponse.message,
      });
      throw new CashfreeAPIError(apiResponse.message, 'failed', 'server');
    }
  }
  
  async validateUpi ({ name, vpa }) {
    try {
      return await this.processResponse(await this.validation.validateUPIDetails({
        name, vpa
      }));
    } catch (e) {
      console.log(e)
        throw e;
    }
  }
  async addBeneficiary ({ beneId, name, phone, email, vpa, address }) {
    try {
      return await this.processResponse(await this.beneficiary.add({
        beneId, name, phone, email, vpa, address1: address
      }));
    } catch (e) {
      throw e;
    }
  }
  async getBeneHistory ({ beneId }) {
    let bearerToken;
    try {
      bearerToken = await this.auth.checkToken();
    } catch (e) {
      throw e;
    }
    const obj = {
      path: '/payout/v1/beneHistory',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      data: { beneId },
    };
  
    try {
      return await this.api.post(obj);
    } catch (e) {
      throw e;
    }
  }
}

const cashfreePayouts = new CashfreePayout({
  env: process.env.NODE_ENV === 'dev' ? 'TEST': 'PRODUCTION',
  clientId: process.env.CASHFREE_CLIENT_ID,
  clientSecret: process.env.CASHFREE_CLIENT_SECRET,
});

// cashfreePayouts.validateUpi({
//   name: 'B',
//   vpa: 'failure@upi\n'
// }).then(e => console.log(e))

// cashfreePayouts.beneficiary.remove({
//   beneId: '60965aca00375e1393f97ee9'
// }).then(d => {
//   console.log({ d });
// })

export default cashfreePayouts;