import Post from "../models/Post.js";
import File from "../models/File.js";
import { LIST_TAGS, TAGS } from "../utils/constants.js";

//MOSTRAR EL FORMULARIO DE POST PARA CREAR/EDITAR (LISTO)
export const showFormPost = async (req, res) => {
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
  
  res.render("post/formPost.pug",{listTags: LIST_TAGS, ...post});
}

//CREO EL ALBUM EN LA BD (listo)
export const createPost = async (req, res) => {
  const userId = req.user.id;

  const { titlePost, description, selectedTags, openComments } = req.body;

  try {
    const [post, created] = await Post.findOrCreate({
      where: {
        idUser: userId,
        title: titlePost,
      },
      defaults: {
        idUser: userId,
        title: titlePost,
        description,
        selectedTags,
        openComments
      }
    });

    if (!created) {
      return res.status(409).json({success: false, error: "Ya tienes un Album con ese nombre"});
    }

    res.json({success:true, postId:post.id});
  } catch (error) {
    console.error("❌ Error al intentar crear post en BD:", error);

    res.status(500).json({ success:false, error:"Ocurrio un error interno al intentar crear el Post" });
  }
/*   try {
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
    }; */
  }

//LEO EL ALBUM EN LA BD (listo)
export const showPost = async (req, res) => {
  //console.log(JSON.stringify(req.params, null, 2));
  const postId = req.params.postId;
  
  try {
    const post = await Post.findByPk(postId,{
      include:[{model: File}]
    });

    if(!post){
      res.status(404).render("post/postDetail.pug",{error: "No se encontro el album solicitado"});
    }
    res.render("post/postDetail.pug",{post});
  } catch (error) {
    console.error("Error al cargar el album: " + error);    
    res.render("post/postDetail.pug", {
      error: error.message || "Error al intentar cargar el album",
    });
  }
};

//MODIFICAR EL ALBUM EN LA BD (listo)
export const updatePost = async (req, res) => {
  let { titlePost, description, selectedTags, openComments } = req.body;
  const postId = req.params.postId;

  try {
    if (!selectedTags){
      return res.status(400).json({success: false, error:"Debe seleccionar al menos una etiqueta (TAG)."});    
    }else if(!Array.isArray(selectedTags)){
      selectedTags = [selectedTags];
    }

    const [rowsUpdated] = await Post.update({
      title: titlePost,
      description,
      selectedTags,
      openComments
    },{
      where: {id: postId}
    });

    if(rowsUpdated === 0){
      return res.status(404).json({success:false, error:"No se encontro el album a actualizar"});   
    }

    res.json({success:true, postId});

  } catch (error) {
    console.error("❌ Error al intentar actualizar el post en la BD:", error);
    res.status(500).json({success:false, error:"Ocurrio un error al intentar actualizar el Album (post)"});
  }
}

//DELETE EL ALBUM EN LA BD (listo)
export const deletePost = async (req, res) => {
  const postId = req.params.postId;
console.log("❌ postId");
  try {
    const deleteRow = await Post.destroy({where:{id: postId}});

    if(deleteRow === 0){
      return res.status(404).json({success:false, error:"No se encontro el Archivo a borrar"});
    }

    res.json({success: true, message: "Registro borrado correctamente"});
  } catch (error) {
    console.error("❌ Error al intentar eliminar el post en la BD:", error);
    res.status(500).json({success:false, error:"Ocurrio un error al intentar borrar el Album (post)"});
  }
}

//MUESTRA EL FORMULARIO PARA CARGAR/MODIFICAR 1 IMAGEN
export const showFormFile = async (req, res) => {
  const postId = req.params.postId;
  const titlePost = req.query?.titlePost;
  const fileId = req.query?.fileId;
  let file;

  if(fileId){
    try {
      const response = await File.findByPk(fileId);

      if(!response){
        return res.status(404).json({success: false, error:"No se encontro el Archivo"})
      }

      file = response.toJSON();

    } catch (error) {
      console.error("Error al recuperar el Archivo en la BD", error);
      return res.status(500).json({success: false, error:"Ocurrio un error al intentar recuperar los datos del archivo"});
    }
  }

  res.render("post/formUploadFile.pug", { titlePost, listTags:LIST_TAGS, ...file });
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