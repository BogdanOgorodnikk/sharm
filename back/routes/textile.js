const Router = require('koa-router');

const router = new Router();
const validator = require('validator');
const fs = require('fs');
const { sequelize } = require('../database');
const authMiddleware = require('../middleware/auth.middleware');
const { ROLES_CODE } = require('../constants/roles');
const Textile = require('../models/Textile');

router.get('/api/textiles', authMiddleware, async (ctx) => {
  const [textiles] = await sequelize.query(
    `SELECT *
     FROM textiles
     where isDeleted = false
     ORDER BY textiles.category`,
  );

  return ctx.body = textiles;
});

router.get('/api/textile/:id', authMiddleware, async (ctx) => {
  const userRole = ctx.user.role;
  const { id } = ctx.params;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [[textiles]] = await sequelize.query(
    `SELECT * FROM textiles where id = ${id}`,
  );

  if (!textiles || textiles.isDeleted) {
    ctx.status = 500;

    return ctx.body = {
      message: 'textilesNotFound',
    };
  }

  return ctx.body = textiles;
});

router.post('/api/textiles', authMiddleware, async (ctx) => {
  const { name, category } = ctx.request.body;
  const { file } = ctx.request.files;
  const userRole = ctx.user.role;

  const isEmptyName = validator.isEmpty(name, { ignore_whitespace: true });
  const hasNameLength = validator.isLength(name, { min: 2, max: 100 });
  const isEmptyCategory = validator.isEmpty(category, { ignore_whitespace: true });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyName || !hasNameLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'textileNameFormatError',
    };
  }

  if (isEmptyCategory) {
    ctx.status = 500;

    return ctx.body = {
      message: 'textileCategoryFormatError',
    };
  }

  const [isCreatedTextile] = await sequelize.query(
    `SELECT name FROM textiles where name = '${name}'`,
  );

  if (isCreatedTextile.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'textilesNameIsUsed',
    };
  }

  const path = `./files/textile/${name}`;

  if (file) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    const directoryValue = fs.readdirSync(path);
    const isEmptyDirectory = !directoryValue.length;

    if (!isEmptyDirectory) {
      fs.unlinkSync(`${path}/${directoryValue[0]}`);
    }

    await fs.copyFileSync(file.path, `${path}/${file.name}`);
  }

  await Textile.create({
    name,
    category,
    textile_image: file ? file.name : '',
  });

  const [[createdTextile]] = await sequelize.query(
    `SELECT * FROM textiles where name = '${name}'`,
  );

  return ctx.body = {
    data: createdTextile,
    message: 'textileSuccessCreated',
  };
});

router.put('/api/textiles/:id', authMiddleware, async (ctx) => {
  const { name, category } = ctx.request.body;
  const { file } = ctx.request.files;
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  const isEmptyName = validator.isEmpty(name, { ignore_whitespace: true });
  const hasNameLength = validator.isLength(name, { min: 2, max: 100 });
  const isEmptyCategory = validator.isEmpty(category, { ignore_whitespace: true });

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  if (isEmptyName || !hasNameLength) {
    ctx.status = 500;

    return ctx.body = {
      message: 'textileNameFormatError',
    };
  }

  if (isEmptyCategory) {
    ctx.status = 500;

    return ctx.body = {
      message: 'textileCategoryFormatError',
    };
  }

  const [isRealTextile] = await sequelize.query(
    `SELECT name FROM textiles where id = ${id}`,
  );

  if (!isRealTextile.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'textileNotFound',
    };
  }

  const [isUsedNameTextile] = await sequelize.query(
    `SELECT name FROM textiles where name = '${name}' and id != ${id}`,
  );

  if (isUsedNameTextile.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'textilesNameIsUsed',
    };
  }

  const oldPath = `./files/textile/${isRealTextile[0].name}`;
  const newPath = `./files/textile/${name}`;
  const isSimilarPath = oldPath === newPath;

  if (file) {
    if (isSimilarPath) {
      if (!fs.existsSync(oldPath)) {
        fs.mkdirSync(oldPath);
      }

      const directoryValue = fs.readdirSync(oldPath);
      const isEmptyDirectory = !directoryValue.length;

      if (!isEmptyDirectory) {
        fs.unlinkSync(`${oldPath}/${directoryValue[0]}`);
      }

      await fs.copyFileSync(file.path, `${oldPath}/${file.name}`);
    } else {
      if (fs.existsSync(oldPath)) {
        fs.rmdirSync(oldPath, { recursive: true });
      }

      fs.mkdirSync(newPath);

      await fs.copyFileSync(file.path, `${newPath}/${file.name}`);
    }
  } else if (fs.existsSync(oldPath)) {
    fs.rmdirSync(oldPath, { recursive: true });
  }

  await Textile.update(
    {
      name,
      category,
      textile_image: file ? file.name : '',
    },
    { where: { id } },
  );

  const [[updatedTextile]] = await sequelize.query(
    `SELECT * FROM textiles where id = '${id}'`,
  );

  return ctx.body = {
    data: updatedTextile,
    message: 'textileSuccessUpdate',
  };
});

router.delete('/api/textiles', authMiddleware, async (ctx) => {
  const { query } = ctx;
  const userRole = ctx.user.role;
  const ids = query['ids[]'];

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [updatedData] = await sequelize.query(
    `SELECT name FROM textiles where id IN (${ids})`,
  );

  updatedData.forEach((item) => {
    const path = `./files/textile/${item.name}`;

    if (fs.existsSync(path)) {
      fs.rmdirSync(path, { recursive: true });
    }
  });

  await sequelize.query(
    `UPDATE textiles SET isDeleted = 1, textile_image = '' where id IN (${ids})`,
  );

  return ctx.body = {
    message: 'massTextileSuccessDeleted',
  };
});

router.delete('/api/textile/:id', authMiddleware, async (ctx) => {
  const { id } = ctx.params;
  const userRole = ctx.user.role;

  if (userRole !== ROLES_CODE.admin) {
    ctx.status = 500;

    return ctx.body = {
      message: 'insufficientAccessRights',
    };
  }

  const [isRealTextile] = await sequelize.query(
    `SELECT name FROM textiles where id = '${id}'`,
  );

  if (!isRealTextile.length) {
    ctx.status = 500;

    return ctx.body = {
      message: 'textileNotFound',
    };
  }

  const path = `./files/textile/${isRealTextile[0].name}`;

  if (fs.existsSync(path)) {
    fs.rmdirSync(path, { recursive: true });
  }

  await Textile.update(
    {
      textile_image: '',
      isDeleted: 1,
    },
    { where: { id } },
  );

  return ctx.body = {
    message: 'textileSuccessDeleted',
  };
});

module.exports = router;
