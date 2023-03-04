const createBlogForm = document.querySelector('#blog-form');
const blogListEl = document.querySelector('.blog-list');
const blogTitle = document.querySelector('#blogTitleElement');
const newBlogBtn = document.querySelector('.new-blog');
const saveBlogEl = document.querySelector('#saveBlog');
const updateBlogEl = document.querySelector('#updateBlog');
const cancelBlogEl = document.querySelector('#cancelBlog');
const blogText = document.querySelector('.blog-textarea');
const blogImage = document.querySelector('#blogImage');


// Show an element
const show = (element) => {
  element.style.display = 'inline';
};

// Hide an element
const hide = (element) => {
  element.style.display = 'none';
};

// Save a new blog
const saveBlogHandler = async (event) => {
  event.preventDefault();

  const title = blogTitle.value.trim();
  const text = blogText.value;

  if (title.length === 0 || text.length === 0) {
    alert('Your blog post is incomplete');
    return;
  }

  const submitBlog = new FormData(createBlogForm);
  const response = await fetch(`/api/dashboard/`, {
    method: 'POST',
    body: submitBlog,
  });

  if (response.ok) {
    await response.json();
    cancelBlogHandler();
  } else {
    alert('Failed to create project');
  }
};


// Update a blog
const updateBlogHandler = async (event) => {
  event.preventDefault();

  if (!blogTitle.hasAttribute('data-id')) {
    return;
  }

  blogId = blogTitle.getAttribute('data-id');
  const title = blogTitle.value.trim();
  const text = blogText.value;

  if (title.length === 0 || text.length === 0) {
    alert('Your blog post is incomplete');
    return;
  }

  const submitBlog = new FormData(createBlogForm);
  const response = await fetch(`/api/dashboard/${blogId}`, {
    method: 'PUT',
    body: submitBlog,
  });

  if (response.ok) {
    await response.json();
    cancelBlogHandler();
    blogTitle.removeAttribute('data-id');
  } else {
    alert('Failed to create project');
  }
};

// Cancel any pending new blog creation or update process
const cancelBlogHandler = async (event) => {
  if (blogTitle.hasAttribute('data-id')) {
    blogTitle.removeAttribute('data-id');
  }

  location.reload();
  blogTitle.value = '';
  blogText.value = '';
  blogImage.value = '';
};

// Process the required user request
const userSelectHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');
    const eventType = event.target.getAttribute('id');

    switch (eventType) {
      case "update-blog":
        editBlogHandler(id);
        break;

      case "delete-blog":
        delBlogHandler(id);
        break;

      default:
        location.reload();
    }
  }
};

// Delete a blog
const delBlogHandler = async (blogElement) => {
  const response = await fetch(`/api/dashboard/${blogElement}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await response.json();
      cancelBlogHandler();
      location.reload();
    } else {
    alert('Failed to delete blog');
  }
};

// Prepare the text editor for editing a blog
const editBlogHandler = async (blogElement) => {
  const response = await fetch(`/api/dashboard/${blogElement}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const blogContents = await response.json();

    blogTitle.setAttribute('data-id', blogElement);
    blogTitle.value = blogContents.title;
    blogText.value = blogContents.content;
    if (blogContents.blog_image.length > 0) {
      blogImage.textContent = blogContents.blog_image;
    }

    showUpdateBtn();
  }
};

// Show the update and cancel buttons
const showUpdateBtn = () => {
  show(updateBlogEl);
  show(cancelBlogEl);
  hide(newBlogBtn);
};

// Show the save and cancel buttons
const showSaveBtn = () => {
  if (!blogTitle.value.trim() || !blogTitle.value.trim()) {
    hide(saveBlogEl);
    hide(cancelBlogEl);
    show(newBlogBtn);
  } else {
    show(saveBlogEl);
    show(cancelBlogEl);
    hide(newBlogBtn);
  }
};

// event listeners
saveBlogEl.addEventListener('click', saveBlogHandler);

updateBlogEl.addEventListener('click', updateBlogHandler);

cancelBlogEl.addEventListener('click', cancelBlogHandler);

blogListEl.addEventListener('click', userSelectHandler);

blogTitle.addEventListener('keyup', showSaveBtn);
