// Keeps track of comments
const commentData = {};

const saveTime = (postId, postTime) => {
	commentData[postId] = postTime;
};

const updateComment = (postId, postTime) => {
	if (commentData[postId] !== 0 && !commentData[postId]) {
		saveTime(postId, postTime);
		return false;
	}

	return commentData[postId] === postTime;;
};

const removeData = (postId) => {
	if (commentData[postId]) {
		delete commentData[postId];
	}
};

const getCommentTime = (postId) => {
	if (!commentData[postId]) {
		return 0;
	}

	return commentData[postId];
};

module.exports = { saveTime, updateComment, getCommentTime, removeData };