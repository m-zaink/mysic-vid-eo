// ------------ Imports ---------------
const express = require('express');
const helmet = require('helmet');

const genres = require('./routes/genres');
const root = require('./routes/landing');
const startup = require('debug')('startup-log');

// ---------- Basic Setup -------------
const app = express();
app.use(express.json());


app.use('/api/genres', genres);
app.use('/', root);
app.use(helmet());

// ------------ Logic -----------------
const port = process.env.PORT || 3000;

try {
    app.listen(port, (req, res) => console.log(`LISTENING ON PORT ${port} ...`));
} catch(ex) {
    startup('Error in listening : ', ex.message);
}

