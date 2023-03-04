const router = require('express').Router();
const { Users } = require('../../models');
const remoteConnect = require('../../utils/remoteConnect');
const multer = require('multer');
const upload = multer();
const withAuth = require('../../utils/auth');
const theUser = require('../../utils/currentUser');

router.post('/', upload.any(), async (req, res) => {
  try {
    // The image variable is a placeholder for our uploaded image.
    const { body, files } = req;
    let result = await remoteConnect.saveFiles(files);

    // Create a new instance of the user model.
    let newUser = {
      name: body.fullName,
      username: body.username,
      email: body.email,
      avatar: `https://drive.google.com/uc?export=view&id=${result.file_id}`,
      image_alt: result.name,
      password: body.password,
    };
    const userData = await Users.create(newUser);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      theUser.saveUser(userData.dataValues);

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await Users.findOne({ where: { username: req.body.username } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      theUser.saveUser(userData.dataValues);

      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    theUser.removeUser(req.session.user_id);
    // req.session.user_id = userData.id;
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// GET all Users
router.get('/', withAuth, async (req, res) => {
  try {
    const userData = await Users.findAll({
      exclude: ['password'],
    }
    );
    const users = userData.map((user) => user.get({ plain: true }));

    res.status(200).json(users);
  } catch (err) {
    return res.status(404).json(err), console.log(err);
  };
});

// GET User by id
router.get('/:id', withAuth, async (req, res) => {
  try {
    const userData = await Users.findByPk(req.params.id, {
      exclude: ['password'],
    });

    if (!userData) { return res.status(404).json({ message: 'No User found with that id!' }); };

    res.status(200).json(userData);
  } catch (err) {
    return res.status(404).json(err);
  };
});

// UPDATE a User
router.put('/:id', withAuth, upload.any(), async (req, res) => {
  try {
    const userData = await Users.findByPk(req.params.id);

    // The image variable is a placeholder for our uploaded image.
    const { body, files } = req;

    if (files && files.length > 0) {
      let result = await remoteConnect.saveFiles(files);
      await remoteConnect.deleteFile(userData.avatar);
      userData.avatar = `https://drive.google.com/uc?export=view&id=${result.file_id}`;
      userData.image_alt = result.name;
    }

    // Assuming the body uses our naming conventions
    let newUser = {
      name: body.fullName ? body.fullName : userData.name,
      username: body.username ? body.username : userData.username,
      email: body.email ? body.email : userData.email,
      avatar: userData.avatar,
      image_alt: userData.image_alt,
      password: body.password ? body.password : userData.password,
    };

    const updatedUser = await Users.update(newUser,
      {
        where: { id: req.params.id }
      });

    if (!updatedUser) {
      return res.status(404).json({ message: 'No User found with that id!' });
    };

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json(err);
  };
});

// DELETE a User
router.delete('/:id', withAuth, async (req, res) => {
  try {
    let userData = await Users.findByPk(req.params.id);
    await remoteConnect.deleteFile(userData.avatar);
    userData = await Users.destroy({
      where: { id: req.params.id }
    });

    if (!userData) {
      return res.status(404).json({ message: 'No User found with this id!' });
    };

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  };
});

module.exports = router;
