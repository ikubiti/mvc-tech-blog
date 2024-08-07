const router = require('express').Router();
const { Posts } = require('../../models');
const withAuth = require('../../utils/auth');
const remoteConnect = require('../../utils/remoteConnect');
const multer = require('multer');
const upload = multer();

// get a specific post
router.get('/:id', withAuth, upload.any(), async (req, res) => {
  try {
    const blogData = await Posts.findByPk(req.params.id);
    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new blog post
router.post('/', withAuth, upload.any(), async (req, res) => {
  try {
    // Remotely save the blog image
    const { body, files } = req;
    let result = null;
    if (files.length > 0) {
      result = await remoteConnect.uploadFile(
        files[0].buffer,
        files[0].originalname,
        files[0].mimetype
      );
    }

    // Create a new instance of the user model.
    let newBlog = {
      title: body.title,
      content: body.content,
      blog_image: result ? result : '',
      image_alt: result ? files[0].originalname : '',
      user_id: req.session.user_id,
    };

    const blogData = await Posts.create(newBlog);
    res.status(200).json(blogData);
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

    // The image variable is a placeholder for our uploaded image.
    const { body, files } = req;
    console.log('begin: ', body);

    if (files && files.length > 0) {
      if (blogData.blog_image && blogData.blog_image.length > 0) {
        await remoteConnect.deleteFile(blogData.blog_image);
      }
      blogData.blog_image = await remoteConnect.uploadFile(
        files[0].buffer,
        files[0].originalname,
        files[0].mimetype
      );

      blogData.image_alt = files[0].originalname;
    }

    // Reconstruct the blog with parts of the old and new data.
    const newBlog = {
      title: body.title ? body.title : blogData.title,
      content: body.content ? body.content : blogData.content,
      date_modified: Date.now(),
      blog_image: blogData.blog_image,
      image_alt: blogData.image_alt,
      user_id: blogData.user_id,
    };

    const updatedBlog = await Posts.update(newBlog, {
      where: { id: req.params.id },
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: 'No User found with that id!' });
    }

    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
