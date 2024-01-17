const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const ToggleMechanism = require('../models/ToggleMechanism');

router.get('/api/toggle-mechanisms', authMiddleware, async (ctx) => {
  const [toggleMechanisms] = await sequelize.query(
    'SELECT * FROM toggleMechanisms where isDeleted = false',
  );

  return ctx.body = toggleMechanisms;
});

router.get('/api/toggle-mechanism/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[toggleMechanism]] = await sequelize.query(
    `SELECT * FROM toggleMechanisms where id = ${id}`,
  );

  if (!toggleMechanism || toggleMechanism.isDeleted) {
    ctx.status = 500;

    return ctx.body = {
      message: 'toggleMechanismNotFound',
    };
  }

  return ctx.body = toggleMechanism;
});

router.post('/api/toggle-mechanisms', authMiddleware, async (ctx) => {
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
      message: 'toggleMechanismsNameFormatError',
    };
  }

  const [isCreatedToggleMechanism] = await sequelize.query(
    `SELECT name FROM toggleMechanisms where name = '${name}'`,
  );

  if (isCreatedToggleMechanism.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'toggleMechanismsNameIsUsed',
    };
  }

  await ToggleMechanism.create({
    name,
  });

  const [[createdToggleMechanism]] = await sequelize.query(
    `SELECT * FROM toggleMechanisms where name = '${name}'`,
  );

  return ctx.body = {
    data: createdToggleMechanism,
    message: 'toggleMechanismsSuccessCreated',
  };
});

router.put('/api/toggle-mechanisms/:id', authMiddleware, async (ctx) => {
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
      message: 'toggleMechanismsNameFormatError',
    };
  }

  const [isRealToggleMechanism] = await sequelize.query(
    `SELECT name FROM toggleMechanisms where id = ${id}`,
  );

  if (!isRealToggleMechanism.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'toggleMechanismNotFound',
    };
  }

  const [isUsedNameToggleMechanism] = await sequelize.query(
    `SELECT name FROM toggleMechanisms where name = '${name}' and id != ${id}`,
  );

  if (isUsedNameToggleMechanism.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'toggleMechanismsNameIsUsed',
    };
  }

  await ToggleMechanism.update(
    {
      name,
    },
    { where: { id } },
  );

  const [[updatedToggleMechanism]] = await sequelize.query(
    `SELECT * FROM toggleMechanisms where id = '${id}'`,
  );

  return ctx.body = {
    data: updatedToggleMechanism,
    message: 'toggleMechanismSuccessUpdate',
  };
});

router.delete('/api/toggle-mechanisms/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealToggleMechanism] = await sequelize.query(
    `SELECT name FROM toggleMechanisms where id = '${id}'`,
  );

  if (!isRealToggleMechanism.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'toggleMechanismNotFound',
    };
  }

  await ToggleMechanism.update(
    {
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'toggleMechanismSuccessDeleted',
  };
});

module.exports = router;
