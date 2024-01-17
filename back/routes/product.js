const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const fs = require('fs');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const Product = require('../models/Product');

router.get('/api/products', authMiddleware, async (ctx) => {
  let userPriceId = ctx.user.priceId;
  const { userId } = ctx.query;
  const userRole = ctx.user.role;

  if (userRole === ROLES_CODE.admin && userId) {
    const [[user]] = await sequelize.query(`
      SELECT price_id
      FROM users
      WHERE id = ${userId}
    `);

    userPriceId = user.price_id;
  }

  if (!userPriceId) {
    const [[user]] = await sequelize.query(`
      SELECT price_id
      FROM users
      WHERE id = ${ctx.user.id}
    `);

    userPriceId = user.price_id;
  }

  const [products] = await sequelize.query(
    `SELECT products.id, products.name, products.type, products.sort,
        fillings.name as filling, fillings.id as fillingId,
        toggleMechanisms.name as toggleMechanism, toggleMechanisms.id as toggleMechanismId,
        frames.name as frame, frames.id as frameId,
        products.size_width as sizeWidth, products.size_length as sizeLength,
        products.general_size_width as generalSizeWidth, products.general_size_length as generalSizeLength,
        products.general_size_height as generalSizeHeight, products.note, products.isDeleted,
        group_concat(product_photos.photo_name) as photos,
        price_products.special_price as specialPrice,
        price_products.first_category as firstCategory,
        price_products.second_category as secondCategory,
        price_products.thirdary_category as thirdaryCategory,
        price_products.fourth_category as fourthCategory,
        price_products.fives_category as fivesCategory,
        prices.currency as currencySymbol
     FROM products
     LEFT JOIN product_photos ON products.id = product_photos.product_id
     JOIN fillings ON products.fill_id = fillings.id
     JOIN toggleMechanisms ON products.toggle_mechanism_id = toggleMechanisms.id
     JOIN frames ON products.frame_id = frames.id
     LEFT JOIN price_products ON products.id = price_products.product_id  and price_products.price_id = ${userPriceId}
     LEFT JOIN prices ON ${userPriceId} = prices.id
     where products.isDeleted = false
     GROUP BY products.id
     ORDER BY -products.sort DESC, products.sort DESC`,
  );

  return ctx.body = products;
});

router.get('/api/retail/products', authMiddleware, async (ctx) => {
  const [[retailPrice]] = await sequelize.query(`
      SELECT id
      FROM prices
      WHERE isRetail = true
  `);

  let retailPriceId = null;

  if (retailPrice && retailPrice.id) {
    retailPriceId = retailPrice.id;
  }

  const [products] = await sequelize.query(
    `SELECT products.id, products.name, products.type,
        fillings.name as filling, fillings.id as fillingId,
        toggleMechanisms.name as toggleMechanism, toggleMechanisms.id as toggleMechanismId,
        frames.name as frame, frames.id as frameId,
        products.size_width as sizeWidth, products.size_length as sizeLength,
        products.general_size_width as generalSizeWidth, products.general_size_length as generalSizeLength,
        products.general_size_height as generalSizeHeight, products.note, products.isDeleted,
        group_concat(product_photos.photo_name) as photos,
        price_products.special_price as specialPrice,
        price_products.first_category as firstCategory,
        price_products.second_category as secondCategory,
        price_products.thirdary_category as thirdaryCategory,
        price_products.fourth_category as fourthCategory,
        price_products.fives_category as fivesCategory,
        prices.currency as currencySymbol
     FROM products
     LEFT JOIN product_photos ON products.id = product_photos.product_id
     JOIN fillings ON products.fill_id = fillings.id
     JOIN toggleMechanisms ON products.toggle_mechanism_id = toggleMechanisms.id
     JOIN frames ON products.frame_id = frames.id
     LEFT JOIN price_products ON products.id = price_products.product_id
     and price_products.price_id = ${retailPriceId}
     LEFT JOIN prices ON ${retailPriceId} = prices.id
     where products.isDeleted = false
     GROUP BY products.id`,
  );

  return ctx.body = products;
});

router.get('/api/product/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[products]] = await sequelize.query(
    `SELECT products.id, products.name, products.type,
        products.fill_id as fillId,
        products.toggle_mechanism_id as toggleMechanismId,
        products.frame_id as frameId,
        products.size_width as sizeWidth, products.size_length as sizeLength,
        products.general_size_width as generalSizeWidth, products.general_size_length as generalSizeLength,
        products.general_size_height as generalSizeHeight, products.note, products.isDeleted,
        group_concat(product_photos.photo_name) as photos
     FROM products
     LEFT JOIN product_photos ON products.id = product_photos.product_id
     where products.id = ${id}`,
  );

  if (!products || products.isDeleted) {
    ctx.status = 500;

    return ctx.body = {
      message: 'productsNotFound',
    };
  }

  return ctx.body = products;
});

