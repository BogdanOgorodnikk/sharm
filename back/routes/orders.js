const Router = require('koa-router');

const router = new Router();
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const { ORDERS_STATUS_CODE } = require('../constants/orders');
const Orders = require('../models/Orders');
const parsedDate = require('../service/date');

router.get('/api/orders', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;

  if (userRole === ROLES_CODE.admin) {
    const [orders] = await sequelize.query(
      `SELECT orders.id, DATE_FORMAT(orders.data_create, "%d.%m.%Y") as data_create,
    DATE_FORMAT(orders.delivery_date, "%d.%m.%Y") as delivery_date, orders.status, orders.isDeleted,
    users.name as clientName, users.town as clientTown, users.region as clientRegion, users.id as clientId,
    (SUM(order_products.amount) + orders.delivery_price) as amount, prices.currency as currencySymbol
    FROM orders
    JOIN users ON orders.client_id = users.id
    LEFT jOIN order_products on orders.id = order_products.order_id and order_products.isDeleted = false
    jOIN prices on orders.price_id = prices.id
    where orders.isDeleted = false
    GROUP BY orders.id
    ORDER BY orders.id DESC`,
    );

    return ctx.body = orders;
  }

  if (userRole === ROLES_CODE.client) {
    const [orders] = await sequelize.query(`
    SELECT orders.id, DATE_FORMAT(orders.data_create, "%d.%m.%Y") as data_create,
    DATE_FORMAT(orders.delivery_date, "%d.%m.%Y") as delivery_date, orders.status, orders.isDeleted,
    (SUM(order_products.amount) + orders.delivery_price) as amount, prices.currency as currencySymbol
    FROM orders
    LEFT jOIN order_products on orders.id = order_products.order_id and order_products.isDeleted = false
    jOIN prices on orders.price_id = prices.id
    where orders.isDeleted = false and orders.client_id = ${ctx.user.id}
    GROUP BY orders.id
    ORDER BY orders.id DESC`);

    return ctx.body = orders;
  }
});

router.get('/api/order/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  const [[order]] = await sequelize.query(
    `SELECT orders.client_id, orders.creater_id, orders.data_create, orders.data_update,
    orders.delivery_date, orders.delivery_price, orders.id, orders.isDeleted,
    orders.price_id, orders.status, transport_invoices.id as isTransportInvoice,
    transport_invoices.id as transportInvoiceId
    FROM orders
    LEFT jOIN transport_invoices on orders.id = transport_invoices.order_id
    where orders.id = ${id}`,
  );

  if (userRole !== ROLES_CODE.admin && userRole === ROLES_CODE.client && order.client_id !== ctx.user.id) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  return ctx.body = order;
});

router.get('/api/orders/:clientId', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { clientId } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [orders] = await sequelize.query(
    `SELECT orders.id, DATE_FORMAT(orders.data_create, "%d.%m.%Y") as data_create,
    DATE_FORMAT(orders.delivery_date, "%d.%m.%Y") as delivery_date, orders.status, orders.isDeleted,
    (SUM(order_products.amount) + orders.delivery_price) as amount, prices.currency as currencySymbol
    FROM orders
    LEFT jOIN order_products on orders.id = order_products.order_id and order_products.isDeleted = false
    jOIN prices on orders.price_id = prices.id
    where orders.client_id = ${clientId} and orders.isDeleted = false
    GROUP BY orders.id
    ORDER BY orders.id DESC`,
  );

  return ctx.body = orders;
});

