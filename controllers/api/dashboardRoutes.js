const router = require('express').Router();
const { Posts } = require('../../models');
const withAuth = require('../../utils/auth');
const remoteConnect = require('../../utils/remoteConnect');
const multer = require('multer');
const upload = multer();

// create a new blog post
router.post('/', withAuth, upload.any(), async (req, res) => {
  try {
    // Remotely save the blog image
    const { body, files } = req;
    let result = { file_id: 'null', name: 'null' };
    if (files.length > 0) {
      result = await remoteConnect.saveFiles(files);
    }

    // Create a new instance of the user model.
    let newBlog = {
      title: body.title,
      content: body.content,
      blog_image: result.file_id ? `https://drive.google.com/uc?export=view&id=${result.file_id}` : '',
      image_alt: result.name ? result.name : '',
      user_id: req.session.user_id,
    };
    const userData = await Posts.create(newBlog);
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete a blog post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    let blogData = await Posts.findByPk(req.params.id);
    if (blogData.blog_image.length > 0) {
      await remoteConnect.deleteFile(blogData.blog_image);
    }
    blogData = await Posts.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a blog post
router.put('/:id', withAuth, upload.any(), async (req, res) => {
  try {
    const blogData = await Posts.findByPk(req.params.id);
    if (blogData.blog_image.length > 0) {
      await remoteConnect.deleteFile(blogData.blog_image);
    }

    // The image variable is a placeholder for our uploaded image.
    const { body, files } = req;

    if (files && files.length > 0) {
      const result = await remoteConnect.saveFiles(files);
      await remoteConnect.deleteFile(blogData.blog_image);
      blogData.blog_image = `https://drive.google.com/uc?export=view&id=${result.file_id}`;
      blogData.image_alt = result.name;
    }

    // Assuming the body uses our naming conventions
    const newBlog = {
      title: body.title ? body.title : blogData.title,
      content: body.content ? body.content : blogData.content,
      date_modified: Date.now(),
      blog_image: blogData.blog_image,
      image_alt: blogData.image_alt,
      user_id: blogData.user_id,
    };

    const updatedBlog = await Posts.update(newBlog,
      {
        where: { id: req.params.id }
      });

    if (!updatedBlog) {
      return res.status(404).json({ message: 'No User found with that id!' });
    };

    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(404).json(err);
  };
});

module.exports = router;