router.post('/api/products', authMiddleware, async (ctx) => {
  const {
    name,
    type,
    fill_id,
    toggle_mechanism_id,
    frame_id,
    size_width,
    size_length,
    general_size_width,
    general_size_length,
    general_size_height,
    note,
  } = ctx.request.body;
  const { files } = ctx.request.files;
  const userRole = ctx.user.role;

  const isEmptyName = validator.isEmpty(name, { ignore_whitespace: true });
  const isEmptyType = validator.isEmpty(type, { ignore_whitespace: true });
  const hasNameLength = validator.isLength(name, { min: 2, max: 100 });
  const isEmptyFill = validator.isEmpty(fill_id, { ignore_whitespace: true });
  const isEmptyToggleMechanism = validator.isEmpty(toggle_mechanism_id, { ignore_whitespace: true });
  const isEmptyFrame = validator.isEmpty(frame_id, { ignore_whitespace: true });
  const isEmptySizeWidth = validator.isEmpty(size_width, { ignore_whitespace: true });
  const isEmptySizeLength = validator.isEmpty(size_length, { ignore_whitespace: true });
  const isEmptyGeneralSizeWidth = validator.isEmpty(general_size_width, { ignore_whitespace: true });
  const isEmptyGeneralSizeLength = validator.isEmpty(general_size_length, { ignore_whitespace: true });
  const isEmptyGeneralSizeHeight = validator.isEmpty(general_size_height, { ignore_whitespace: true });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyName || !hasNameLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'productNameFormatError',
    };
  }

  if (
    isEmptyFill
    || isEmptyType
    || isEmptyToggleMechanism
    || isEmptyFrame
    || isEmptySizeWidth
    || isEmptySizeLength
    || isEmptyGeneralSizeWidth
    || isEmptyGeneralSizeLength
    || isEmptyGeneralSizeHeight
  ) {
    ctx.status = 500;

    return ctx.body = {
      message: 'productNotFilledAllData',
    };
  }

  const [isCreatedProduct] = await sequelize.query(
    `SELECT name FROM products where name = '${name}'`,
  );

  if (isCreatedProduct.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'productsNameIsUsed',
    };
  }

  const path = `./files/products/${name}`;

  await Product.create({
    name,
    type,
    fill_id,
    toggle_mechanism_id,
    frame_id,
    size_width,
    size_length,
    general_size_width,
    general_size_length,
    general_size_height,
    note: note || '',
    creater_id: ctx.user.id,
  });

  const [[createdProduct]] = await sequelize.query(
    `SELECT * FROM products where name = '${name}'`,
  );

  if (files) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    let query = 'INSERT INTO product_photos (product_id, photo_name) VALUES';

    const preparedFiles = Array.isArray(files) ? [...files] : [files];

    preparedFiles.forEach((item, index) => {
      fs.copyFileSync(item.path, `${path}/${item.name}`);

      if (index === preparedFiles.length - 1) {
        query += `(${createdProduct.id}, '${item.name}')`;
      } else {
        query += `(${createdProduct.id}, '${item.name}'), `;
      }
    });

    await sequelize.query(query);
  }

  const [[newProduct]] = await sequelize.query(
    `SELECT products.id, products.name, products.type,
        fillings.name as filling,
        toggleMechanisms.name as toggleMechanism,
        frames.name as frame,
        products.size_width as sizeWidth, products.size_length as sizeLength,
        products.general_size_width as generalSizeWidth, products.general_size_length as generalSizeLength,
        products.general_size_height as generalSizeHeight, products.note, products.isDeleted,
        group_concat(product_photos.photo_name) as photos
     FROM products
     LEFT JOIN product_photos ON products.id = product_photos.product_id
     JOIN fillings ON products.fill_id = fillings.id
     JOIN toggleMechanisms ON products.toggle_mechanism_id = toggleMechanisms.id
     JOIN frames ON products.frame_id = frames.id
     where products.name = '${name}'`,
  );

  return ctx.body = {
    data: newProduct,
    message: 'productSuccessCreated',
  };
});

