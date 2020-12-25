const express = require('express')
const routes = express.Router()

routes.use(express.static(__dirname + "/public/"))

module.exports = routes