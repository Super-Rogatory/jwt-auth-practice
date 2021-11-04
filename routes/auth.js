/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { users } = require('../fakedb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
			const user = users.find((user) => user.email === email);
			if (user) {
				return res.status(400).json({
					err: 'This user already exists',
				});
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			users.push({
				email,
				password: hashedPassword,
			});

			// DO NOT USE EMAIL IRL
			const token = jwt.sign(
				{
					email,
				},
				'sfdghdfrgjhdgfhjfdtguhr',
				{ expiresIn: 20000 }
			);
			res.json({
				msg: 'Validation Passed - Register',
				token: 'Bearer ' + token,
			});
		} catch (err) {
			//
		}
	}
);

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		let user = users.find((user) => user.email === email);
		if (!user) {
			return res.status(400).send({ msg: 'Invalid Credentials' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({
				msg: 'Invalid Credentials',
			});
		}

		const token = jwt.sign(
			{
				email,
			},
			'sfdghdfrgjhdgfhjfdtguhr',
			{ expiresIn: 20000 }
		);

		res.json({
			msg: 'Validation Passed - Login',
			token: 'Bearer ' + token,
		});
	} catch (err) {
		//
	}
});
module.exports = router;
