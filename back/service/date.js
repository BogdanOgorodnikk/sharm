const { format } = require('date-fns');

function parsedDate(date) {
  const [day, month, year] = date.split('.');

  return format(new Date(year, month - 1, day), 'yyyy-MM-dd');
}

module.exports = parsedDate;
