export const posts = ( req, res ) => {
  const postsList = [
    { id: 1, title: "Aventura en la Montaña", image: "1.webp" },
    { id: 2, title: 'Viaje a la Playa', image: '1.webp' },
    { id: 3, title: 'Paisajes Urbanos', image: '1.webp' }
  ];

  res.render("post/posts.pug", {posts: postsList});
}

export const postDetail = (req, res) => {
  const id = req.id;

  res.render("post/postDetail.pug",{postId: id});
};

export const formPost = ( req, res ) => {
  res.render("post/formPost.pug");
};

export const processPost = ( req, res ) => {
  console.log(req.file);
  res.render("post/formPost.pug");
};