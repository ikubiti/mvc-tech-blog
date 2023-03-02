const createBlogForm = document.querySelector('.new-blog-form');

const newFormHandler = async (event) => {
  event.preventDefault();

  const submitBlog = new FormData(createBlogForm);

  const response = await fetch(`/api/dashboard`, {
    method: 'POST',
    body: submitBlog,
  });

  if (response.ok) {
    await response.json();
    location.reload();
  } else {
    alert('Failed to create project');
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await response.json();
      location.reload();
    } else {
      alert('Failed to delete project');
    }
  }
};

createBlogForm.addEventListener('submit', newFormHandler);

document
  .querySelector('.blog-list')
  .addEventListener('click', delButtonHandler);
