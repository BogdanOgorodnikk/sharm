const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);

dotenv.config({ path: root('.env') });

module.exports = {
  PORT: process.env.PORT || 3000,
  USER: process.env.USERD,
  HOST: process.env.HOSTD,
  DATABASE: process.env.DATABASED,
  PASSWORD: process.env.PASSWORDD,
  SECRETKEY: process.env.SECRETKEY,
};
