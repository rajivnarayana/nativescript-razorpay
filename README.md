# Razorpay (Unofficial)

A nativescript wrapper around iOS and Android Razorpay plugins. Razorpay is a payment gateway for some of the payments around Indian payments ecosystem. This does not provide any UI components. Will only provide functions to open native payment flows and receive callbacks. Hence, cannot be used declaratively.

## Installation

Open terminal and type the following command at the root of your project folder.

```shell
tns plugin add nativescript-razorpay
```

## Usage 

```javascript
export function onCheckoutButtonTapped(args : any) {
    new RazorpayCheckout("rzp_test_some_id").open({
        "amount" : "1000", //In paise 
        "description" : "Some Items from Swiggy",
        "image" : "https://placem.at/things?h=200",
        "name" : "My Business Checkout",
        "prefill": {
            "contact": "Valid phone number",
            "email": "foo@bar.com"
        },
    }).then(function(paymentId){
        console.log("Payment Id ", paymentId);
    }, function(error){
        console.error(error);
    })
}
```

## API

| Property | Default | Description |
| --- | --- | --- |
| open | none | Accepts options among others, should contain "amount" |
    
## License

Apache License Version 2.0, January 2004
