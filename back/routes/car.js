const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const Car = require('../models/Car');

router.get('/api/cars', authMiddleware, async (ctx) => {
  const [cars] = await sequelize.query(
    'SELECT * FROM cars where isDeleted = false',
  );

  return ctx.body = cars;
});

router.get('/api/car/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[car]] = await sequelize.query(
    `SELECT * FROM cars where id = ${id}`,
  );

  if (!car || car.isDeleted) {
    ctx.status = 500;

    return ctx.body = {
      message: 'carNotFound',
    };
  }

  return ctx.body = car;
});

router.post('/api/cars', authMiddleware, async (ctx) => {
  const {
    brand,
    licensePlate,
    owner,
    taxNumber,
    model,
    vinCode,
    year,
    length,
    width,
    height,
    weight,
  } = ctx.request.body;
  const userRole = ctx.user.role;

  const isEmptyForm = validator.isEmpty(brand, { ignore_whitespace: true })
    || validator.isEmpty(licensePlate, { ignore_whitespace: true })
    || validator.isEmpty(owner, { ignore_whitespace: true })
    || validator.isEmpty(taxNumber, { ignore_whitespace: true })
    || validator.isEmpty(model, { ignore_whitespace: true })
    || validator.isEmpty(vinCode, { ignore_whitespace: true })
    || validator.isEmpty(year, { ignore_whitespace: true })
    || validator.isEmpty(length, { ignore_whitespace: true })
    || validator.isEmpty(width, { ignore_whitespace: true })
    || validator.isEmpty(height, { ignore_whitespace: true })
    || validator.isEmpty(weight, { ignore_whitespace: true });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyForm) {
    ctx.status = 500;

    return ctx.body = {
      message: 'carFormIsEmptyError',
    };
  }

  await Car.create({
    brand,
    license_plate: licensePlate,
    owner,
    tax_number: Number(taxNumber),
    model,
    vin_code: vinCode,
    year_create: Number(year),
    length: Number(length),
    width: Number(width),
    height: Number(height),
    weight: Number(weight),
  });

  const [[createdCar]] = await sequelize.query(
    `SELECT * FROM cars where license_plate = '${licensePlate}'`,
  );

  return ctx.body = {
    data: createdCar,
    message: 'carSuccessCreated',
  };
});

router.put('/api/cars/:id', authMiddleware, async (ctx) => {
  const {
    brand,
    licensePlate,
    owner,
    taxNumber,
    model,
    vinCode,
    year,
    length,
    width,
    height,
    weight,
  } = ctx.request.body;
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  const isEmptyForm = validator.isEmpty(brand, { ignore_whitespace: true })
    || validator.isEmpty(licensePlate, { ignore_whitespace: true })
    || validator.isEmpty(owner, { ignore_whitespace: true })
    || validator.isEmpty(String(taxNumber), { ignore_whitespace: true })
    || validator.isEmpty(model, { ignore_whitespace: true })
    || validator.isEmpty(vinCode, { ignore_whitespace: true })
    || validator.isEmpty(String(year), { ignore_whitespace: true })
    || validator.isEmpty(String(length), { ignore_whitespace: true })
    || validator.isEmpty(String(width), { ignore_whitespace: true })
    || validator.isEmpty(String(height), { ignore_whitespace: true })
    || validator.isEmpty(String(weight), { ignore_whitespace: true });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyForm) {
    ctx.status = 500;

    return ctx.body = {
      message: 'carFormIsEmptyError',
    };
  }

  const [isRealCar] = await sequelize.query(
    `SELECT model FROM cars where id = ${id}`,
  );

  if (!isRealCar.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'carNotFound',
    };
  }

  await Car.update(
    {
      brand,
      license_plate: licensePlate,
      owner,
      tax_number: Number(taxNumber),
      model,
      vin_code: vinCode,
      year_create: Number(year),
      length: Number(length),
      width: Number(width),
      height: Number(height),
      weight: Number(weight),
    },
    { where: { id } },
  );

  const [[updatedCar]] = await sequelize.query(
    `SELECT * FROM cars where id = '${id}'`,
  );

  return ctx.body = {
    data: updatedCar,
    message: 'carSuccessUpdate',
  };
});

router.delete('/api/cars/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealCar] = await sequelize.query(
    `SELECT model FROM cars where id = '${id}'`,
  );

  if (!isRealCar.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'carNotFound',
    };
  }

  await Car.update(
    {
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'carSuccessDeleted',
  };
});

module.exports = router;
