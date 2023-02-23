const User = require('./Users');
const BlogPost = require('./Posts');

User.hasMany(BlogPost, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

BlogPost.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, BlogPost };
