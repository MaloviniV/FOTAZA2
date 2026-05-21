  const mockUser = {
    avatar_url: null, // Se activará el '/imagenes/avatar/default-avatar.png' de tu Pug
    nickname: null,   // Si nickname es nulo, usará el fullname
    fullname: "Victor Malov",
    numberOfFiles: 5,
    numberOfPosts: 1,
    numberOfFollowings: 12,
    numberOfFollowers: 3
  };


export const showHome = (req, res) => {
  res.render("./dashboard/dashboard.pug", {user: mockUser});
}