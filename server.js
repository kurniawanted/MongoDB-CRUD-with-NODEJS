const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//const DB = process.env.DATABASE.replace(
//  '<PASSWORD>',
//  process.env.DATABASE_PASSWORD
// );
mongoose.connect('mongodb://127.0.0.1:2701:/results', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
