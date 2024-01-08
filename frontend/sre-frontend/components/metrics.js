// Importing the prom-client library
const client = require('prom-client');

// Creating a Counter to track HTTP request counts
const httpRequestCount = client.register.getSingleMetric('http_requests_total') 
  || new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['path'],
  });

// Exporting the httpRequestCount for use in other files
module.exports = {
  httpRequestCount,
};