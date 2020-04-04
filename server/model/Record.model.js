const mongoose = require('mongoose')

const RecordSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  amount:{
    type: Number,
    required: true
  },
  time:{
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Record',RecordSchema)