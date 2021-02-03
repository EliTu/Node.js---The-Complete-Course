"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeCb = void 0;
const stripe_js_1 = require("@stripe/stripe-js");
const stripePromise = stripe_js_1.loadStripe('sk_test_51IFXgfI7bWgkmmL4deebQsynH8A6B6gL7w7lhL5jm8eND7dhoYms6MMvEVhGoOmyhvwoixOGL4B57R4UctSTBKS500stv05ksb');
// const orderButton = document.getElementById('order-button');
// orderButton.addEventListener('click', async () => {
//     const stripe = await stripePromise;
// 	stripe.redirectToCheckout({
// 		sessionId: stripeSessionId,
// 	});
// });
const stripeCb = (stripeSessionId) => __awaiter(void 0, void 0, void 0, function* () {
    const stripe = yield stripePromise;
    stripe.redirectToCheckout({
        sessionId: stripeSessionId,
    });
});
exports.stripeCb = stripeCb;
//# sourceMappingURL=stipe.js.map