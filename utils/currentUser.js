const { Users } = require('../models');

const allUser = {};

const getUser = (userId) => {
	let userData = '';
	if (allUser[userId]) {
		userData = allUser[userId];
	} else {
		getUserData(userId);
	}

	return userData;
};

const saveUser = (userData) => {
	const { name, avatar, image_alt } = userData;
	const displayUser = `<h2 class="text-light"><img src="${avatar}" alt="${image_alt}"> ${name}</h2>`;
	allUser[userData.id] = displayUser;
};

const removeUser = (userId) => {
	if (allUser[userId]) {
		delete allUser[userId];
	}
};

const getUserData = async (userId) => {
	const userData = await Users.findByPk(userId, {
		exclude: ['password'],
	});

	saveUser(userData.dataValues);
};

module.exports = { getUser, saveUser, removeUser };