const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  participants: [String],
  messages: [{newMessage: String, fullName: String}]
})

const Channel = mongoose.model('Channel', ChannelSchema);

module.exports = Channel;