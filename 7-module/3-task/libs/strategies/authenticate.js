const User = require('../../models/User');
const vk = async (email, displayName, done) => {
  if (!email) return done(null, false, 'Не указан email');
  let user = await User.findOne({email: email});
  if (!user) {
    try {
      user = await User.create({
        email,
        displayName,
      });
    } catch (err) {
      const eee = err.message.split(':').map((itm) => itm.trim())[2];
      if (eee) return done(err, false, eee);
    }
    await user.save();
    return done(null, user);
  } else {
    return done(null, user);
  }
};
module.exports = async function authenticate(strategy, email, displayName, done) {
  switch (strategy) {
    case 'vkontakte':
      return vk(email, displayName, done);
      break;
    default:
      done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
  }
};
