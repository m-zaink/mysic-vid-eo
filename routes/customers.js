const _ = require("lodash");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");
const { validateCustomer, Customer } = require("../models/customer");

mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(
    console.log(
      "Connected successfullly to DB from inside : handler_customers.js"
    )
  )
  .catch(err =>
    console.log("Error in connecting to DB from inside : handler_customers.js")
  );

// ----------------------------------------------------------------------------

router.get("/", async (req, res) => {
  // Send list of all the customers.

  const customers = await Customer.find().sort("name");
  if (customers.length == 0) return res.status(404).send("No records on DB");

  res.send(customers);
});

router.get("/:id", async (req, res) => {
  
  try {
    // Check if the customer is present and then store it on customer
    const customer = await Customer.findById(req.params.id);
    // Send the requested customer
    res.send(customer);
  } catch(err) {
    // If requested customer is not present
    res.status(404).send("Object not found.");
  }
});

router.post("/", async (req, res) => {
  // Accept request to add new customer

  // Validate the new customer
  const { error } = validateCustomer(req.body);

  // If invalid, return 400 (Bad Request)
  if (error) return res.status(400).send(error.message);

  try {
    const customer = new Customer(_.pick(req.body, ["name", "email", "premium"]));
    const result = await customer.save();
    res.send(_.pick(result, ["id", "name", "email", "premium"]));
  } catch (err) {
    console.log(err["message"]);
    res.status(404).send("That email is already registered!");
  }

  // Send the customer back
});

router.put("/:id", async (req, res) => {
  // const { error } = validateCustomer(req.body);
  const { error } = Joi.validate(req.body, {
    email: Joi.string()
      .email()
      .required()
  });
  if (error) return res.status(400).send(error.message);

  // Check if the customer is present in the customers list and update
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: { email: req.body.email } },
      { new: true }
    );
    // Send the updated customer back
    res.send(_.pick(customer, ["id", "name", "email", "premium"]));
  } catch (err) {
    // If not present, return 404 (Object Not Found)
    res.status(404).send("Object not found.");
  }
});

router.delete("/:id", async (req, res) => {
  
  try {
    // Delete the specified customer if present
    // And retrieve the customer
    const customer = await Customer.findByIdAndDelete(req.params.id);
    // Return the deleted customer
    res.send(_.pick(customer, ['name', 'email', 'premium']));
  } catch (errr) {
    // If customer not present, return 404 (Object Not Found)
    res.status(404).send("Object not found.");
  }
});

module.exports = router;
