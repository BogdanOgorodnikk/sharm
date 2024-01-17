const Router = require('koa-router');

const router = new Router();
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const { ORDERS_STATUS_CODE } = require('../constants/orders');

router.get('/api/clients', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [clients] = await sequelize.query(
    `SELECT datas.id, datas.name, (sum(datas.usersDebt) - sum(datas.userPayments)) as usersDebt,
     datas.region, datas.town, datas.priceId as priceId, datas.priceName as priceName, datas.email,
     datas.phone, datas.currency
     from (
       SELECT users.id, users.name, users.region, users.town, prices.id as priceId, prices.name as priceName,
         users.email, users.phone,
         (sum(order_products.amount) + sum(orders.delivery_price)) as usersDebt, 0 as userPayments, prices.currency
       FROM users
       LEFT JOIN prices on users.price_id = prices.id
       LEFT JOIN orders on users.id = orders.client_id and orders.isDeleted = false
       and orders.status != '${ORDERS_STATUS_CODE.cancel}' and orders.status != '${ORDERS_STATUS_CODE.expected}'
       LEFT JOIN order_products on orders.id = order_products.order_id and order_products.isDeleted = false
       WHERE users.role_code = '${ROLES_CODE.client}'
       GROUP BY users.id
       UNION
       SELECT users.id, users.name, users.region, users.town, prices.id as priceId, prices.name as priceName,
         users.email, users.phone, 0 as usersDebt, sum(payments.amount) as userPayments, prices.currency
       FROM users
       LEFT JOIN prices on users.price_id = prices.id
       LEFT JOIN payments on users.id = payments.client_id and payments.isDeleted = false
       WHERE users.role_code = '${ROLES_CODE.client}'
       GROUP BY users.id
     ) as datas
     GROUP BY datas.id `,
  );

  return ctx.body = clients;
});

router.get('/api/client-debt/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[debt]] = await sequelize.query(
    `
    SELECT (sum(datas.ordersSum) - sum(datas.paymentsSum)) as sum, datas.currencySymbol as currencySymbol
    FROM (
    SELECT (sum(order_products.amount) + sum(orders.delivery_price)) as ordersSum,
     0 as paymentsSum, prices.currency as currencySymbol
    FROM users
     LEFT JOIN prices on users.price_id = prices.id
     LEFT JOIN orders on users.id = orders.client_id and orders.isDeleted = false
     and orders.status != '${ORDERS_STATUS_CODE.cancel}' and orders.status != '${ORDERS_STATUS_CODE.expected}'
     LEFT JOIN order_products on orders.id = order_products.order_id and order_products.isDeleted = false
     WHERE users.id = ${id}
    UNION
    SELECT 0 as ordersSum, sum(payments.amount) as paymentsSum, prices.currency as currencySymbol
    FROM users
     LEFT JOIN prices on users.price_id = prices.id
     LEFT JOIN payments on users.id = payments.client_id and payments.isDeleted = false
     WHERE users.id = ${id}
    ) as datas`,
  );

  return ctx.body = debt;
});

module.exports = router;
