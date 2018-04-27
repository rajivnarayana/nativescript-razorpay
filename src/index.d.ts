import { CheckoutCommon } from './razorpay.common';
export declare class RazorpayCheckout extends CheckoutCommon {
  constructor(razorPayKey : string);
  open(options : any) : Promise<string>;
}
