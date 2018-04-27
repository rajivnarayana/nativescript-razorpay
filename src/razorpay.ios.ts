import { CheckoutCommon } from './razorpay.common';
import { Page } from "tns-core-modules/ui/page";
import { topmost } from "tns-core-modules/ui/frame";

declare const RazorpayPaymentCompletionProtocol : any;
export declare interface RazorpayPaymentCompletionProtocol {}
declare var Razorpay;

export class RazorpayPaymentCompletionDelegate extends NSObject implements RazorpayPaymentCompletionProtocol {
    public static ObjCProtocols = [ RazorpayPaymentCompletionProtocol ];
    private _plugin: RazorpayCheckout;

    onPaymentSuccess(payment_id: string) : void {
        this._plugin.done(payment_id);
    }

    onPaymentErrorDescription(code : number, response : any) : void {
        this._plugin.error(code, response);
    }

    public initWith(p:RazorpayCheckout): RazorpayPaymentCompletionDelegate {
        this._plugin = p;
        return this;
    }
}

export class RazorpayCheckout extends CheckoutCommon {

    private _resolve;
    private _reject;
    private _razorPay : any;
    private _delegate;

    constructor(razorPayKey : string) {
        super();
        this._delegate = new RazorpayPaymentCompletionDelegate().initWith(this);
        this._razorPay = Razorpay.initWithKeyAndDelegate(razorPayKey, this._delegate);
    }

    private get currentPage():Page{
        return topmost().currentPage;
    }

    done(paymentId) {
        this._resolve(paymentId);
    }

    error(code, response) {
        this._reject(new Error("Failed with error code: "+code));
    }

    open(options : any) : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
            this._razorPay.open(options);
        })
    }
}
