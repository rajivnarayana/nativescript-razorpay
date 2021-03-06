import { android as native, AndroidApplication, AndroidActivityResultEventData } from "tns-core-modules/application";
import { CheckoutCommon } from './razorpay.common';

declare const com : any;

@Interfaces([com.razorpay.PaymentResultWithDataListener, com.razorpay.ExternalWalletListener])
export class RazoypayPaymentListener extends java.lang.Object {

    constructor(private _plugin: RazorpayCheckout) {
        super();
        return global.__native(this);
    }

    public onPaymentSuccess(s : string, paymentData) {
        try {
            this._plugin.done(s);
        } catch (e) {
            console.error(e);
        }
    }

    public onPaymentError(i: number, s: string, paymentData) {
        this._plugin.error(new Error(s));
    }

    public onExternalWalletSelected(s: string, paymentData) {
        console.log("onExternalWalletSelected", s);
    }
}

export class RazorpayCheckout extends CheckoutCommon {

    private _resolve;
    private _reject;
    private _paymentDataListener : RazoypayPaymentListener;

    constructor(private razorPayKey: string) {
        super();
    }

    private _cleanup() {
        this._resolve = null;
        this._reject = null;
        this._paymentDataListener = null;
    }

    public done(s: string) {
        this._resolve(s);
        this._cleanup();
    }
    
    public error(e: Error) {
        this._reject(e);
        this._cleanup();
    }

    public preload() {
        com.razorpay.Checkout.preload(native.foregroundActivity);
    }

    public open(options : any) : Promise<string> {
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
            const Checkout = com.razorpay.Checkout;
            const Intent = android.content.Intent;
            const CheckoutActivity = com.razorpay.CheckoutActivity;
            const RZP_REQUEST_CODE = Checkout.RZP_REQUEST_CODE;

            const context = native.foregroundActivity;
        
            native.on(AndroidApplication.activityResultEvent, onResult, this);
            const that = this;
            function onResult({ requestCode, resultCode, intent: data} : AndroidActivityResultEventData) {
                if (requestCode == RZP_REQUEST_CODE) {
                    native.off(AndroidApplication.activityResultEvent, onResult, that);
                    that._paymentDataListener = new RazoypayPaymentListener(that);
                    Checkout.handleActivityResult(context, requestCode, resultCode, data, that._paymentDataListener, that._paymentDataListener);
                }
            }

            try {
                options["key"] = this.razorPayKey;
                const intent = new Intent(native.foregroundActivity, CheckoutActivity.class);
                console.log(JSON.stringify(options));
                intent.putExtra("OPTIONS", JSON.stringify(options));
                // intent.putExtra("FRAMEWORK", "react_native");
                native.foregroundActivity.startActivityForResult(intent, RZP_REQUEST_CODE);

                //We need to `unregisterActivityLifecycleCallbacks` as tns is not able to generate bindings for CheckoutActivity.
                //It causes onActivityCreated callback to crash when trying to set theme.
                // activity.getPackageManager().getActivityInfo

                const lifecycleCallbacks = (native as any).callbacks.lifecycleCallbacks;
                native.nativeApp.unregisterActivityLifecycleCallbacks(lifecycleCallbacks);
                
                //Create newLifecycleCallbacks to listen to created event and swap callbacks.
                const newLifecycleCallbacks = new android.app.Application.ActivityLifecycleCallbacks({
                    onActivityCreated: function (activity: android.support.v7.app.AppCompatActivity, savedInstanceState: android.os.Bundle) {
                        // console.log("activity onActivityCreated");
                        native.nativeApp.unregisterActivityLifecycleCallbacks(newLifecycleCallbacks);
                        native.nativeApp.registerActivityLifecycleCallbacks(lifecycleCallbacks);
                    },
            
                    onActivityPaused: function (activity: android.support.v7.app.AppCompatActivity) {
                        if ((<any>activity).isNativeScriptActivity) {
                            // console.log("NativeScriptActivity onActivityPaused");
                            lifecycleCallbacks.onActivityPaused(activity);
                        }
                    },
                    
                    onActivityDestroyed: function (activity: android.support.v7.app.AppCompatActivity) {
                    },

                    onActivityResumed: function (activity: android.support.v7.app.AppCompatActivity) {
                    },

                    onActivitySaveInstanceState: function (activity: android.support.v7.app.AppCompatActivity, outState: android.os.Bundle) {
                    },

                    onActivityStarted: function (activity: android.support.v7.app.AppCompatActivity) {
                    },

                    onActivityStopped: function (activity: android.support.v7.app.AppCompatActivity) {
                    }
                });            
                native.nativeApp.registerActivityLifecycleCallbacks(newLifecycleCallbacks);
            }  catch (e) {
                native.off(AndroidApplication.activityResultEvent, onResult, this);
            }
        });
    }
}


