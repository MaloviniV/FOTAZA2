import Post from "../models/Post.js";
import File from "../models/File.js";
import { LIST_TAGS } from "../utils/constants.js";

//MOSTRAR EL FORMULARIO DE POST PARA CREAR/EDITAR (LISTO)
export const showFormPost = async (req, res) => {
  const postId = req.query?.postId;
  let post;

  if (postId) {
    try {
      const response = await Post.findByPk(postId);

      if (!response) {
        return res
          .status(404)
          .json({ success: false, error: "No se encontro el Album" });
      }

      post = response.toJSON({success: true, message: "Album recuperado"});
    } catch (error) {
      console.error("Error al recuperar el Album en la BD", error);
      return res
        .status(500)
        .json({
          success: false,
          error: "Ocurrio un error al intentar recuperar los datos del Album"
        })
    }
  }

  res.render("post/formPost.pug", { listTags: LIST_TAGS, ...post });
};

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
        openComments,
      },
    });

    if (!created) {
      return res
        .status(409)
        .json({ success: false, error: "Ya tienes un Album con ese nombre" });
    }

    res.json({ success: true, message:"Album creado", postId: post.id });
  } catch (error) {
    console.error("❌ Error al intentar crear post en BD:", error);

    res
      .status(500)
      .json({
        success: false,
        error: "Ocurrio un error interno al intentar crear el Post",
      });
  }
};

//LEO EL ALBUM EN LA BD (listo)
export const showPost = async (req, res) => {
  //console.log(JSON.stringify(req.params, null, 2));
  const postId = req.params.postId;

  try {
    const response = await Post.findByPk(postId, {
      include: [{ model: File }],
    });

    if (!response) {
      return res
        .status(404)
        .render("post/postDetail.pug", {
          error: "No se encontro el album solicitado",
        });
    }

    const post = response.toJSON();
    res.render("post/postDetail.pug", { post });
  } catch (error) {
    console.error("❌ Error al cargar el album: " + error);
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
    if (!selectedTags) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Debe seleccionar al menos una etiqueta (TAG).",
        });
    } else if (!Array.isArray(selectedTags)) {
      selectedTags = [selectedTags];
    }

    const [rowsUpdated] = await Post.update(
      {
        title: titlePost,
        description,
        selectedTags,
        openComments,
      },
      {
        where: { id: postId },
      },
    );

    if (rowsUpdated === 0) {
      return res
        .status(404)
        .json({
          success: false,
          error: "No se encontro el album a actualizar",
        });
    }

    res.json({ success: true, postId });
  } catch (error) {
    console.error("❌ Error al intentar actualizar el post en la BD:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Ocurrio un error al intentar actualizar el Album (post)",
      });
  }
};

//DELETE EL ALBUM EN LA BD (listo)
export const deletePost = async (req, res) => {
  const postId = req.params.postId;
  console.log("❌ postId");
  try {
    const deleteRow = await Post.destroy({ where: { id: postId } });

    if (deleteRow === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontro el Album a borrar" });
    }

    res.json({ success: true, message: "Registro borrado correctamente" });
  } catch (error) {
    console.error("❌ Error al intentar eliminar el post en la BD:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Ocurrio un error al intentar borrar el Album (post)",
      });
  }
};