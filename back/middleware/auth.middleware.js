const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async (ctx, next) => {
  try {
    const token = ctx.headers.authorization.split(' ')[1];

    if (!token) {
      ctx.body = {
        message: 'brokenToken',
      };

      return ctx.status = 401;
    }

    const decoded = jwt.verify(token, config.SECRETKEY);
    const isBannedUser = decoded.isBanned;

    if (isBannedUser) {
      ctx.status = 401;

      ctx.body = {
        message: 'accountIsBanned',
      };

      return;
    }

    ctx.user = decoded;

    return next();
  } catch {
    ctx.body = {
      message: 'brokenToken',
    };

    return ctx.status = 401;
  }
};
