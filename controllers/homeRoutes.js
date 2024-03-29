const router = require('express').Router();
const { Posts, Users, Comments } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all Posts and JOIN with user data
    const allPostedBlogs = await Posts.findAll({
      include: [
        {
          model: Users,
          attributes: ['name', 'email', 'avatar'],
        },
      ],
    });


    // Serialize data so the template can read it
    const allPosts = allPostedBlogs.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      allPosts,
      logged_in: req.session.logged_in,
      blogID: req.session.user_id,
      user_name: req.session.full_name,
      user_image: req.session.user_image,
      user_alt: req.session.user_alt
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const blogData = await Posts.findByPk(req.params.id, {
      include: [
        {
          model: Users,
          attributes: ['name', 'email', 'id'],
        },
        {
          model: Comments,
        },
      ],
    });

    const aPost = blogData.get({ plain: true });
    for (let i = 0; i < aPost.comments.length; i++) {
      let comment = aPost.comments[i];
      const { name } = await Users.findByPk(comment.user_id);
      comment.writer = name;
      comment.isAllowed = comment.user_id === req.session.user_id;
    }

    res.render('posts', {
      ...aPost,
      logged_in: req.session.logged_in,
      blogID: req.session.user_id,
      user_name: req.session.full_name,
      user_image: req.session.user_image,
      user_alt: req.session.user_alt
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await Users.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Posts }, { model: Comments }],
    });

    const user = userData.get({ plain: true });
    res.render('dashboard', {
      ...user,
      logged_in: true,
      blogID: req.session.user_id,
      user_name: req.session.full_name,
      user_image: req.session.user_image,
      user_alt: req.session.user_alt
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// update comments
router.get('/posts/comments/:id', async (req, res) => {
  try {
    const blogData = await Posts.findByPk(req.params.id, {
      include: [
        {
          model: Users,
          attributes: ['name', 'email', 'id'],
        },
        {
          model: Comments,
        },
      ],
    });

    const aPost = blogData.get({ plain: true });
    for (let i = 0; i < aPost.comments.length; i++) {
      let comment = aPost.comments[i];
      const { name } = await Users.findByPk(comment.user_id);
      comment.writer = name;
      comment.isAllowed = comment.user_id === req.session.user_id;
    }

    res.render('posts', {
      ...aPost,
      logged_in: req.session.logged_in,
      blogID: req.session.user_id,
      user_name: req.session.full_name,
      user_image: req.session.user_image,
      user_alt: req.session.user_alt
    }, (err, html) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.send(html);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
