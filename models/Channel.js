const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  participants: [String],
  messages: [{fullName: String,newMessage: String}]
})

const Channel = mongoose.model('Channel', ChannelSchema);

module.exports = Channel;