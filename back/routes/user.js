const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const bcrypt = require('bcrypt');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/User');
const { ROLES_CODE } = require('../constants/roles');

router.get('/api/users/info', authMiddleware, async (ctx) => {
  const [user] = await sequelize.query(
    `SELECT name, email, phone, role_code as roleCode, isBanned, town, region,
     price_id as priceId, delivery_place as deliveryPlace FROM users where id = ${ctx.user.id}`,
  );

  const [accountInfo] = user;

  return ctx.body = accountInfo;
});

router.get('/api/user/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[user]] = await sequelize.query(
    `SELECT id, name, email, phone, role_code as roleCode, isBanned, town, region, place, tax_number,
     price_id as priceId, delivery_place as deliveryPlace FROM users where id = ${id}`,
  );

  return ctx.body = user;
});

router.get('/api/users', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [users] = await sequelize.query(
    `SELECT users.id, users.name, users.email, users.phone, users.role_code as roleCode, users.isBanned,
     users.delivery_place as deliveryPlace, prices.name as priceName, prices.id as priceId
     FROM users
     LEFT JOIN prices ON users.price_id = prices.id
     `,
  );

  return ctx.body = users;
});

router.put('/api/user/:id', authMiddleware, async (ctx) => {
  const {
    roleCode, isBanned, priceId,
  } = ctx.request.body;
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[editedUser]] = await sequelize.query(
    `SELECT role_code, isBanned, price_id
     FROM users
     where id = ${id}`,
  );

  await User.update(
    {
      role_code: roleCode || editedUser.role_code,
      isBanned: ~isBanned ? isBanned : editedUser.isBanned,
      price_id: priceId >= 0 ? priceId : editedUser.price_id,
      data_update: new Date(),
    },
    { where: { id } },
  );

  const [[user]] = await sequelize.query(
    `SELECT users.id, users.name, users.email, users.phone, users.role_code as roleCode, users.isBanned,
     users.delivery_place as deliveryPlace, prices.name as priceName, prices.id as priceId
     FROM users
     LEFT JOIN prices ON users.price_id = prices.id
     where users.id = ${id}`,
  );

  return ctx.body = {
    data: user,
    message: 'userSuccessUpdate',
  };
});

router.put('/api/users/profile', authMiddleware, async (ctx) => {
  const {
    name, phone, delivery_place,
  } = ctx.request.body;

  const isEmptyName = validator.isEmpty(name, { ignore_whitespace: true });
  const hasNameLength = validator.isLength(name, { min: 2, max: 100 });
  const isPhone = validator.isMobilePhone(phone, ['uk-UA']);

  if (isEmptyName || !hasNameLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userNameFormatError',
    };
  }

  if (!isPhone) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userPhoneFormatError',
    };
  }

  await User.update(
    {
      name,
      phone,
      delivery_place,
    },
    { where: { id: ctx.user.id } },
  );

  const [user] = await sequelize.query(
    `SELECT name, email, phone, role_code as roleCode, isBanned, town, region,
     price_id as priceId, delivery_place as deliveryPlace FROM users where id = ${ctx.user.id}`,
  );

  const [accountInfo] = user;

  return ctx.body = {
    data: accountInfo,
    message: 'userProfileSuccessUpdate',
  };
});

router.put('/api/users/change-password', authMiddleware, async (ctx) => {
  const {
    current_password, new_password,
  } = ctx.request.body;

  const isEmptyNewPassword = validator.isEmpty(new_password, { ignore_whitespace: true });
  const hasNewPasswordLength = validator.isLength(new_password, { min: 6, max: 64 });

  if (isEmptyNewPassword || !hasNewPasswordLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userPasswordFormatError',
    };
  }

  const [user] = await sequelize.query(
    `SELECT password FROM users where id = ${ctx.user.id}`,
  );

  const isCurrentPassValid = bcrypt.compareSync(current_password, user[0].password);

  if (!isCurrentPassValid) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userCurrentPasswordInvalid',
    };
  }

  if (current_password === new_password) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userNewPasswordSimilar',
    };
  }

  const hash = await bcrypt.hashSync(new_password, 10);

  await User.update(
    {
      password: hash,
    },
    { where: { id: ctx.user.id } },
  );

  return ctx.body = {
    message: 'userPasswordSuccessChange',
  };
});

module.exports = router;
