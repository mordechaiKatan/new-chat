const mongoose = require('mongoose');
const { mongoUri } = require('../config');

module.exports = async function connect() {
   try {
    return mongoose.connect(mongoUri)
  } catch (e) {
    console.log('could not connect to mongo');
  }
};