const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const { validateCustomer, Customer } = require('../models/customer');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then(console.log('Connected successfullly to DB from inside : handler_customers.js'))
    .catch(err => console.log('Error in connecting to DB from inside : handler_customers.js'));

router.get('/', async (req, res) => {
    // Send list of all the customers.

    const customers = await Customer.find();
    if (customers.length == 0)
        return res.status(404).send('No records on DB');

    res.send(customers);
});

router.get('/:id', async (req, res) => {
    // Send the requested customer

    // Check if the customer is present and then store it on customer
    const customer = await Customer.findById(req.params.id);

    // If requested customer is not present
    if (!customer) return res.status(404).send('Object not found.');

    // Send customer if found.
    res.send(customer);
});

router.post('/', async (req, res) => {
    // Accept request to add new customer

    // Validate the new customer so sent
    const { error } = validateCustomer(req.body);

    // If invalid, return 400 (Bad Request)
    if (error)
        return res.status(400).send(error.message);

    // Add the new customer to the customers list maintained at the top
    const customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        premium: req.body.premium
    });
    const result = await customer.save();

    // Send the customer back
    res.send(result);
});

router.put('/:id', async (req, res) => {
    // const { error } = validateCustomer(req.body);
    const { error } = Joi.validate(
        req.body,
        { email: Joi.string().regex(new RegExp('[a-z0-9\.]+@gmail\.com'))}
    );
    if (error)
        return res.status(400).send(error.message);

    // Check if the customer is present in the customers list and update
    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        { $set: { email: req.body.email } },
        { new: true }
    );

    // If not present, return 404 (Object Not Found)
    if (!customer) return res.status(404).send('Object not found.');

    // Send the updated customer back
    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    // Delete the specified customer if present

    // Retrieve the customer
    const customer = await Customer.findOneAndDelete(req.params.id);

    // If customer not present, return 404 (Object Not Found)
    if (!customer) return res.status(404).send('Object not found.');

    // Return the deleted customer
    res.send(customer);
});


module.exports = router;