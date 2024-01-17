const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const OrderProducts = require('../models/OrderProducts');
const Orders = require('../models/Orders');
const { ORDERS_STATUS_CODE } = require('../constants/orders');

router.get('/api/orders/info/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole === ROLES_CODE.admin) {
    const [orders] = await sequelize.query(`
      SELECT order_products.id, products.name, order_products.number, order_products.made,
      order_products.note, order_products.textile, products.size_width as sizeWidth,
      products.size_length as sizeLength, frames.name as frame, order_products.amount,
      prices.currency as currencySymbol, orders.client_id as clientId
      FROM order_products
      JOIN products ON order_products.product_id = products.id
      JOIN frames ON products.frame_id = frames.id
      JOIN orders ON ${id} = orders.id
      JOIN prices ON orders.price_id = prices.id
      WHERE order_products.order_id = ${id} and order_products.isDeleted = false
    `);

    return ctx.body = orders;
  }

  if (userRole === ROLES_CODE.client) {
    const [isRealOrder] = await sequelize.query(
      `SELECT id FROM orders where id = '${id}' and client_id = ${ctx.user.id} and isDeleted = false`,
    );

    if (!isRealOrder.length) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderNotFound',
      };
    }

    const [orders] = await sequelize.query(`
      SELECT order_products.id, products.name, order_products.number, order_products.made,
      order_products.note, order_products.textile, products.size_width as sizeWidth,
      products.size_length as sizeLength, frames.name as frame, order_products.amount,
      prices.currency as currencySymbol, orders.status
      FROM order_products
      JOIN products ON order_products.product_id = products.id
      JOIN frames ON products.frame_id = frames.id
      JOIN orders ON ${id} = orders.id
      JOIN prices ON orders.price_id = prices.id
      WHERE order_products.order_id = ${id} and order_products.isDeleted = false
    `);

    return ctx.body = orders;
  }
});

router.get('/api/orders/product/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole === ROLES_CODE.admin) {
    const [[orders]] = await sequelize.query(`
      SELECT order_products.id, order_products.order_id, order_products.product_id, order_products.number,
      order_products.made, order_products.note, order_products.textile, order_products.textile_categories,
      order_products.amount, prices.currency as currencySymbol, orders.client_id
      FROM order_products
      JOIN orders ON order_products.order_id = orders.id
      JOIN prices ON orders.price_id = prices.id
      WHERE order_products.id = ${id} and order_products.isDeleted = false
    `);

    return ctx.body = orders;
  }

  if (userRole === ROLES_CODE.client) {
    const [isRealOrder] = await sequelize.query(
      `SELECT orders.id
       FROM order_products
       LEFT JOIN orders ON order_products.order_id = orders.id
       where order_products.id = '${id}' and client_id = ${ctx.user.id} and order_products.isDeleted = false`,
    );

    if (!isRealOrder.length) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderNotFound',
      };
    }

    const [[orders]] = await sequelize.query(`
      SELECT order_products.id, order_products.order_id, order_products.product_id, order_products.number,
      order_products.note, order_products.textile, order_products.textile_categories,
      order_products.amount, prices.currency as currencySymbol
      FROM order_products
      JOIN orders ON order_products.order_id = orders.id
      JOIN prices ON orders.price_id = prices.id
      WHERE order_products.id = ${id} and order_products.isDeleted = false
    `);

    return ctx.body = orders;
  }
});

