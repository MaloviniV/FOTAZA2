  //REEMPLAZAR CON CONSULTA A LA BD
  
  const estatistics = {
    numberOfFiles: 5,
    numberOfPosts: 1,
    numberOfFollowings: 12,
    numberOfFollowers: 3
  };
  
  export const showHome = (req, res) => {
  res.render("./dashboard/dashboard.pug", estatistics);
}