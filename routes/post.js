/* eslint-disable no-unused-vars */

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { publicPosts, privatePosts } = require('../fakedb');
const { authMiddleware } = require('../middleware/checkAuth');

router.get('/public', (req, res, next) => {
	res.json(publicPosts);
});

router.get('/private', authMiddleware, (req, res, next) => {
	res.json(privatePosts);
});
module.exports = router;
