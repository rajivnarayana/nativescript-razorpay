import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import {HelloWorldModel} from './main-view-model';
import { RazorpayCheckout } from "nativescript-razorpay";

const razorPayPlugin = new RazorpayCheckout("rzp_test_sp7C1WTR5qgZ8z");
export function onPageLoaded() {
    razorPayPlugin.preload();
}

export function onCheckoutButtonTapped(args : any) {
    razorPayPlugin.open({
        "amount" : "1000",
        "description" : "Some Items from Swiggy",
        "image" : "https://placem.at/things?h=200",
        "name" : "My Business Checkout",
        "prefill": {
            "contact": "9XXXX12345",
            "email": "foo@bar.com"
        },
    }).then(function(paymentId){
        console.log("Payment Id ", paymentId);
    }, function(error){
        console.error(error);
    })
}
