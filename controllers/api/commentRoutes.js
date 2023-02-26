const router = require('express').Router();
const { DataTypes } = require('sequelize');
const { Comments } = require('../../models');
const withAuth = require('../../utils/auth');

// create a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comments.create({
      post_id: req.body.post_index,
      comment: req.body.comment,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete a comment
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comments.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No Comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a comment
router.put('/:id', async (req, res) => {
  try {
    const commentData = {
      post_id: req.body.post_index,
      comment: req.body.comment,
      user_id: req.session.user_id,
      date_posted: req.body.date,
    };
    const updatedComment = await Comments.update(commentData, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
