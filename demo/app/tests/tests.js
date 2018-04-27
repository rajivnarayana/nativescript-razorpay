var Razorpay = require("nativescript-razorpay").Razorpay;
var razorpay = new Razorpay();

describe("greet function", function() {
    it("exists", function() {
        expect(razorpay.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(razorpay.greet()).toEqual("Hello, NS");
    });
});