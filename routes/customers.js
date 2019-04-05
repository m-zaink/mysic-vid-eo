const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const { validateCustomer, Customer } = require('../models/customer');

router.get('/', async (req, res) => {
	const customers = await Customer.find()
		.sort('name')
		.select('name premium -_id');
	if (customers.length == 0) return res.status(404).send('No records on DB');

	res.send(customers);
});

router.get('/specific', async (req, res) => {
	const { error } = Joi.validate(req.body, {
		email: Joi.string()
			.required()
			.email()
	});
	if (error) return res.status(400).send(error.message);

	try {
		const customer = await Customer.findOne({
			email: req.body.email
		});
		// if (!customer) throw new Error();
		res.send(_.pick(customer, ['name', 'premium']));
	} catch (err) {
		res.status(404).send('Object not found.');
	}
});

router.post('/', async (req, res) => {
	// Accept request to add new customer

	const { error } = validateCustomer(req.body);

	if (error) return res.status(400).send(error.message);

	try {
		const customer = new Customer(
			_.pick(req.body, ['name', 'email', 'premium'])
		);
		const result = await customer.save();
		res.send(_.pick(result, ['id', 'name', 'email', 'premium']));
	} catch (err) {
		console.log(err['message']);
		res.status(404).send('That email is already registered!');
	}
});

router.put('/', async (req, res) => {
	const { error } = Joi.validate(req.body, {
		old_email: Joi.string()
			.max(255)
			.email()
			.required(),
		new_email: Joi.string()
			.max(255)
			.email()
			.required()
	});

	if (error) return res.status(400).send(error.message);

	try {
		const customer = await Customer.findOneAndUpdate(
			{ email: req.body.old_email },
			{ $set: { email: req.body.new_email } },
			{ new: true }
		);
		res.send(_.pick(customer, ['name', 'email', 'premium']));
	} catch (err) {
		res.status(404).send('Object not found.');
	}
});

router.delete('/:id', async (req, res) => {
	try {
		// Delete the specified customer if present
		// And retrieve the customer
		// Return the deleted customer
		const customer = await Customer.findByIdAndDelete(req.params.id);
		if (!customer) throw new Error();
		res.send(_.pick(customer, ['name', 'email', 'premium']));
	} catch (errr) {
		res.status(404).send('Object not found.');
	}
});

module.exports = router;
