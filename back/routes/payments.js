const Router = require('koa-router');

const router = new Router();
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const Payments = require('../models/Payments');

router.get('/api/payments', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { clientId } = ctx.query;

  if (userRole === ROLES_CODE.admin) {
    let query = `SELECT payments.id, DATE_FORMAT(payments.data_create, "%d.%m.%Y") as data_create,
        payments.amount, payments.currency, payments.note, payments.client_id as clientId, users.name as userName,
        payments.isDeleted, users.id as clientId
        FROM payments
        LEFT JOIN users On payments.client_id = users.id
        WHERE payments.isDeleted = false
    `;

    if (clientId) {
      query = `${query} and payments.client_id = ${clientId}`;
    }

    query = `${query} ORDER BY payments.id DESC`;

    const [payments] = await sequelize.query(query);

    return ctx.body = payments;
  }

  if (userRole === ROLES_CODE.client) {
    const [payments] = await sequelize.query(`
        SELECT payments.id, DATE_FORMAT(payments.data_create, "%d.%m.%Y") as data_create,
        payments.amount, payments.currency, payments.note, payments.isDeleted
        FROM payments
        WHERE payments.isDeleted = false and payments.client_id = ${ctx.user.id}
        ORDER BY payments.id DESC
    `);

    return ctx.body = payments;
  }
});

router.get('/api/payment/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const query = `SELECT payments.id, DATE_FORMAT(payments.data_create, "%d.%m.%Y") as data_create,
        payments.amount, payments.currency, payments.note, payments.client_id as clientId, users.name as userName,
        payments.isDeleted
        FROM payments
        LEFT JOIN users On payments.client_id = users.id
        WHERE payments.id = ${id} and payments.isDeleted = false
    `;

  const [[payment]] = await sequelize.query(query);

  return ctx.body = payment;
});

router.post('/api/payments', authMiddleware, async (ctx) => {
  const {
    amount, currency, note, clientId,
  } = ctx.request.body;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (!amount || !currency) {
    ctx.status = 500;

    return ctx.body = {
      message: 'paymentsDataFormatError',
    };
  }

  const [isRealClient] = await sequelize.query(
    `SELECT id FROM users where id = ${clientId}`,
  );

  if (!isRealClient.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'clientNotFound',
    };
  }

  const createPaymentId = await Payments.create({
    amount,
    currency,
    note: note || '',
    client_id: clientId,
    creater_id: ctx.user.id,
  });

  const [[createdPayment]] = await sequelize.query(
    `SELECT payments.id, DATE_FORMAT(payments.data_create, "%d.%m.%Y") as data_create,
    payments.amount, payments.currency, payments.note, payments.client_id as clientId, users.name as userName,
    payments.isDeleted
    FROM payments
    LEFT JOIN users On payments.client_id = users.id
    where payments.id = ${createPaymentId.dataValues.id}`,
  );

  return ctx.body = {
    data: createdPayment,
    message: 'paymentSuccessCreated',
  };
});

router.put('/api/payments/:id', authMiddleware, async (ctx) => {
  const {
    amount, currency, note, clientId,
  } = ctx.request.body;
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (!amount || !currency || !clientId) {
    ctx.status = 500;

    return ctx.body = {
      message: 'paymentsDataFormatError',
    };
  }

  const [isRealPayment] = await sequelize.query(
    `SELECT id FROM payments where id = ${id}`,
  );

  if (!isRealPayment.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'paymentNotFound',
    };
  }

  await Payments.update(
    {
      amount,
      currency,
      note: note || '',
      client_id: clientId,
      data_update: new Date(),
    },
    { where: { id } },
  );

  const [[updatedPayment]] = await sequelize.query(
    `SELECT payments.id, DATE_FORMAT(payments.data_create, "%d.%m.%Y") as data_create,
    payments.amount, payments.currency, payments.note, payments.client_id as clientId, users.name as userName,
    payments.isDeleted
    FROM payments
    LEFT JOIN users On payments.client_id = users.id
    where payments.id = ${id}`,
  );

  return ctx.body = {
    data: updatedPayment,
    message: 'paymentSuccessUpdate',
  };
});

router.delete('/api/payment/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealPayment] = await sequelize.query(
    `SELECT id FROM payments where id = '${id}'`,
  );

  if (!isRealPayment.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'paymentNotFound',
    };
  }

  await Payments.update(
    {
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'paymentSuccessDeleted',
  };
});

module.exports = router;