router.post('/api/orders/product/:orderId', authMiddleware, async (ctx) => {
  const {
    product_id, number, made, note, amount, textile, textile_categories,
  } = ctx.request.body;
  const { orderId } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole === ROLES_CODE.admin) {
    const isEmptyProduct = validator.isEmpty(String(product_id), { ignore_whitespace: true });
    const isEmptyNumber = number <= 0;
    const isEmptyMade = made < 0;
    const isEmptyAmount = amount < 0;
    const isEmptyTextile = validator.isEmpty(textile, { ignore_whitespace: true });
    const isEmptyTextileCategories = validator.isEmpty(textile_categories, { ignore_whitespace: true });

    if (isEmptyProduct
        || isEmptyNumber
        || isEmptyMade
        || isEmptyAmount
        || isEmptyTextile
        || isEmptyTextileCategories) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderProductDataFormatError',
      };
    }

    await OrderProducts.create(
      {
        order_id: orderId,
        product_id,
        number,
        made,
        note,
        amount,
        textile,
        textile_categories,
      },
    );

    return ctx.body = {
      message: 'orderProductSuccessCreated',
    };
  }

  if (userRole === ROLES_CODE.client) {
    const isEmptyProduct = validator.isEmpty(String(product_id), { ignore_whitespace: true });
    const isEmptyNumber = number <= 0;
    const isEmptyAmount = amount <= 0;
    const isEmptyTextile = validator.isEmpty(textile, { ignore_whitespace: true });
    const isEmptyTextileCategories = validator.isEmpty(textile_categories, { ignore_whitespace: true });

    if (isEmptyProduct
      || isEmptyNumber
      || isEmptyAmount
      || isEmptyTextile
      || isEmptyTextileCategories) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderProductDataFormatError',
      };
    }

    const [isRealOrder] = await sequelize.query(
      `SELECT id FROM orders where id = ${orderId} and client_id = ${ctx.user.id}
       and isDeleted = false and status = '${ORDERS_STATUS_CODE.expected}'`,
    );

    if (!isRealOrder.length) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderCanNotBeChanged',
      };
    }

    await OrderProducts.create(
      {
        order_id: orderId,
        product_id,
        number,
        made: 0,
        note,
        amount,
        textile,
        textile_categories,
      },
    );

    return ctx.body = {
      message: 'orderProductSuccessCreated',
    };
  }
});

