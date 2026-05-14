import User from "./User.js";
import Follow from "./Follow.js";
import Post from "./Post.js"

//USER->FOLLOW(m..n)
User.belongsToMany(User, {
  through: Follow,
  as: "following",
  foreignKey: "followerId",
  otherKey: "followingId"
});

User.belongsToMany(User, {
  through: Follow,  //indica la tabla que se usara como intermedia
  as: "followers",
  foreignKey: "followingId",  //usuario consultado
  otherKey: "followerId"  //usuarios devueltos
});

User.hasMany(Follow,{
  foreignKey: "followerId",
  sourceKey: "id" //busca en modelo origen
});

Follow.belongsTo(User,{
  foreignKey: "followerId",
  targetKey: "id"
});

User.hasMany(Follow,{
  foreignKey: "followingId",
  sourceKey: "id" //busca en modelo origen
});

Follow.belongsTo(User, {
  foreignKey: "followingId",
  targetKey: "id"
});
//USER->POST (1..n)
User.hasMany(Post, {
  foreignKey: "idUser",
  sourceKey: "id"
});

Post.belongsTo(User, {
  foreignKey: "idUser",
  targetKey: "id"
});
