const Router = require('koa-router');

const router = new Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const config = require('../config');
const { sequelize } = require('../database');
const { ROLES_CODE } = require('../constants/roles');
const mailer = require('../service/nodemailer');
const randomValue = require('../service/randomValue');

router.post('/api/register', async (ctx) => {
  const {
    name, email, phone, town, region, delivery_place, password,
  } = ctx.request.body;

  const isEmptyName = validator.isEmpty(name, { ignore_whitespace: true });
  const hasNameLength = validator.isLength(name, { min: 2, max: 100 });
  const isEmail = validator.isEmail(email);
  const isPhone = validator.isMobilePhone(phone, ['uk-UA']);
  const isEmptyTownId = validator.isEmpty(town, { ignore_whitespace: true });
  const isEmptyRegionId = validator.isEmpty(region, { ignore_whitespace: true });
  const isEmptyPassword = validator.isEmpty(password, { ignore_whitespace: true });
  const hasPasswordLength = validator.isLength(password, { min: 6, max: 64 });

  if (isEmptyName || !hasNameLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userNameFormatError',
    };
  }

  if (!isEmail) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userEmailFormatError',
    };
  }

  if (!isPhone) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userPhoneFormatError',
    };
  }

  if (isEmptyRegionId) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userRegionFormatError',
    };
  }

  if (isEmptyTownId) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userTownFormatError',
    };
  }

  if (isEmptyPassword || !hasPasswordLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userPasswordFormatError',
    };
  }

  const [isRegisteredAccount] = await sequelize.query(`
    SELECT * FROM users where users.email = '${email}'
  `);

  if (isRegisteredAccount.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userUsedAccount',
    };
  }

  const hash = await bcrypt.hashSync(password, 10);

  await User.create({
    name,
    email,
    phone,
    password: hash,
    role_code: ROLES_CODE.client,
    town,
    region,
    delivery_place: delivery_place || '',
  });

  const message = {
    from: 'factory.sharm@gmail.com',
    to: email,
    subject: 'Реєстрація в Sharm Factory',
    html: `
        <h1>Вітаю!</h1> </br>
        <p>Ви успішно зареєструвались у Sharm Factory.</p>
        <p>Для авторизації перейдіть за посиланням: https://sharmfactory.com</p>
        <h3>З повагою <b>Sharm Factory</b></h3>
    `,
  };

  await mailer(message);

  return ctx.body = {
    user: { name, email, phone },
    message: 'userSuccessRegistered',
  };
});

router.post('/api/login', async (ctx) => {
  const { email, password } = ctx.request.body;

  const isEmail = validator.isEmail(email);
  const isEmptyPassword = validator.isEmpty(password, { ignore_whitespace: true });
  const hasPasswordLength = validator.isLength(password, { min: 6, max: 64 });

  if (!isEmail) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userEmailFormatError',
    };
  }

  if (isEmptyPassword || !hasPasswordLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userPasswordFormatError',
    };
  }

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userAccountNotFind',
    };
  }

  const isPassValid = bcrypt.compareSync(password, user.password);

  if (!isPassValid) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userPasswordError',
    };
  }

  const token = jwt.sign(
    {
      id: user.id, role: user.role_code, priceId: user.price_id, isBanned: user.isBanned,
    },
    config.SECRETKEY,
    { expiresIn: '3h' },
  );

  return ctx.body = {
    token,
  };
});

router.put('/api/reset-password', async (ctx) => {
  const {
    email,
  } = ctx.request.body;

  const isEmail = validator.isEmail(email);

  if (!isEmail) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userEmailFormatError',
    };
  }

  const [isRegisteredAccount] = await sequelize.query(`
    SELECT * FROM users where users.email = '${email}'
  `);

  if (!isRegisteredAccount.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'userEmailNotFound',
    };
  }

  const newPassword = randomValue(8);
  const hash = await bcrypt.hashSync(newPassword, 10);
  const [accountData] = isRegisteredAccount;

  await User.update(
    {
      password: hash,
    },
    { where: { id: accountData.id } },
  );

  const message = {
    from: 'factory.sharm@gmail.com',
    to: email,
    subject: 'Відновлення пароля в Sharm Factory',
    html: `
        <h1>Вітаю!</h1>
        <p>Ваш пароль змінено.</p>
        <p>Новий пароль: <b>${newPassword}</b></p>
        <h3>З повагою <b>Sharm Factory</b></h3>`,
  };

  await mailer(message);

  return ctx.body = {
    message: 'userSuccessResetPassword',
  };
});

module.exports = router;
