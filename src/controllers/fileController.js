import File from "../models/File.js";
import Post from "../models/Post.js";
import { LIST_TAGS } from "../utils/constants.js";

//MUESTRA EL FORMULARIO PARA CARGAR/MODIFICAR 1 ARCHIVO
export const showFormFile = async (req, res) => {
  const { postId } = req.params;
  const { fileId } = req.query;
  const viewData = {
    idPost: postId,
    listTags: LIST_TAGS,
    success: true,
  };

  if (!fileId) {
    //SI NO HAY ARCHIVO
    const titlePost = req.query.titlePost;
    return res.render("post/formFile.pug", { ...viewData, titlePost });
  }

  try {
    //SI HAY ARCHIVO
    const response = await File.findByPk(fileId, {
      include: [
        {
          model: Post,
          attributes: ["title"],
        },
      ],
    });

    if (!response) {
      return res.status(404).render("post/formFile.pug", {
        ...viewData,
        success: false,
        error: "No se encontro el Archivo",
      });
    }

    const file = response.toJSON();

    return res.render("post/formFile.pug", {
      ...viewData,
      ...file,
      message: "Archivo recuperado con exito",
    });
  } catch (error) {
    console.error("Error al recuperar el Archivo en la BD:", error);
    return res.status(500).render("post/formFile.pug", {
      ...viewData,
      success: false,
      error: "Ocurrio un error al intentar recuperar los datos del Archivo",
    });
  }
};

//CREO EL FILE EN LA BD (listo)
export const createFile = async (req, res) => {
  const postId = req.params.postId;

  const { title, description, selectedTags, openComments, textCopyright } =
    req.body;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "Falta el archivo" });
    }

    const { mimetype } = req.file;

    // Normalizamos la ruta física para que sea una URL web válida
    let path = req.file.path.replace(/\\/g, "/");
    if (path.startsWith("public/")) {
      path = path.replace("public/", "/");
    }

    if (!selectedTags) {
      return res.status(400).json({
        success: false,
        error: "Debe seleccionar al menos una etiqueta (TAG).",
      });
    } else if (!Array.isArray(selectedTags)) {
      selectedTags = [selectedTags];
    }

    const file = await File.create({
      idPost: postId,
      title,
      path,
      mimetype,
      description,
      selectedTags,
      openComments,
      textCopyright,
    });

    res.json({ success: true, message: "Archivo guardado", fileId: file.id });
  } catch (error) {
    console.error("❌ Error al guardar el archivo: " + error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      // Error de validación o restricción
      res
        .status(422)
        .json({ success: false, error: "Error con los datos ingresados" });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Error interno del servidor" });
    }
  }
};

//MUESTRA EL DETALLE DE UN ARCHIVO
export const showFile = async (req, res) => {
  const { fileId, postId } = req.params;

  try {
    const response = await File.findByPk(fileId, {
      include: [
        {
          model: Post,
          attributes: ["title"],
        },
      ],
    });

    if (!response) {
      return res.status(404).render("post/fileDetail.pug", {
        error: "No se encontró el archivo solicitado",
        postId,
      });
    }

    const file = response.toJSON();
    res.render("post/fileDetail.pug", { file });
  } catch (error) {
    console.error("❌ Error al obtener el detalle del archivo:", error);
    res.render("post/fileDetail.pug", {
      error: "Error al intentar cargar el archivo",
    });
  }
};

//updateFile
//MODIFICAR EL ARCHIVO EN LA BD
export const updateFile = async (req, res) => {
  let { title, description, selectedTags, textCopyright } = req.body;
  const openComments = req.body.openComments ? true : false;
  textCopyright = req.body.hasCopyright ? textCopyright : "";
  const fileId = req.params.fileId;

  try {
    if (!selectedTags) {
      return res.status(400).json({
        success: false,
        error: "Debe seleccionar al menos una etiqueta (TAG).",
      });
    } else if (!Array.isArray(selectedTags)) {
      selectedTags = [selectedTags];
    }

    const updateData = {
      title,
      description,
      selectedTags,
      openComments,
      textCopyright,
    };

    // Si el usuario subió un archivo nuevo, actualizamos el path y mimetype
    if (req.file) {
      let newPath = req.file.path.replace(/\\/g, "/");
      if (newPath.startsWith("public/")) {
        newPath = newPath.replace("public/", "/");
      }
      updateData.path = newPath;
      updateData.mimetype = req.file.mimetype;
    }

    const [rowsUpdated] = await File.update(updateData, {
      where: { id: fileId },
    });

    if (rowsUpdated === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontro el album a actualizar",
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error al intentar actualizar el post en la BD:", error);
    res.status(500).json({
      success: false,
      error: "Ocurrio un error al intentar actualizar el Album (post)",
    });
  }
};

//DELETE EL FILE EN LA BD
export const deleteFile = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const deleteRow = await File.destroy({ where: { id: fileId } });

    if (deleteRow === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontro el Archivo a borrar" });
    }

    res.json({ success: true, message: "Registro borrado correctamente" });
  } catch (error) {
    console.error("❌ Error al intentar eliminar el Archivo en la BD:", error);
    res.status(500).json({
      success: false,
      error: "Ocurrio un error al intentar borrar el Archivo",
    });
  }
};
