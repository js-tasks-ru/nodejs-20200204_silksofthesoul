module.exports = function mapOrderConfirmation(order, product) {
  return {
    id: order.id,
    product: {
      title: product.title,
    },
  };
};
