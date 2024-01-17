const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const Filling = require('../models/Filling');

router.get('/api/fillings', authMiddleware, async (ctx) => {
  const [fillings] = await sequelize.query(
    'SELECT * FROM fillings where isDeleted = false',
  );

  return ctx.body = fillings;
});

router.get('/api/filling/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[filling]] = await sequelize.query(
    `SELECT * FROM fillings where id = ${id}`,
  );

  if (!filling || filling.isDeleted) {
    ctx.status = 500;

    return ctx.body = {
      message: 'fillingNotFound',
    };
  }

  return ctx.body = filling;
});

router.post('/api/fillings', authMiddleware, async (ctx) => {
  const {
    name,
  } = ctx.request.body;
  const userRole = ctx.user.role;

  const isEmptyName = validator.isEmpty(name, { ignore_whitespace: true });
  const hasNameLength = validator.isLength(name, { min: 2, max: 100 });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyName || !hasNameLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'fillingsNameFormatError',
    };
  }

  const [isCreatedFilling] = await sequelize.query(
    `SELECT name FROM fillings where name = '${name}'`,
  );

  if (isCreatedFilling.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'fillingsNameIsUsed',
    };
  }

  await Filling.create({
    name,
  });

  const [[createdFilling]] = await sequelize.query(
    `SELECT * FROM fillings where name = '${name}'`,
  );

  return ctx.body = {
    data: createdFilling,
    message: 'fillingSuccessCreated',
  };
});

router.put('/api/fillings/:id', authMiddleware, async (ctx) => {
  const {
    name,
  } = ctx.request.body;
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  const isEmptyName = validator.isEmpty(name, { ignore_whitespace: true });
  const hasNameLength = validator.isLength(name, { min: 2, max: 100 });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyName || !hasNameLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'fillingsNameFormatError',
    };
  }

  const [isRealFilling] = await sequelize.query(
    `SELECT name FROM fillings where id = ${id}`,
  );

  if (!isRealFilling.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'fillingNotFound',
    };
  }

  const [isUsedNameFilling] = await sequelize.query(
    `SELECT name FROM fillings where name = '${name}' and id != ${id}`,
  );

  if (isUsedNameFilling.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'fillingsNameIsUsed',
    };
  }

  await Filling.update(
    {
      name,
    },
    { where: { id } },
  );

  const [[updatedFilling]] = await sequelize.query(
    `SELECT * FROM fillings where id = '${id}'`,
  );

  return ctx.body = {
    data: updatedFilling,
    message: 'fillingSuccessUpdate',
  };
});

router.delete('/api/fillings/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealFilling] = await sequelize.query(
    `SELECT name FROM fillings where id = '${id}'`,
  );

  if (!isRealFilling.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'fillingNotFound',
    };
  }

  await Filling.update(
    {
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'fillingSuccessDeleted',
  };
});

module.exports = router;
