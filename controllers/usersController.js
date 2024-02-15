const Note = require("../models/Note");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
	const users = await User.find().select("-password").lean();
	if (!users?.length) {
		return res.status(400).json({ message: "No users found" });
	}
	res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
	const { username, password, roles } = req.body;

	if (!username || !password || !Array.isArray(roles) || !roles.length) {
		return res.status(400).json({ message: "All fields are required" });
	}

	// check for duplicate
	const duplicate = await User.findOne({ username }).lean().exec();

	if (duplicate) {
		return res.status(409).json({ message: "duplicate username" });
	}

	//Hash the password
	const hashedPwd = await bcrypt.hash(password, 10);

	const userObject = { username, password: hashedPwd, roles };
	const user = await User.create(userObject);

	if (user) {
		res.status(201).json({ message: `New user ${username} created` });
	} else {
		res.status(400).json({ message: "invalid user data recieved" });
	}
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
	const { id, username, roles, active, password } = req.body;

	if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
		return res.status(400).json({ message: "All fields are required" });
	}

	const user = await User.findById(id).exec();

	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	const duplicate = await User.findOne({ username }).lean().exec();
	// alow updates to the original user
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: "duplicate username" });
	}

	user.username = username;
	user.roles = roles;
	user.active = active;
	if (password) {
		user.password = await bcrypt.hash(password, 10);
	}

	const updatedUser = await user.save();

	res.json({ message: `updated ${updatedUser.username}` });
};

// @desc Delete a user
// @route Delete /users
// @access Private
const deleteUser = async (req, res) => {
	const { id } = req.body;

	if (!id) {
		res.status(400).json({ message: "User ID required" });
	}

	const notes = await Note.findOne({ user: id }).lean().exec();
	if (notes?.length) {
		return res.status(400).json({ message: "User has assigned notes" });
	}

	const user = await User.findById(id).exec();

	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	const result = await user.deleteOne();

	const reply = `Username ${result.username} with ID ${result._id} deleted`;
	res.json(reply);
};

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
};
