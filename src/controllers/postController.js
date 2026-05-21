export const posts = (req, res) => {
  const postsList = [
    { id: 1, title: "Aventura en la Montaña", image: "1.webp" },
    { id: 2, title: "Viaje a la Playa", image: "1.webp" },
    { id: 3, title: "Paisajes Urbanos", image: "1.webp" },
  ];

  res.render("post/posts.pug", { posts: postsList });
};

export const postDetail = (req, res) => {
  const id = req.id;

  res.render("post/postDetail.pug", { postId: id });
};

export const formPost = (req, res) => {
  res.render("post/formPost.pug");
};

export const imageDetail = (req, res) => {
  res.render("post/imageDetail.pug", {
    mimetype: "image/webp",
    user: {
      fullname: "juanperez",
      nickname: "Juancho",
      nombre: "Juan Perez", // Propiedad que faltaba
      avatar_url: "",
      file: {
        // Objeto que faltaba
        title: "Mi Foto Increíble",
        post: "Vacaciones 2026",
        description: "Una foto desde la playa.",
        tags: "#playa #verano #sol",
      },
    },
    url: "/imagenes/posts/1.webp",
    editing: false, // Variable que faltaba
  });
};

export const processFormPost = (req, res) => {
  //CARGO EL ALBUM EN LA BD
  const titlePost = req.body.title;
  res.redirect(`uploadFile?titlePost=${encodeURIComponent(titlePost)}`);
};

export const formUploadFile = (req, res) => {
  const titlePost = req.query.titlePost;
  res.render("post/uploadFile.pug", { titlePost });
};

export const processFormUploadFile = (req, res) => {
  // req.file contendrá la información del archivo físico (gracias a Multer)
  // req.body contendrá los campos de texto (title, description, tags, etc.)
  console.log("Archivo recibido:", req.file);
  console.log("Datos del formulario:", req.body);

  // Rescatamos el nombre del álbum desde los datos del body (input name="post")
  const titlePost = req.body.post || "Álbum por defecto";
  res.render("post/uploadFile.pug", { titlePost, uploadSuccess: true });
};
