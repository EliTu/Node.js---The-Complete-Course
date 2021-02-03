import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(
	'sk_test_51IFXgfI7bWgkmmL4deebQsynH8A6B6gL7w7lhL5jm8eND7dhoYms6MMvEVhGoOmyhvwoixOGL4B57R4UctSTBKS500stv05ksb'
);

// const orderButton = document.getElementById('order-button');
// orderButton.addEventListener('click', async () => {
//     const stripe = await stripePromise;
// 	stripe.redirectToCheckout({
// 		sessionId: stripeSessionId,
// 	});
// });
export const stripeCb = async (stripeSessionId: string) => {
	const stripe = await stripePromise;
	stripe.redirectToCheckout({
		sessionId: stripeSessionId,
	});
};
