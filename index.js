const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

mongoose.connect(HOST, {useNewUrlParser: true})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("mongo OK!")
});

const jobsSchema = new mongoose.Schema({
  name: String,
  city: [],
  category: [],
  section: [],
})
const Job = mongoose.model("jobs", jobsSchema)

const app = express()
const port = 4000

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('naber ya'))

app.get('/api/list', (req, res) => {
  Job.find( (err, data) => {
      if (err) return res.json({ success: false, error: err })
      return res.json({ success: true, jobs: data })
  })
})

app.post('/api/search', (req, res) => {
  let query = {}
  if (req.body.sections.length > 0) {
    query.section = { $in: req.body.sections }
  }
  if (req.body.cities.length > 0) {
    query.city = { $in: req.body.cities }
  }
  if (req.body.categories.length > 0) {
    query.category = { $in: req.body.categories }
  }
  
  Job.find(query, (err, data) => {
    if (err) return res.json({ success: false, error: err })
    return res.json({ success: true, jobs: data })
  })
})

app.listen(port, () => console.log('backend server is running'))