router.post('/api/orders', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const {
    products,
    clientId,
  } = ctx.request.body;

  if (!products.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'ordersCantBeEmpty',
    };
  }

  let userPriceId = ctx.user.priceId;
  const userId = userRole === ROLES_CODE.admin ? clientId : ctx.user.id;

  if (!userPriceId || userRole === ROLES_CODE.admin) {
    const [[user]] = await sequelize.query(`
      SELECT price_id
      FROM users
      WHERE id = ${userId}
    `);

    userPriceId = user.price_id;
  }

  if (!userPriceId) {
    ctx.status = 500;

    return ctx.body = {
      message: 'cannotFindPrice',
    };
  }

  const [createdOrderId] = await sequelize.query(`
    INSERT INTO orders (price_id, status, client_id, creater_id)
    VALUES(${userPriceId}, '${ORDERS_STATUS_CODE.expected}', ${userId}, ${ctx.user.id})
  `);

  let query = `INSERT INTO
    order_products (order_id, product_id, number, note, amount, textile, textile_categories) VALUES`;

  products.forEach((item, index) => {
    if (index === products.length - 1) {
      query += `(${createdOrderId}, '${item.productId}', ${item.number}, '${item.note}',
       ${item.amount}, '${item.textile}', '${item.textileCategories}');`;
    } else {
      query += `(${createdOrderId}, '${item.productId}', ${item.number}, '${item.note}',
       ${item.amount}, '${item.textile}', '${item.textileCategories}'), `;
    }
  });

  await sequelize.query(query);

  const [[createdOrder]] = await sequelize.query(`
     SELECT DATE_FORMAT(data_create, "%d.%m.%Y") as data_create, status, delivery_date
     FROM orders
     WHERE id = ${createdOrderId}
  `);

  return ctx.body = {
    data: createdOrder,
    message: 'orderSuccessCreated',
  };
});

router.put('/api/orders/:id', authMiddleware, async (ctx) => {
  const {
    status, delivery_date, delivery_price,
  } = ctx.request.body;
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (!status && !delivery_date && !delivery_price) {
    ctx.status = 500;

    return ctx.body = {
      message: 'orderDataEmptyError',
    };
  }

  const [isRealOrder] = await sequelize.query(
    `SELECT status FROM orders where id = ${id}`,
  );

  if (!isRealOrder.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'orderNotFound',
    };
  }

  const orderData = {};

  if (status) {
    orderData.status = status;
  }

  if (delivery_date) {
    orderData.delivery_date = parsedDate(delivery_date);
  }

  if (delivery_price) {
    orderData.delivery_price = delivery_price;
  }

  if (status === ORDERS_STATUS_CODE.finished) {
    await sequelize.query(`
        UPDATE order_products
        SET made = number
        WHERE order_id = ${id};
    `);
  }

  await Orders.update(
    {
      ...orderData,
      data_update: new Date(),
    },
    { where: { id } },
  );

  const [[updatedOrder]] = await sequelize.query(
    `SELECT orders.id, DATE_FORMAT(orders.data_create, "%d.%m.%Y") as data_create,
    DATE_FORMAT(orders.delivery_date, "%d.%m.%Y") as delivery_date, orders.status, orders.isDeleted,
    users.name as clientName, users.town as clientTown, (SUM(order_products.amount) + orders.delivery_price) as amount,
    prices.currency as currencySymbol
    FROM orders
    JOIN users ON orders.client_id = users.id
    LEFT jOIN order_products on orders.id = order_products.order_id
    jOIN prices on orders.price_id = prices.id
    where orders.id = ${id}`,
  );

  return ctx.body = {
    data: updatedOrder,
    message: 'orderSuccessUpdate',
  };
});

router.delete('/api/order/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole === ROLES_CODE.admin) {
    const [isRealOrder] = await sequelize.query(
      `SELECT id FROM orders where id = '${id}'`,
    );

    if (!isRealOrder.length) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderNotFound',
      };
    }

    await sequelize.query(`
        UPDATE order_products
        SET isDeleted = 1
        WHERE order_id = ${id};
    `);

    await Orders.update(
      {
        isDeleted: 1,
      },
      { where: { id } },
    );

    return ctx.body = {
      message: 'orderSuccessDeleted',
    };
  }

  if (userRole === ROLES_CODE.client) {
    const [isRealOrder] = await sequelize.query(
      `SELECT id, status FROM orders where id = '${id}' and client_id = ${ctx.user.id}`,
    );

    if (!isRealOrder.length) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderNotFound',
      };
    }

    const [deletedOrder] = isRealOrder;

    if (deletedOrder.status !== ORDERS_STATUS_CODE.expected) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderWithThisStatusCanNotBeDeleted',
      };
    }

    await sequelize.query(`
        UPDATE order_products
        SET isDeleted = 1
        WHERE order_id = ${id};
    `);

    await Orders.update(
      {
        isDeleted: 1,
      },
      { where: { id } },
    );

    return ctx.body = {
      message: 'orderSuccessDeleted',
    };
  }
});

module.exports = router;
