const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const Frame = require('../models/Frame');

router.get('/api/frames', authMiddleware, async (ctx) => {
  const [frames] = await sequelize.query(
    'SELECT * FROM frames where isDeleted = false',
  );

  return ctx.body = frames;
});

router.get('/api/frame/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[frame]] = await sequelize.query(
    `SELECT * FROM frames where id = ${id}`,
  );

  if (!frame || frame.isDeleted) {
    ctx.status = 500;

    return ctx.body = {
      message: 'frameNotFound',
    };
  }

  return ctx.body = frame;
});

router.post('/api/frames', authMiddleware, async (ctx) => {
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
      message: 'framesNameFormatError',
    };
  }

  const [isCreatedFrame] = await sequelize.query(
    `SELECT name FROM frames where name = '${name}'`,
  );

  if (isCreatedFrame.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'framesNameIsUsed',
    };
  }

  await Frame.create({
    name,
  });

  const [[createdFrame]] = await sequelize.query(
    `SELECT * FROM frames where name = '${name}'`,
  );

  return ctx.body = {
    data: createdFrame,
    message: 'frameSuccessCreated',
  };
});

router.put('/api/frames/:id', authMiddleware, async (ctx) => {
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
      message: 'framesNameFormatError',
    };
  }

  const [isRealFrame] = await sequelize.query(
    `SELECT name FROM frames where id = ${id}`,
  );

  if (!isRealFrame.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'frameNotFound',
    };
  }

  const [isUsedNameFrame] = await sequelize.query(
    `SELECT name FROM frames where name = '${name}' and id != ${id}`,
  );

  if (isUsedNameFrame.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'framesNameIsUsed',
    };
  }

  await Frame.update(
    {
      name,
    },
    { where: { id } },
  );

  const [[updatedFrame]] = await sequelize.query(
    `SELECT * FROM frames where id = '${id}'`,
  );

  return ctx.body = {
    data: updatedFrame,
    message: 'frameSuccessUpdate',
  };
});

router.delete('/api/frames/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealFrame] = await sequelize.query(
    `SELECT name FROM frames where id = '${id}'`,
  );

  if (!isRealFrame.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'frameNotFound',
    };
  }

  await Frame.update(
    {
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'frameSuccessDeleted',
  };
});

module.exports = router;