router.put('/api/products/:id', authMiddleware, async (ctx) => {
  const {
    name,
    type,
    fill_id,
    toggle_mechanism_id,
    frame_id,
    size_width,
    size_length,
    general_size_width,
    general_size_length,
    general_size_height,
    note,
  } = ctx.request.body;
  const { files } = ctx.request.files;
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  const isEmptyName = validator.isEmpty(name, { ignore_whitespace: true });
  const isEmptyType = validator.isEmpty(type, { ignore_whitespace: true });
  const hasNameLength = validator.isLength(name, { min: 2, max: 100 });
  const isEmptyFill = validator.isEmpty(fill_id, { ignore_whitespace: true });
  const isEmptyToggleMechanism = validator.isEmpty(toggle_mechanism_id, { ignore_whitespace: true });
  const isEmptyFrame = validator.isEmpty(frame_id, { ignore_whitespace: true });
  const isEmptySizeWidth = validator.isEmpty(size_width, { ignore_whitespace: true });
  const isEmptySizeLength = validator.isEmpty(size_length, { ignore_whitespace: true });
  const isEmptyGeneralSizeWidth = validator.isEmpty(general_size_width, { ignore_whitespace: true });
  const isEmptyGeneralSizeLength = validator.isEmpty(general_size_length, { ignore_whitespace: true });
  const isEmptyGeneralSizeHeight = validator.isEmpty(general_size_height, { ignore_whitespace: true });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyName || !hasNameLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'productNameFormatError',
    };
  }

  if (
    isEmptyFill
    || isEmptyType
    || isEmptyToggleMechanism
    || isEmptyFrame
    || isEmptySizeWidth
    || isEmptySizeLength
    || isEmptyGeneralSizeWidth
    || isEmptyGeneralSizeLength
    || isEmptyGeneralSizeHeight
  ) {
    ctx.status = 500;

    return ctx.body = {
      message: 'productNotFilledAllData',
    };
  }

  const [isRealProduct] = await sequelize.query(
    `SELECT name FROM products where id = ${id}`,
  );

  if (!isRealProduct.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'productNotFound',
    };
  }

  const [isUsedNameProduct] = await sequelize.query(
    `SELECT name FROM products where name = '${name}' and id != ${id}`,
  );

  if (isUsedNameProduct.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'productsNameIsUsed',
    };
  }

  const oldPath = `./files/products/${isRealProduct[0].name}`;
  const newPath = `./files/products/${name}`;

  if (fs.existsSync(oldPath)) {
    fs.rmdirSync(oldPath, { recursive: true });

    await sequelize.query(`DELETE FROM product_photos WHERE product_id=${id}`);
  }

  if (files) {
    let query = 'INSERT INTO product_photos (product_id, photo_name) VALUES';

    const preparedFiles = Array.isArray(files) ? [...files] : [files];

    fs.mkdirSync(newPath);

    preparedFiles.forEach((item, index) => {
      fs.copyFileSync(item.path, `${newPath}/${item.name}`);

      if (index === preparedFiles.length - 1) {
        query += `(${id}, '${item.name}')`;
      } else {
        query += `(${id}, '${item.name}'), `;
      }
    });

    await sequelize.query(query);
  }

  await Product.update(
    {
      name,
      type,
      fill_id,
      toggle_mechanism_id,
      frame_id,
      size_width,
      size_length,
      general_size_width,
      general_size_length,
      general_size_height,
      note: note || '',
      data_update: new Date(),
    },
    { where: { id } },
  );

  const [[updatedProduct]] = await sequelize.query(
    `SELECT products.id, products.name, products.type,
        fillings.name as filling,
        toggleMechanisms.name as toggleMechanism,
        frames.name as frame,
        products.size_width as sizeWidth, products.size_length as sizeLength,
        products.general_size_width as generalSizeWidth, products.general_size_length as generalSizeLength,
        products.general_size_height as generalSizeHeight, products.note, products.isDeleted,
        group_concat(product_photos.photo_name) as photos
     FROM products
     LEFT JOIN product_photos ON products.id = product_photos.product_id
     JOIN fillings ON products.fill_id = fillings.id
     JOIN toggleMechanisms ON products.toggle_mechanism_id = toggleMechanisms.id
     JOIN frames ON products.frame_id = frames.id
     where products.id = ${id}`,
  );

  return ctx.body = {
    data: updatedProduct,
    message: 'productSuccessUpdate',
  };
});

router.delete('/api/product/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealProduct] = await sequelize.query(
    `SELECT name FROM products where id = '${id}'`,
  );

  if (!isRealProduct.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'productNotFound',
    };
  }

  const path = `./files/products/${isRealProduct[0].name}`;

  if (fs.existsSync(path)) {
    fs.rmdirSync(path, { recursive: true });

    await sequelize.query(`DELETE FROM product_photos WHERE product_id=${id}`);
  }

  await Product.update(
    {
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'productSuccessDeleted',
  };
});

module.exports = router;
