const postContainerEl = document.querySelector('#allComments');
const containerId = postContainerEl.getAttribute('data-posted');

let monitorTime = 0;

const monitorMessages = async () => {
	const checkTime = {
		postTime: monitorTime,
	};

	// send the add new comment request
	const response = await fetch(`/api/comments/posts/${containerId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(checkTime),
	});

	// If successful, update the browser to display the new comments
	if (response.ok) {
		const result = await response.json();
		if (!result.flag) {
			await updatePage();
			monitorTime = result.newTime;
		}
	}
};

const updatePage = async () => {
	// send the add new comment request
	const response = await fetch(`/posts/comments/${containerId}`, {
		method: 'GET',
	});

	// If successful, update the browser to display the new comments
	if (response.ok) {
		const result = await response.text();
		await updateComments(result);
	} else {
		console.log('\nResponse Status: ', response.status);
	}

};

const updateComments = async (newDocument) => {
	const parser = new DOMParser();
	const parsedDocument = parser.parseFromString(newDocument, "text/html");
	const updatedComments = parsedDocument.querySelector('#realComment');
	if (updatedComments) {
		const oldComments = document.querySelector('#realComment');
		oldComments.innerHTML = updatedComments.innerHTML;
	}
};

setInterval(monitorMessages, 5000);