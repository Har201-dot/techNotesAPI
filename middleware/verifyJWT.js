const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT (JSON Web Token) in the request.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.status(403).json({ message: "Forbidden" });

		req.user = decoded.UserInfo.username;
		req.roles = decoded.UserInfo.roles;
		next();
	});
};

module.exports = verifyJWT;
