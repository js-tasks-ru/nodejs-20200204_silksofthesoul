module.exports = function mapMessage(message) {
  return {
    id: message.id,
    text: message.text,
    user: message.user,
    date: message.date,
  };
};
