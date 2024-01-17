const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const Prices = require('../models/Prices');
const parsedDate = require('../service/date');

router.get('/api/prices', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [prices] = await sequelize.query(
    `SELECT id, name, DATE_FORMAT(from_date, "%d.%m.%Y") as from_date, isRetail, isDeleted, currency
     FROM prices
     where isDeleted = false`,
  );

  return ctx.body = prices;
});

router.get('/api/price/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[prices]] = await sequelize.query(
    `SELECT id, name, DATE_FORMAT(from_date, "%d.%m.%Y") as from_date, isDeleted, currency
     FROM prices
     where id = ${id}`,
  );

  const [pricesProducts] = await sequelize.query(
    `SELECT product_id as productId,
      special_price as specialPrice,
      first_category as firstCategory,
      second_category as secondCategory,
      thirdary_category as thirdaryCategory,
      fourth_category as fourthCategory,
      fives_category as fivesCategory
     FROM price_products
     where price_id = ${id}`,
  );

  if (!prices || prices.isDeleted) {
    ctx.status = 500;

    return ctx.body = {
      message: 'pricesNotFound',
    };
  }

  prices.products = pricesProducts;

  return ctx.body = prices;
});

router.post('/api/prices', authMiddleware, async (ctx) => {
  const {
    name, currency, from_date, products,
  } = ctx.request.body;
  const userRole = ctx.user.role;

  const isEmptyName = validator.isEmpty(name, { ignore_whitespace: true });
  const hasNameLength = validator.isLength(name, { min: 2, max: 100 });
  const isEmptyDate = validator.isEmpty(from_date, { ignore_whitespace: true });
  const isEmptyCurrency = validator.isEmpty(currency, { ignore_whitespace: true });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyName || !hasNameLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'pricesNameFormatError',
    };
  }

  if (isEmptyDate) {
    ctx.status = 500;

    return ctx.body = {
      message: 'pricesDateFormatError',
    };
  }

  if (isEmptyCurrency) {
    ctx.status = 500;

    return ctx.body = {
      message: 'pricesCurrencyFormatError',
    };
  }

  const [isCreatedPrice] = await sequelize.query(
    `SELECT name FROM prices where name = '${name}'`,
  );

  if (isCreatedPrice.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'pricesNameIsUsed',
    };
  }

  await Prices.create({
    name,
    currency,
    from_date: parsedDate(from_date),
  });

  const [[createdPrice]] = await sequelize.query(
    `SELECT * FROM prices where name = '${name}'`,
  );

  if (products.length) {
    let query = 'INSERT INTO price_products (price_id, product_id, special_price, first_category, second_category, thirdary_category, fourth_category, fives_category) VALUES';

    products.forEach((item, index) => {
      const specialPrice = item.specialPrice ? item.specialPrice : 0;
      const firstCategory = item.firstCategory ? item.firstCategory : 0;
      const secondCategory = item.secondCategory ? item.secondCategory : 0;
      const thirdaryCategory = item.thirdaryCategory ? item.thirdaryCategory : 0;
      const fourthCategory = item.fourthCategory ? item.fourthCategory : 0;
      const fivesCategory = item.fivesCategory ? item.fivesCategory : 0;

      if (index === products.length - 1) {
        query += `(${createdPrice.id}, '${item.productId}', ${specialPrice}, ${firstCategory},
       ${secondCategory}, ${thirdaryCategory}, ${fourthCategory}, ${fivesCategory});`;
      } else {
        query += `(${createdPrice.id}, '${item.productId}', ${specialPrice}, ${firstCategory},
       ${secondCategory}, ${thirdaryCategory}, ${fourthCategory}, ${fivesCategory}), `;
      }
    });

    await sequelize.query(query);
  }

  return ctx.body = {
    data: createdPrice,
    message: 'priceSuccessCreated',
  };
});

