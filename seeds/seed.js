const sequelize = require('../config/connection');
const { Users, Posts, Comments } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');

  await Users.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log('\n----- USERS SEEDED -----\n');

  await Posts.bulkCreate(postData, {
    returning: true,
  });
  console.log('\n----- BLOG POSTS SEEDED -----\n');

  await Comments.bulkCreate(commentData, {
    returning: true,
  });
  console.log('\n----- BLOG COMMENTS SEEDED -----\n');

  process.exit(0);
};

seedDatabase();
