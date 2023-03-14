const router = require('express').Router();
const { Comments } = require('../../models');
const withAuth = require('../../utils/auth');
const commentTracker = require('../../utils/commentTrack');

// create a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    const { dataValues } = await Comments.create({
      post_id: req.body.post_index,
      comment: req.body.comment,
      user_id: req.session.user_id,
    });

    commentTracker.saveTime(req.body.post_index, dataValues.date_posted.getTime());
    res.status(200).json(dataValues);
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

    let deleteTime = new Date().getTime();
    commentTracker.saveTime(req.body.post_index, deleteTime);
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a comment
router.put('/:id', withAuth, async (req, res) => {
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

    let updateTime = new Date(commentData.date_posted).getTime();
    commentTracker.saveTime(commentData.post_id, updateTime);
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update comments
router.post('/posts/:id', async (req, res) => {
  try {
    const flag = commentTracker.updateComment(req.params.id, req.body.postTime);
    const newTime = commentTracker.getCommentTime(req.params.id);

    const postDate = {
      flag: flag,
      newTime: newTime
    };

    res.status(200).json(postDate);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
