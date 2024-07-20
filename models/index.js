const Users = require('./Users');
const Posts = require('./Posts');
const Comments = require('./Comments');

// A user/author can have many posts
Users.hasMany(Posts, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

// Every post has exactly one user/author
Posts.belongsTo(Users, {
  foreignKey: 'user_id'
});

// A user/author can have many comments
Users.hasMany(Comments, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

// A comment will belong to one user/author
Comments.belongsTo(Users, {
  foreignKey: 'user_id'
});

// A blog post can have many comments
Posts.hasMany(Comments, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE'
});

// A comment will belong to one blog post
Comments.belongsTo(Posts, {
  foreignKey: 'post_id'
});

module.exports = { Users, Posts, Comments };
