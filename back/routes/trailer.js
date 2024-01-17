const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const Trailer = require('../models/Trailer');

router.get('/api/trailers', authMiddleware, async (ctx) => {
  const [trailers] = await sequelize.query(
    'SELECT * FROM trailers where isDeleted = false',
  );

  return ctx.body = trailers;
});

router.get('/api/trailer/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[trailer]] = await sequelize.query(
    `SELECT * FROM trailers where id = ${id}`,
  );

  if (!trailer || trailer.isDeleted) {
    ctx.status = 500;

    return ctx.body = {
      message: 'trailerNotFound',
    };
  }

  return ctx.body = trailer;
});

router.post('/api/trailers', authMiddleware, async (ctx) => {
  const {
    brand,
    licensePlate,
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
      message: 'trailerFormIsEmptyError',
    };
  }

  await Trailer.create({
    brand,
    license_plate: licensePlate,
    model,
    vin_code: vinCode,
    year_create: Number(year),
    length: Number(length),
    width: Number(width),
    height: Number(height),
    weight: Number(weight),
  });

  const [[createdTrailer]] = await sequelize.query(
    `SELECT * FROM trailers where license_plate = '${licensePlate}'`,
  );

  return ctx.body = {
    data: createdTrailer,
    message: 'trailerSuccessCreated',
  };
});

router.put('/api/trailers/:id', authMiddleware, async (ctx) => {
  const {
    brand,
    licensePlate,
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
      message: 'trailerFormIsEmptyError',
    };
  }

  const [isRealTrailer] = await sequelize.query(
    `SELECT model FROM trailers where id = ${id}`,
  );

  if (!isRealTrailer.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'trailerNotFound',
    };
  }

  await Trailer.update(
    {
      brand,
      license_plate: licensePlate,
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

  const [[updatedTrailer]] = await sequelize.query(
    `SELECT * FROM trailers where id = '${id}'`,
  );

  return ctx.body = {
    data: updatedTrailer,
    message: 'trailerSuccessUpdate',
  };
});

router.delete('/api/trailers/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealTrailer] = await sequelize.query(
    `SELECT model FROM trailers where id = '${id}'`,
  );

  if (!isRealTrailer.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'trailerNotFound',
    };
  }

  await Trailer.update(
    {
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'trailerSuccessDeleted',
  };
});

module.exports = router;