router.put('/api/prices/:id', authMiddleware, async (ctx) => {
  const {
    name, currency, from_date, products,
  } = ctx.request.body;
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  const isEmptyName = validator.isEmpty(name, { ignore_whitespace: true });
  const hasNameLength = validator.isLength(name, { min: 2, max: 100 });
  const isEmptyDate = validator.isEmpty(from_date, { ignore_whitespace: true });
  const isEmptyCurrency = validator.isEmpty(currency, { ignore_whitespace: true });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyName || !hasNameLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'pricesNameFormatError',
    };
  }

  if (isEmptyDate) {
    ctx.status = 500;

    return ctx.body = {
      message: 'pricesDateFormatError',
    };
  }

  if (isEmptyCurrency) {
    ctx.status = 500;

    return ctx.body = {
      message: 'pricesCurrencyFormatError',
    };
  }

  const [isRealPrice] = await sequelize.query(
    `SELECT name FROM prices where id = ${id}`,
  );

  if (!isRealPrice.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'priceNotFound',
    };
  }

  const [isUsedNamePrice] = await sequelize.query(
    `SELECT name FROM prices where name = '${name}' and id != ${id}`,
  );

  if (isUsedNamePrice.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'pricesNameIsUsed',
    };
  }

  await Prices.update(
    {
      name,
      currency,
      from_date: parsedDate(from_date),
      data_update: new Date(),
    },
    { where: { id } },
  );

  const [[updatedPrice]] = await sequelize.query(
    `SELECT id, name, currency, DATE_FORMAT(from_date, "%d.%m.%Y") as from_date, isRetail, isDeleted
     FROM prices
     where id = '${id}'`,
  );

  await sequelize.query(`DELETE FROM price_products WHERE price_id=${id}`);

  if (products.length) {
    let query = 'INSERT INTO price_products (price_id, product_id, special_price, first_category, second_category, thirdary_category, fourth_category, fives_category) VALUES';

    products.forEach((item, index) => {
      const specialPrice = item.specialPrice ? item.specialPrice : 0;
      const firstCategory = item.firstCategory ? item.firstCategory : 0;
      const secondCategory = item.secondCategory ? item.secondCategory : 0;
      const thirdaryCategory = item.thirdaryCategory ? item.thirdaryCategory : 0;
      const fourthCategory = item.fourthCategory ? item.fourthCategory : 0;
      const fivesCategory = item.fivesCategory ? item.fivesCategory : 0;

      if (index === products.length - 1) {
        query += `(${id}, '${item.productId}', ${specialPrice}, ${firstCategory},
       ${secondCategory}, ${thirdaryCategory}, ${fourthCategory}, ${fivesCategory});`;
      } else {
        query += `(${id}, '${item.productId}', ${specialPrice}, ${firstCategory},
       ${secondCategory}, ${thirdaryCategory}, ${fourthCategory}, ${fivesCategory}), `;
      }
    });

    await sequelize.query(query);
  }

  return ctx.body = {
    data: updatedPrice,
    message: 'priceSuccessUpdate',
  };
});

router.put('/api/prices/retail/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealPrice] = await sequelize.query(
    `SELECT name, isRetail FROM prices where id = ${id}`,
  );

  if (!isRealPrice.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'priceNotFound',
    };
  }

  const [editedPrice] = isRealPrice;

  if (editedPrice.isRetail) {
    await Prices.update(
      {
        isRetail: false,
        data_update: new Date(),
      },
      { where: { id } },
    );
  } else {
    await sequelize.query(`
      UPDATE prices SET isRetail = 0 where isRetail = true
    `);

    await Prices.update(
      {
        isRetail: true,
        data_update: new Date(),
      },
      { where: { id } },
    );
  }

  const [[updatedPrice]] = await sequelize.query(
    `SELECT id, name, currency, DATE_FORMAT(from_date, "%d.%m.%Y") as from_date, isRetail, isDeleted
     FROM prices
     where id = '${id}'`,
  );

  return ctx.body = {
    data: updatedPrice,
    message: 'priceSuccessUpdate',
  };
});

router.delete('/api/prices', authMiddleware, async (ctx) => {
  const { query } = ctx;
  const userRole = ctx.user.role;
  const ids = query['ids[]'];

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  await sequelize.query(`DELETE FROM price_products WHERE price_id IN (${ids})`);

  await sequelize.query(
    `UPDATE prices SET isDeleted = 1 where id IN (${ids})`,
  );

  return ctx.body = {
    message: 'massPriceSuccessDeleted',
  };
});

router.delete('/api/price/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealPrice] = await sequelize.query(
    `SELECT name FROM prices where id = '${id}'`,
  );

  if (!isRealPrice.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'priceNotFound',
    };
  }

  await sequelize.query(`DELETE FROM price_products WHERE price_id=${id}`);

  await Prices.update(
    {
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'priceSuccessDeleted',
  };
});

module.exports = router;
