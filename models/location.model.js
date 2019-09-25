const mongoose = require('mongoose')
const Schema = mongoose.Schema

// defines the schema for a location
const locationSchema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  coordinates: { type: Array, required: true }
}, {
  // This option will automatically include a field showing when
  // a exercise was created and/or modified
  timestamps: true
})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location