const stripe = require("stripe")(process.env.STRIPE_API_SECRET_KEY);

const createAccount = async () => {
  const account = await stripe.accounts.create({
    type: "express",
    default_currency: "usd",
  });

  return account;
};

const getOnboardingLink = async (stripeId, companyId) => {
  return await stripe.accountLinks.create({
    account: stripeId,
    refresh_url: `${process.env.CLIENT_URL}/companies/${companyId}`,
    return_url: `${process.env.CLIENT_URL}/companies/${companyId}`,
    type: "account_onboarding",
  });
};

const createLoginLink = async (stripeId) => {
  const result = await stripe.accounts.createLoginLink(stripeId);
  return result.url;
};

const isAccountValid = async (stripeId) => {
  const account = await stripe.accounts.retrieve(stripeId);
  return account.details_submitted;
};

const createPaymentSession = async (
  items,
  customerEmail,
  destination,
  paymentMetadata,
  eventId
) => {
  const params = {
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/events/${eventId}?payment=true`,
    cancel_url: `${process.env.CLIENT_URL}/events/${eventId}?payment=false`,
    line_items: items,
    customer_email: customerEmail,
    payment_intent_data: {
      metadata: paymentMetadata,
      transfer_data: {
        destination,
      },
    },
  };
  return await stripe.checkout.sessions.create(params);
};

const constructEvent = (stripeSignature, body) => {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      process.env.STRIPE_WEBHOOK_KEY
    );
    return event;
  } catch (err) {
    throw {
      statusCode: 500,
      message: `Stripe webhook error: ${err.message}`,
    };
  }
};

module.exports = {
  createAccount,
  getOnboardingLink,
  createLoginLink,
  isAccountValid,
  createPaymentSession,
  constructEvent,
};
