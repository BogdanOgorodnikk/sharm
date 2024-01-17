const Koa = require('koa');
const bodyParser = require('koa-body');
const koaJson = require('koa-json');
const koaStatic = require('koa-static');
const cors = require('kcors');
const fs = require('fs');
const https = require('https');
const config = require('./config');

const auth = require('./routes/auth');
const towns = require('./routes/towns');
const user = require('./routes/user');
const filling = require('./routes/filling');
const toggleMechanism = require('./routes/toggleMechanism');
const frame = require('./routes/frame');
const textile = require('./routes/textile');
const product = require('./routes/product');
const prices = require('./routes/prices');
const orders = require('./routes/orders');
const orderProducts = require('./routes/orderProducts');
const clients = require('./routes/clients');
const payments = require('./routes/payments');
const car = require('./routes/car');
const trailer = require('./routes/trailer');
const driver = require('./routes/driver');
const transportInvoice = require('./routes/transportInvoice');

const app = new Koa();

app.use(bodyParser({ multipart: true }));
app.use(koaJson());
app.use(koaStatic('./files', { defer: true }));
app.use(cors());

app.use(auth.routes());
app.use(towns.routes());
app.use(user.routes());
app.use(filling.routes());
app.use(toggleMechanism.routes());
app.use(frame.routes());
app.use(textile.routes());
app.use(product.routes());
app.use(prices.routes());
app.use(orders.routes());
app.use(orderProducts.routes());
app.use(clients.routes());
app.use(payments.routes());
app.use(car.routes());
app.use(trailer.routes());
app.use(driver.routes());
app.use(transportInvoice.routes());

// app.listen(config.PORT, () => {
//   console.log(`Server listening on port ${config.PORT}`);
// });

const ssl = {
  key: fs.readFileSync('./cert/key.pem', 'utf8'),
  cert: fs.readFileSync('./cert/cert.pem', 'utf8'),
};

https.createServer(ssl, app.callback()).listen(config.PORT);
