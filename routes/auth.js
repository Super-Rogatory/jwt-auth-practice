/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const users = require('../fakedb');
const bcrypt = require('bcrypt');

router.get('/all', (req, res, next) => {
	res.json({ users });
});

router.post(
	'/register',
	[
		check('email', 'Please provide a valid email').isEmail(),
		check('password', 'Please provide a password that is greater than five characters').isLength({
			min: 6,
		}),
	],
	async (req, res, next) => {
		try {
			// VALIDATE THE INPUT
			const { email, password } = req.body;
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
				});
			}

			// VALIDATE IF USER DOESN'T ALREADY EXIST
			let user = users.find((user) => user.email === email);
			if (user) {
				return res.status(400).json({
					err: 'This user already exists',
				});
			}
			let hashedPassword = await bcrypt.hash(password, 10);
			users.push({
				email,
				password: hashedPassword,
			});

			res.send('Validation Passed');
		} catch (err) {
			//
		}
	}
);

module.exports = router;
