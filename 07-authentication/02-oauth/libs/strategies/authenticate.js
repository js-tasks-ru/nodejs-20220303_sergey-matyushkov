const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  const user = await User.findOne({email});

  if (user) {
    done(null, user);
    return;
  }

  try {
    const newUser = await new User({email, displayName}).save();
    done(null, newUser);
  } catch (err) {
    done(err);
  }
};
