const express = require('express');
const app = express();
const PORT = 5000;

// url and body parsing middleware
app.use(express.urlencoded({ extended: true }));
// creates our req.body
app.use(express.json());

app.use('/api', require('./routes/index'));

app.listen(PORT, () => console.log(`Now running on PORT: ${PORT}`));
