const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const Driver = require('../models/Driver');

router.get('/api/drivers', authMiddleware, async (ctx) => {
  const [drivers] = await sequelize.query(
    'SELECT * FROM drivers where isDeleted = false',
  );

  return ctx.body = drivers;
});

router.get('/api/driver/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[driver]] = await sequelize.query(
    `SELECT * FROM drivers where id = ${id}`,
  );

  if (!driver || driver.isDeleted) {
    ctx.status = 500;

    return ctx.body = {
      message: 'driverNotFound',
    };
  }

  return ctx.body = driver;
});

router.post('/api/drivers', authMiddleware, async (ctx) => {
  const {
    fullName,
    driverLicenseNumber,
  } = ctx.request.body;
  const userRole = ctx.user.role;

  const isEmptyForm = validator.isEmpty(fullName, { ignore_whitespace: true })
    || validator.isEmpty(driverLicenseNumber, { ignore_whitespace: true });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyForm) {
    ctx.status = 500;

    return ctx.body = {
      message: 'driverFormIsEmptyError',
    };
  }

  await Driver.create({
    full_name: fullName,
    driver_license_number: driverLicenseNumber,
  });

  const [[createdDriver]] = await sequelize.query(
    `SELECT * FROM drivers where driver_license_number = '${driverLicenseNumber}'`,
  );

  return ctx.body = {
    data: createdDriver,
    message: 'driverSuccessCreated',
  };
});

router.put('/api/drivers/:id', authMiddleware, async (ctx) => {
  const {
    fullName,
    driverLicenseNumber,
  } = ctx.request.body;
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  const isEmptyForm = validator.isEmpty(fullName, { ignore_whitespace: true })
    || validator.isEmpty(driverLicenseNumber, { ignore_whitespace: true });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyForm) {
    ctx.status = 500;

    return ctx.body = {
      message: 'driverFormIsEmptyError',
    };
  }

  const [isRealDriver] = await sequelize.query(
    `SELECT full_name FROM drivers where id = ${id}`,
  );

  if (!isRealDriver.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'driverNotFound',
    };
  }

  await Driver.update(
    {
      full_name: fullName,
      driver_license_number: driverLicenseNumber,
    },
    { where: { id } },
  );

  const [[updatedDriver]] = await sequelize.query(
    `SELECT * FROM drivers where id = '${id}'`,
  );

  return ctx.body = {
    data: updatedDriver,
    message: 'driverSuccessUpdate',
  };
});

router.delete('/api/drivers/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealDriver] = await sequelize.query(
    `SELECT full_name FROM drivers where id = '${id}'`,
  );

  if (!isRealDriver.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'driverNotFound',
    };
  }

  await Driver.update(
    {
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'driverSuccessDeleted',
  };
});

module.exports = router;
