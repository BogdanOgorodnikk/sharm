const Router = require('koa-router');

const router = new Router();
const { sequelize } = require('../database');

router.get('/api/region-towns', async (ctx) => {
  const { region } = ctx.query;

  const [towns] = await sequelize.query(
    `SELECT town as label FROM towns where region = '${region}'`,
  );

  return ctx.body = towns;
});

module.exports = router;
