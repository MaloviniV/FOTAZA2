import Post from "../models/Post.js";
import File from "../models/File.js";
import { LIST_TAGS, TAGS } from "../utils/constants.js";
//ENVIA EL FORMULARIO PARA CARGAR ALBUM
export const formPost = (req, res) => {
  res.render("post/formPost.pug");
};
//PROCESA EL FORMULARIO DEL ALBUM
export const processFormPost = async (req, res) => {
  //CARGO EL ALBUM EN LA BD
  const { title, description } = req.body;
  const idUser = req.user.id;

  try {
    const [post, created] = await Post.findOrCreate({
      where: {
        idUser,
        title,
      },
      defaults: {
        idUser,
        title,
        description,
      },
    });

    if (!created) {
      throw new Error("Ya hay un album con ese nombre");
    }
    res.redirect(
      `uploadFile?titlePost=${encodeURIComponent(title)}&&idPost=${encodeURIComponent(post.id)}`,
    );
  } catch (error) {
    console.error("Error al crear post en BD:", error);
    res.render("post/formPost.pug", {
      error:
        error.message ||
        "Ocurrió un error al intentar crear el álbum. Por favor, intente nuevamente.",
      title,
      description,
    });
  }
};
//ENVIA EL FORMULARIO PARA CARGAR 1 IMAGEN
export const formUploadFile = (req, res) => {
  const { titlePost = "Sin título", idPost = null } = req.query;
  const tags = LIST_TAGS;
  res.render("post/uploadFile.pug", { titlePost, idPost, tags });
};

export const processFormUploadFile = async (req, res) => {
  const {
    titlePost,
    idPost,
    title,
    description,
    tags,
    openComments,
    textCopyright,
  } = req.body;

  try {
    if (!req.file) {
      throw new Error("No se ha proporcionado ningún archivo de imagen o video.");
    }
    const { path, mimetype } = req.file;

    const file = await File.create({
      idPost,
      title,
      path,
      mimetype,
      description,
      tags,
      openComments,
      textCopyright,
    });

    res.redirect(`post/uploadFile?titlePost=${encodeURIComponent(titlePost)}&&
                                  idPost=${encodeURIComponent(idPost)}&&
                                  tags=${encodeURIComponent(LIST_TAGS)}&&
                                  uploadSuccess=${encodeURIComponent(true)}`);
  } catch (error) {
    console.error("Error al guardar en la tabla File: " + error);
    const formValues = {title, description, tags, openComments, textCopyright, titlePost, idPost};
    res.render("post/uploadFile.pug", {
      error: error.message,
      ...formValues,
      LIST_TAGS
    });
  }
};

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
    editing: false,
  });
};
