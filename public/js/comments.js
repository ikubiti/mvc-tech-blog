// save reference to DOM elements
const newCommentEl = document.getElementById("addComment");
const updateCommentEl = document.getElementById("updateComment");
const cancelCommentEl = document.getElementById("cancel");
const commentTextEl = document.querySelector('#commentText');
const currentPostEl = document.querySelector('#allComments');
// Get the modal
const modalEl = document.getElementById("commentModal");
// Get the button that opens the modal
const btnEl = document.getElementById("newComment");
const okayEl = document.getElementById("okay");
const modalErrorEl = document.getElementById("errorModal");
const errorFeedbackEl = document.getElementById('commentError');

// Process the submission of new comments
newCommentEl.onclick = async (event) => {
	event.preventDefault();
	let newComment = commentTextEl.value.trim();
	let index = JSON.parse(event.target.getAttribute('data-index'));
	closeModal();

	// Return if the comment is empty
	if (newComment.length === 0) return;

	// Create a new comment and send the post request.
	const newNote = {
		post_index: index,
		comment: newComment,
	};

	// send the add new comment request
	const response = await fetch('/api/comments/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newNote),
	});

	// If successful, update the browser to display the new comments
	if (response.ok) {
		await response.json();
		location.reload();
	} else {
		displayError('Failed to add new comment!');
	}
};

// Display any error message
const displayError = (error) => {
	errorFeedbackEl.textContent = error;
	modalErrorEl.style.display = 'block';
};

// close the modal
const closeModal = () => {
	commentTextEl.value = '';
	newCommentEl.style.display = "inline-block";
	updateCommentEl.style.display = "none";
	modalEl.style.display = "none";
};

// When the user clicks the button, open the modal 
btnEl.onclick = () => modalEl.style.display = "block";
okayEl.onclick = () => modalErrorEl.style.display = "none";

// when the user cancels the modal, close it
cancelCommentEl.onclick = () => closeModal();

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
	if (event.target == modalEl) {
		closeModal();
	}
};

currentPostEl.addEventListener("click", async (event) => {
	const element = event.target;
	const elementId = element.getAttribute('id');

	let commentStat = elementId === 'update' || elementId === 'delete';
	if (!commentStat) {
		return;
	}

	const commentContainer = element.parentElement.parentElement;
	commentStat = commentContainer.getAttribute('data-number');
	if (elementId === 'delete') {
		await deleteComment(commentStat);
	} else {
		let index = commentContainer.getAttribute('data-comment');
		await updateComment(commentStat, index);
	}
});


// Update the comment
const updateComment = async (commentId, index) => {
	const commentIndex = 'comment' + index;
	commentTextEl.value = document.getElementById(commentIndex).textContent;
	newCommentEl.style.display = "none";
	updateCommentEl.style.display = "inline-block";
	updateCommentEl.setAttribute('data-comment', commentId);
	modalEl.style.display = "block";
};

// Delete a comment
const deleteComment = async (commentId) => {
	let index = currentPostEl.getAttribute('data-posted');
	const deleteComment = {
		post_index: index,
	};

	const response = await fetch(`/api/comments/${commentId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(deleteComment),
	});

	if (response.ok) {
		location.reload();
	} else {
		displayError('Failed to add delete the comment!');
	}
};

// Process the submission of updated comments
updateCommentEl.onclick = async (event) => {
	event.preventDefault();
	let newComment = commentTextEl.value.trim();
	let index = JSON.parse(event.target.getAttribute('data-index'));
	let commentId = event.target.getAttribute('data-comment');
	closeModal();

	// Return if the comment is empty
	if (newComment.length === 0) return;

	// Create a new comment and send the post request.
	const newNote = {
		post_index: index,
		comment: newComment,
		date: new Date().toISOString(),
	};

	// send the update request
	const response = await fetch(`/api/comments/${commentId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newNote),
	});

	// If successful, update the browser to display the new comments
	if (response.ok) {
		await response.json();
		location.reload();
	} else {
		displayError('Failed to update the comment!');
	}
};