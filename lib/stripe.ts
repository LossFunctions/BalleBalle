import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      appInfo: {
        name: "Balle Balle",
        version: "0.1.0",
      },
    });
  }

  return stripeClient;
};
