// client/src/stripe.js
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe public key
const stripePromise = loadStripe('your_stripe_public_key');

export default stripePromise;