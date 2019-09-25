const router = require('express').Router()
let Location = require('../models/location.model')

//route that defines a get request that will fetch locations by type
router.route('/').get(async (req, res) => {
  try {
    // Location.find() is a promise that finds locations.
    // Since no parameters are passed, all locations are returned.
    const locations = await Location.find()
    return res.json(locations)
  } catch(err) {
    return res.status(400).json(`Error: ${err}`)
  }
})

//route that defines a post request that will filter locations by optional parameters
router.route('/filter').post(async (req, res) => {
  const filter = {}
  const { name, address, city, state, zipcode } = req.body

  if (name !== '') {
    filter.name = { "$regex": `${name}`, "$options": "i" }
  }

  if (address !== '') {
    filter.address = { "$regex": `${address}`, "$options": "i" }

  }

  if (city !== '') {
    filter.city = { "$regex": `${city}`, "$options": "i" }
  }

  if (state !== '') {
    filter.state = { "$regex": `${state}`, "$options": "i" }

  }

  if (zipcode !== '') {
    filter.zipcode = { "$regex": `${zipcode}`, "$options": "i" }
  }

  try {
    const locations = await Location.find(filter)
    return res.json(locations)
  } catch(err) {
    return res.status(400).json(`Error: ${err}`)
  }
})

// route that defines a post request that will add a new location
router.route('/add').post(async (req, res) => {
  // Takes the required fields from the request body
  const { type, name, address, city, state, zipcode, coordinates } = req.body

  // The fields are passed to the constructor to create an instance of Location
  const newLocation = new Location({ type, name, address, city, state, zipcode, coordinates })

  try {
    await newLocation.save()
    return res.json('Location added!')
  } catch(err) {
    return res.status(400).json(`Error: ${err}`)
  }
})

module.exports = router