const express = require('express')
const app = express()
const redis = require('redis')
const cache = redis.createClient(6379, "redis-server")

cache.on('connect', () => {
  console.log("cache initialised")
})

app.get('/', (_req, res) => {
  cache.get('name', (e, r) => {
    console.log(r)
    res.json({msg: r })
  })
})

app.get('/k/:name', (req, res) => {
  console.log(req.params.name)
  const x = cache.set('name', req.params.name)
  res.json({ msg: x })
})

app.listen(3000, () => {
  console.log("Server started")
})
