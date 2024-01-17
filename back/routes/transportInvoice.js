const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const TransportInvoice = require('../models/TransportInvoice');

router.get('/api/transport-invoices', authMiddleware, async (ctx) => {
  const [transportInvoices] = await sequelize.query(
    `SELECT transport_invoices.id, transport_invoices.order_id,
        DATE_FORMAT(transport_invoices.data_create, "%d.%m.%Y") as data_create, users.name as customer
     FROM transport_invoices
     LEFT jOIN users on transport_invoices.customer_id = users.id
     where isDeleted = false`,
  );

  return ctx.body = transportInvoices;
});

router.get('/api/transport-invoice/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[transportInvoice]] = await sequelize.query(
    `SELECT * FROM transport_invoices where id = ${id}`,
  );

  if (!transportInvoice || transportInvoice.isDeleted) {
    ctx.status = 500;

    return ctx.body = {
      message: 'transportInvoiceNotFound',
    };
  }

  return ctx.body = transportInvoice;
});

router.post('/api/transport-invoices', authMiddleware, async (ctx) => {
  const {
    orderId,
    carId,
    trailerId,
    driverId,
    customerId,
    unloadingPlace,
  } = ctx.request.body;
  const userRole = ctx.user.role;

  const isEmptyForm = validator.isEmpty(unloadingPlace, { ignore_whitespace: true })
    || !orderId
    || !carId
    || !driverId
    || !customerId;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyForm) {
    ctx.status = 500;

    return ctx.body = {
      message: 'transportInvoiceFormIsEmptyError',
    };
  }

  const [isCreatedTransportInvoice] = await sequelize.query(
    `SELECT car_id, id FROM transport_invoices where order_id = ${orderId}`,
  );

  if (isCreatedTransportInvoice.length) {
    await TransportInvoice.update(
      {
        car_id: carId,
        trailer_id: trailerId || 0,
        driver_id: driverId,
        customer_id: customerId,
        unloading_place: unloadingPlace,
        isDeleted: 0,
      },
      { where: { id: isCreatedTransportInvoice[0].id } },
    );

    const [[updatedTransportInvoice]] = await sequelize.query(
      `SELECT * FROM transport_invoices where id = '${isCreatedTransportInvoice[0].id}'`,
    );

    return ctx.body = {
      data: updatedTransportInvoice,
      message: 'transportInvoiceSuccessUpdate',
    };
  }

  await TransportInvoice.create({
    order_id: Number(orderId),
    car_id: carId,
    trailer_id: trailerId || 0,
    driver_id: driverId,
    customer_id: customerId,
    unloading_place: unloadingPlace,
    data_create: new Date(),
  });

  return ctx.body = {
    message: 'transportInvoiceSuccessCreated',
  };
});

router.put('/api/transport-invoices/:id', authMiddleware, async (ctx) => {
  const {
    carId,
    trailerId,
    driverId,
    customerId,
    unloadingPlace,
  } = ctx.request.body;
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  const isEmptyForm = validator.isEmpty(unloadingPlace, { ignore_whitespace: true })
    || !carId
    || !driverId
    || !customerId;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyForm) {
    ctx.status = 500;

    return ctx.body = {
      message: 'transportInvoiceFormIsEmptyError',
    };
  }

  const [isRealTransportInvoice] = await sequelize.query(
    `SELECT car_id FROM transport_invoices where id = ${id}`,
  );

  if (!isRealTransportInvoice.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'transportInvoiceNotFound',
    };
  }

  await TransportInvoice.update(
    {
      car_id: carId,
      trailer_id: trailerId || 0,
      driver_id: driverId,
      customer_id: customerId,
      unloading_place: unloadingPlace,
    },
    { where: { id } },
  );

  const [[updatedTransportInvoice]] = await sequelize.query(
    `SELECT * FROM transport_invoices where id = '${id}'`,
  );

  return ctx.body = {
    data: updatedTransportInvoice,
    message: 'transportInvoiceSuccessUpdate',
  };
});

router.delete('/api/transport-invoices/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealTransportInvoice] = await sequelize.query(
    `SELECT car_id FROM transport_invoices where id = '${id}'`,
  );

  if (!isRealTransportInvoice.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'transportInvoiceNotFound',
    };
  }

  await TransportInvoice.update(
    {
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'transportInvoiceSuccessDeleted',
  };
});

module.exports = router;
