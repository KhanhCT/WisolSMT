var axios = require('axios')
var config = require('config')
const service = axios.create({
    baseURL: process.env.BASE_API || config.get('auth_api'), 
    timeout: 5000,
    headers: {'Content-Type': 'application/json'}
});

module.exports = service;