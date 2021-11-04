const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
	const [bearer, jsonToken] = req.headers.authorization
		? req.headers.authorization.split(' ')
		: ['No Bearer', 'No Token'];

	if (bearer === 'Bearer' && jsonToken.match(/\S+\.\S+\.\S+/) !== null) {
		const token = await jwt.verify(jsonToken, 'sfdghdfrgjhdgfhjfdtguhr');
		req.jwt = token;
		next();
	} else {
		return res.status(401).json({ msg: 'Unauthorized Access' });
	}
};

module.exports = { authMiddleware };
