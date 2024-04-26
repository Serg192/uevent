const stripe = require("stripe")(process.env.STRIPE_API_SECRET_KEY);

const createAccount = async () => {
  const account = await stripe.accounts.create({
    type: "express",
    default_currency: "usd",
  });

  return account;
};

const getOnboardingLink = async (stripeId) => {
  return await stripe.accountLinks.create({
    account: stripeId,
    refresh_url: process.env.CLIENT_URL,
    return_url: process.env.CLIENT_URL,
    type: "account_onboarding",
  });
};

module.exports = { createAccount, getOnboardingLink };
