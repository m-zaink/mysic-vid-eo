const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model(
	'Rental',
	new mongoose.Schema({
		customer: {
			type: new mongoose.Schema({
				name: {
					type: String,
					required: true,
					minlength: 3,
					maxlength: 50
				},
				premium: {
					type: Boolean,
					default: false
				},
				email: {
					type: String,
					required: true,
					maxlength: 255
				}
			}),
			required: true
		},
		movie: {
			type: new mongoose.Schema({
				title: {
					type: String,
					required: true,
					trim: true,
					minlength: 3,
					maxlength: 255
				},
				dailyRentalRate: {
					type: Number,
					required: true,
					min: 0,
					max: 255
				}
			}),
			required: true
		},
		dateOut: {
			type: Date,
			required: true,
			default: Date.now
		},
		dateReturned: Date,
		rentalFee: {
			type: Number,
			min: 0
		}
	})
);

function validateRental(rental) {
	const schema = {
		customerId: Joi.string().required(),
		movieId: Joi.string().required()
	};

	return Joi.validate(rental, schema);
}
