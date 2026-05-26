import Post from "../models/Post.js";
import File from "../models/File.js";
import { LIST_TAGS, TAGS } from "../utils/constants.js";
//ENVIA EL FORMULARIO PARA CREAR ALBUM
export const formPost = (req, res) => {
  res.render("post/formPost.pug", {listTags:LIST_TAGS});
};

//PROCESA EL FORMULARIO DEL ALBUM
export const processFormPost = async (req, res) => {
  //CARGO EL ALBUM EN LA BD
  const userId = req.user.id;
  let { title, description, selectedTags, openComments } = req.body;
  
  try {
    if (!selectedTags){
      throw new Error("Debe seleccionar al menos una etiqueta (TAG).");    
    }else if(!Array.isArray(selectedTags)){
      selectedTags = [selectedTags];
    }

    const [post, created] = await Post.findOrCreate({
      where: {
        idUser: userId,
        title,
      },
      defaults: {
        idUser: userId,
        title,
        description,
        selectedTags,
        openComments
      },
    });

    if (!created) {
      throw new Error("Ya hay un album con ese nombre");
    }

    const uploadLink = `/post/uploadFile?titlePost=${encodeURIComponent(title)}&idPost=${encodeURIComponent(post.id)}`;
    res.render("post/formPost.pug", {
      success: { uploadLink }
    });
    
  } catch (error) {
    console.error("Error al crear post en BD:", error);
    const formValues = {
      title,
      description,
      selectedTags,
      openComments
    };
    res.render("post/formPost.pug", {
      error:
        error.message ||
        "Ocurrió un error al intentar crear el álbum. Por favor, intente nuevamente.",
      listTags: LIST_TAGS,
      ...formValues
    });
  }
};

//ENVIA EL FORMULARIO PARA CARGAR 1 IMAGEN
export const formUploadFile = (req, res) => {
  const postValues = req.query;
  res.render("post/uploadFile.pug", { ...postValues, listTags:LIST_TAGS });
};
  
//PROCESA EL FORMULARIO PARA SUBIR EL ARCHIVO
export const processFormUploadFile = async (req, res) => {
  let { titlePost, idPost, title, description, selectedTags, openComments, textCopyright } = req.body;

  try {
    if (!req.file) {
      throw new Error("No se ha proporcionado ningún archivo de imagen o video.");
    }
    const { path, mimetype } = req.file;

    if (!selectedTags){
      throw new Error("Debe seleccionar al menos una etiqueta (TAG).");    
    }else if(!Array.isArray(selectedTags)){
      selectedTags = [selectedTags];
    }

    const file = await File.create({
      idPost,
      title,
      path,
      mimetype,
      description,
      selectedTags,
      openComments,
      textCopyright,
    });

    res.redirect(`/post/uploadFile?titlePost=${encodeURIComponent(titlePost)}&idPost=${encodeURIComponent(idPost)}&success=${encodeURIComponent(null)}`);
    
  } catch (error) {
    console.error("Error al guardar en la tabla File: " + error);
    const formValues = {title, description, selectedTags, openComments, textCopyright, titlePost, idPost};
    res.render("post/uploadFile.pug", {
      error: error.message,
      listTags: LIST_TAGS,
      ...formValues
    });
  }
};

export const showPostDetail = (req, res) => {
  //console.log(JSON.stringify(req.params, null, 2));
  const postId = req.params.postId;
  
  
  res.render("post/postDetail.pug");
  };
  
/* 
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
 */