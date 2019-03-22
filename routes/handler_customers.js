const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Home Route. Nothing special here
    res.send('Home Route');
});

module.exports = router;