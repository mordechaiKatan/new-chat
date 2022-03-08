require('dotenv').config({ encoding: 'utf8' });

module.exports = {
    mongoUri: process.env.MONGO_URL || 'mongodb://localhost:27017/moty-chat',
    port: process.env.PORT || 8080
  }