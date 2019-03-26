// ------------ Imports ---------------
const express = require('express');
const helmet = require('helmet');
const startup = require('debug')('startup-log');

const home = require('./routes/landing');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');

// ---------- Basic Setup -------------
const app = express();
app.use(express.json());
app.use(helmet());


app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);


// ------------ Logic -----------------
const port = process.env.PORT || 3000;

try {
    app.listen(port, (req, res) => console.log(`LISTENING ON PORT ${port} ...`));
} catch (ex) {
    startup('Error in listening : ', ex.message);
}

