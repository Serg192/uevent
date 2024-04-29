const lineEventItem = (event, discount) => ({
  price_data: {
    currency: "usd",
    product_data: {
      name: `${event.name}`,
    },
    unit_amount: event.price * 100 - discount * 100,
  },
  quantity: 1,
});

module.exports = { lineEventItem };
