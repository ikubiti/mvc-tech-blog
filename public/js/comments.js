// save reference to DOM elements
const newCommentEl = document.getElementById("addComment");
const cancelCommentEl = document.getElementById("cancel");
const commentTextEl = document.querySelector('.comment-textarea');
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