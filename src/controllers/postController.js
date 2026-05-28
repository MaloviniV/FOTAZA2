import Post from "../models/Post.js";
import File from "../models/File.js";
import { LIST_TAGS, TAGS } from "../utils/constants.js";
//ENVIA EL FORMULARIO PARA CREAR ALBUM
export const formPost = async (req, res) => {
  const postId = req.query?.postId;
  let post;
  if(postId){
    try {
      const response = await Post.findByPk(postId);

      if(!response) throw new Error("No se encontro el album");

      post = response.toJSON();

    } catch (error) {
      console.error("Error al recuperar el album en la BD", error);
      return res.render("post/postDetail.pug", {error: error.message});
    }
  }

  res.render("post/formPost.pug", {listTags:LIST_TAGS, ...post});
};

//GUARDA EL ALBUM EN LA BD
export const processFormPost = async (req, res) => {
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
      }
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

//MODIFICAR EL ALBUM EN LA BD
export const updateFormPost = async () => {
  let { postId, title, description, selectedTags, openComments } = req.body;

  try {
    if (!selectedTags){
      throw new Error("Debe seleccionar al menos una etiqueta (TAG).");    
    }else if(!Array.isArray(selectedTags)){
      selectedTags = [selectedTags];
    }

    const rowsUpdated = await Post.update({
      title,
      description,
      selectedTags,
      openComments
    },{
      where: {postId}
    });

    if(rowsUpdated != 1){
      throw new Error("No se pudo actualiza el Album");      
    }else{
      
    }

  } catch (error) {
    
  }
}

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

export const showPostDetail = async (req, res) => {
  //console.log(JSON.stringify(req.params, null, 2));
  const postId = req.params.postId;
  
  try {
    const post = await Post.findByPk(postId,{
      include:[{model: File}]
    });

    if(!post){
      throw new Error("No se encontro el post solicitado");      
    }
    res.render("post/postDetail.pug",{post});
  } catch (error) {
    console.error("Error al cargar el album: " + error);    
    res.render("post/postDetail.pug", {
      error: error.message || "Error al intentar cargar el album",
    });
  }
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