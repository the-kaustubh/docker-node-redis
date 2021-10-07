const redis = require('redis')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const db = mongoose.connection

db.on('error', (e) => console.log(e))
db.once('open', () => console.log('Connected to Database'))

const cache = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

cache.on('connect', () => {
  console.log("cache initialised")
})

app.get('/r/:key', (req, res) => {
  cache.get(req.params.key, (_e, r) => {
    console.log(r)
    res.json({msg: r })
  })
})

app.get('/w/:key/:value', (req, res) => {
  console.log({ key: req.params.key, val: req.params.value })
  const x = cache.set(req.params.key, req.params.value)
  res.json({ msg: x })
})

app.listen(3000, () => {
  console.log("Server started")
})
