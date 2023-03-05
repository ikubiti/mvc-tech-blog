const createBlogForm = document.querySelector('#blog-form');
const blogListEl = document.querySelector('.blog-list');
const blogTitle = document.querySelector('#blogTitleElement');
const newBlogEl = document.querySelector('#newBlog');
const saveBlogEl = document.querySelector('#saveBlog');
const updateBlogEl = document.querySelector('#updateBlog');
const cancelBlogEl = document.querySelector('#cancelBlog');
const blogImage = document.querySelector('#blogImage');

const editorText = document.querySelector('#blog-editor');

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],

  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']
];

// Create the quill editor
const blogEditor = new Quill('#blog-editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});

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
  const text = blogEditor.root.innerHTML;

  if (title.length === 0 || text.length === 0) {
    alert('Your blog post is incomplete');
    return;
  }

  const submitBlog = new FormData(createBlogForm);
  submitBlog.append('content', text);
  const response = await fetch(`/api/dashboard/`, {
    method: 'POST',
    body: submitBlog,
  });

  if (response.ok) {
    await response.json();
    cancelBlogHandler();
  } else {
    alert('Failed to create a new blog post');
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
  const text = blogEditor.root.innerHTML;

  if (title.length === 0 || text.length === 0) {
    alert('Your blog post is incomplete');
    return;
  }

  const submitBlog = new FormData(createBlogForm);
  submitBlog.append('content', text);
  const response = await fetch(`/api/dashboard/${blogId}`, {
    method: 'PUT',
    body: submitBlog,
  });

  if (response.ok) {
    await response.json();
    cancelBlogHandler();
    blogTitle.removeAttribute('data-id');
  } else {
    alert('Failed to update blog post');
  }
};

// Cancel any pending new blog creation or update process
const cancelBlogHandler = async (event) => {
  if (blogTitle.hasAttribute('data-id')) {
    blogTitle.removeAttribute('data-id');
  }

  location.reload();
  blogTitle.value = '';
  blogEditor.setContents([{ insert: '\n' }]);
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
    showUpdateBtn();

    blogTitle.setAttribute('data-id', blogElement);
    blogTitle.value = blogContents.title;
    const oldContent = blogEditor.clipboard.convert(blogContents.content);
    blogEditor.setContents(oldContent);
    if (blogContents.blog_image && blogContents.blog_image.length > 0) {
      const msg = `This blog has an attached image called: ${blogContents.image_alt}`;
      document.querySelector('#blogPicture').textContent = msg;
    }
  }
};

// Show the update and cancel buttons
const showUpdateBtn = () => {
  show(updateBlogEl);
  show(cancelBlogEl);
  hide(newBlogEl);
};

// Show the save and cancel buttons
const showSaveBtn = () => {
  if (!blogTitle.value.trim() || !blogTitle.value.trim()) {
    hide(saveBlogEl);
    hide(cancelBlogEl);
    show(newBlogEl);
  } else {
    show(saveBlogEl);
    show(cancelBlogEl);
    hide(newBlogEl);
  }
};

// event listeners
saveBlogEl.addEventListener('click', saveBlogHandler);

updateBlogEl.addEventListener('click', updateBlogHandler);

cancelBlogEl.addEventListener('click', cancelBlogHandler);

blogListEl.addEventListener('click', userSelectHandler);

blogTitle.addEventListener('keyup', showSaveBtn);
