const data = require('./countries');

// ponytail: linear scan over ~250 rows per request; build a Map if the list ever grows.
module.exports = name =>
  name ? data.find(o => o.name.toLowerCase() === String(name).toLowerCase()) : undefined;
