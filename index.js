// ------------ Imports ---------------
const express = require('express');
const helmet = require('helmet');
const startup = require('debug')('startup-log');

const root = require('./routes/landing');
const genres = require('./routes/genres');
const customers = require('./routes/handler_customers');

// ---------- Basic Setup -------------
const app = express();
app.use(express.json());
app.use(helmet());


app.use('/', root);
app.use('/api/genres', genres);
app.use('/api/customers', customers);

// ------------ Logic -----------------
const port = process.env.PORT || 3000;

try {
    app.listen(port, (req, res) => console.log(`LISTENING ON PORT ${port} ...`));
} catch(ex) {
    startup('Error in listening : ', ex.message);
}

