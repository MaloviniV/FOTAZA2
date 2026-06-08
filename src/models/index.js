import User from "./User.js";
import Follow from "./Follow.js";
import Post from "./Post.js";
import File from "./File.js";
import Rating from "./Rating.js";
import Comment from "./Comment.js";

//USER->FOLLOW(m..n)
User.belongsToMany(User, {
  through: Follow,
  as: "following",
  foreignKey: "followerId",
  otherKey: "followingId",
});

User.belongsToMany(User, {
  through: Follow, //indica la tabla que se usara como intermedia
  as: "followers",
  foreignKey: "followingId", //usuario consultado
  otherKey: "followerId", //usuarios devueltos
});

User.hasMany(Follow, {
  foreignKey: "followerId",
  sourceKey: "id", //busca en modelo origen
});

Follow.belongsTo(User, {
  foreignKey: "followerId",
  targetKey: "id",
});

User.hasMany(Follow, {
  foreignKey: "followingId",
  sourceKey: "id", //busca en modelo origen
});

Follow.belongsTo(User, {
  foreignKey: "followingId",
  targetKey: "id",
});

//USER->POST (1..n)
User.hasMany(Post, {
  foreignKey: "idUser",
  sourceKey: "id",
});

Post.belongsTo(User, {
  foreignKey: "idUser",
  targetKey: "id",
});

//POST->FILE
Post.hasMany(File, {
  foreignKey: "idPost",
  sourceKey: "id",
  onDelete: "CASCADE",
  hooks: true,
});

File.belongsTo(Post, {
  foreignKey: "idPost",
  targetKey: "id",
});

//FILE->RATING (1..n)
File.hasMany(Rating, {
  foreignKey: "idFile",
  sourceKey: "id",
  onDelete: "CASCADE",
  hooks: true,
});

Rating.belongsTo(File, {
  foreignKey: "idFile",
  targetKey: "id",
});
//USER->RATING (1..n)
User.hasMany(Rating, {
  foreignKey: "idUser",
  sourceKey: "id",
});

Rating.belongsTo(User, {
  foreignKey: "idUser",
  targetKey: "id",
});

//USER->COMMENT (1..n)
User.hasMany(Comment, {
  foreignKey: "idUser",
  sourceKey: "id",
});

Comment.belongsTo(User, {
  foreignKey: "idUser",
  targetKey: "id",
});

//FILE->COMMENT (1..n)
File.hasMany(Comment, {
  foreignKey: "idFile",
  sourceKey: "id",
  onDelete: "CASCADE",
  hooks: true,
});

Comment.belongsTo(File, {
  foreignKey: "idFile",
  targetKey: "id",
});
