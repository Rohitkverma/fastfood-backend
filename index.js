const express = require('express')
const app = express()
const port = 5000
const mongoDB = require('./db');
mongoDB();
const cors = require('cors');
app.get('/', (req, res) => {
  res.send('Hello cha-ccha hij ji')
})
app.use(cors({
  origin: '*'
}));

app.use(express.json());
app.use('/api', require('./Routes/CreatUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData'));

app.listen(port, () => {
  console.log(`This app listening on port ${port}`)
})