router.put('/api/orders/product/:id', authMiddleware, async (ctx) => {
  const {
    product_id, number, made, note, amount, textile, textile_categories,
  } = ctx.request.body;
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole === ROLES_CODE.admin) {
    const [isRealOrderProduct] = await sequelize.query(
      `SELECT product_id FROM order_products where id = ${id}`,
    );

    if (!isRealOrderProduct.length) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderProductNotFound',
      };
    }

    if (made && !product_id) {
      if (made <= 0) {
        ctx.status = 500;

        return ctx.body = {
          message: 'orderProductCantBeNegative',
        };
      }

      await OrderProducts.update(
        {
          made,
          data_update: new Date(),
        },
        { where: { id } },
      );
    } else {
      const isEmptyProduct = validator.isEmpty(String(product_id), { ignore_whitespace: true });
      const isEmptyNumber = number <= 0;
      const isEmptyMade = made < 0;
      const isEmptyAmount = amount < 0;
      const isEmptyTextile = validator.isEmpty(textile, { ignore_whitespace: true });
      const isEmptyTextileCategories = validator.isEmpty(textile_categories, { ignore_whitespace: true });

      if (isEmptyProduct
        || isEmptyNumber
        || isEmptyMade
        || isEmptyAmount
        || isEmptyTextile
        || isEmptyTextileCategories) {
        ctx.status = 500;

        return ctx.body = {
          message: 'orderProductDataFormatError',
        };
      }

      await OrderProducts.update(
        {
          product_id,
          number,
          made,
          note,
          amount,
          textile,
          textile_categories,
          data_update: new Date(),
        },
        { where: { id } },
      );
    }

    const [[updatedOrder]] = await sequelize.query(`
      SELECT order_products.id, products.name, order_products.number, order_products.made,
      order_products.note, order_products.textile, products.size_width as sizeWidth,
      products.size_length as sizeLength, frames.name as frame, order_products.amount,
      prices.currency as currencySymbol
      FROM order_products
      JOIN products ON order_products.product_id = products.id
      JOIN frames ON products.frame_id = frames.id
      JOIN orders ON ${id} = orders.id
      JOIN prices ON orders.price_id = prices.id
      WHERE order_products.id = ${id}
    `);

    return ctx.body = {
      data: updatedOrder,
      message: 'orderSuccessUpdate',
    };
  }

  if (userRole === ROLES_CODE.client) {
    const [isRealOrder] = await sequelize.query(
      `SELECT orders.id
       FROM order_products
       LEFT JOIN orders ON order_products.order_id = orders.id
       where order_products.id = '${id}' and client_id = ${ctx.user.id}
       and order_products.isDeleted = false and orders.status = '${ORDERS_STATUS_CODE.expected}'`,
    );

    if (!isRealOrder.length) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderCanNotBeChanged',
      };
    }

    const isEmptyProduct = validator.isEmpty(String(product_id), { ignore_whitespace: true });
    const isEmptyNumber = number <= 0;
    const isEmptyAmount = amount <= 0;
    const isEmptyTextile = validator.isEmpty(textile, { ignore_whitespace: true });
    const isEmptyTextileCategories = validator.isEmpty(textile_categories, { ignore_whitespace: true });

    if (isEmptyProduct
      || isEmptyNumber
      || isEmptyAmount
      || isEmptyTextile
      || isEmptyTextileCategories) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderProductDataFormatError',
      };
    }

    await OrderProducts.update(
      {
        product_id,
        number,
        note,
        amount,
        textile,
        textile_categories,
        data_update: new Date(),
      },
      { where: { id } },
    );

    const [[updatedOrder]] = await sequelize.query(`
      SELECT order_products.id, products.name, order_products.number, order_products.made,
      order_products.note, order_products.textile, products.size_width as sizeWidth,
      products.size_length as sizeLength, frames.name as frame, order_products.amount,
      prices.currency as currencySymbol
      FROM order_products
      JOIN products ON order_products.product_id = products.id
      JOIN frames ON products.frame_id = frames.id
      JOIN orders ON ${id} = orders.id
      JOIN prices ON orders.price_id = prices.id
      WHERE order_products.id = ${id}
    `);

    return ctx.body = {
      data: updatedOrder,
      message: 'orderSuccessUpdate',
    };
  }
});

router.delete('/api/order/product/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole === ROLES_CODE.admin) {
    const [isRealOrderProduct] = await sequelize.query(
      `SELECT id FROM order_products where id = '${id}'`,
    );

    if (!isRealOrderProduct.length) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderProductNotFound',
      };
    }

    await OrderProducts.update(
      {
        isDeleted: 1,
      },
      { where: { id } },
    );

    return ctx.body = {
      message: 'orderProductSuccessDeleted',
    };
  }

  if (userRole === ROLES_CODE.client) {
    const [isRealOrder] = await sequelize.query(
      `SELECT orders.id
       FROM order_products
       LEFT JOIN orders ON order_products.order_id = orders.id
       where order_products.id = '${id}' and client_id = ${ctx.user.id}
       and order_products.isDeleted = false and orders.status = '${ORDERS_STATUS_CODE.expected}'`,
    );

    if (!isRealOrder.length) {
      ctx.status = 500;

      return ctx.body = {
        message: 'orderCanNotBeChanged',
      };
    }

    await OrderProducts.update(
      {
        isDeleted: 1,
      },
      { where: { id } },
    );

    const [isFilledOrder] = await sequelize.query(`
      SELECT *
      FROM order_products
      WHERE order_products.order_id = ${isRealOrder[0].id} and order_products.isDeleted = false
    `);

    if (!isFilledOrder.length) {
      await Orders.update(
        {
          isDeleted: 1,
        },
        { where: { id: isRealOrder[0].id } },
      );
    }

    return ctx.body = {
      message: 'orderProductSuccessDeleted',
    };
  }
});

module.exports = router;
