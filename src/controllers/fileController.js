import File from "../models/File.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Rating from "../models/Rating.js";
import Comment from "../models/Comment.js";
import { LIST_TAGS } from "../utils/constants.js";
import sharp from "sharp";
import {
  uploadFile,
  deleteFile as deleteStorageFile,
} from "../utils/storageService.js";

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
    return res.render("file/form.pug", { ...viewData, titlePost });
  }

  try {
    //SI HAY ARCHIVO
    const response = await File.findByPk(fileId, {
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
              attributes: ["id", "nickname", "avatarUrl"],
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname", "avatarUrl", "firstName"],
            },
          ],
        },
      ],
      order: [[Comment, "createdAt", "DESC"]],
    });

    if (!response) {
      return res.status(404).render("file/form.pug", {
        ...viewData,
        success: false,
        error: "No se encontro el Archivo",
      });
    }

    const file = response.toJSON();

    return res.render("file/form.pug", {
      ...viewData,
      ...file,
      message: "Archivo recuperado con exito",
    });
  } catch (error) {
    console.error("Error al recuperar el Archivo en la BD:", error);
    return res.status(500).render("file/form.pug", {
      ...viewData,
      success: false,
      error: "Ocurrio un error al intentar recuperar los datos del Archivo",
    });
  }
};

// AGREGAR COMENTARIO
export const addComment = async (req, res) => {
  const { fileId, postId } = req.params;
  const { commentText } = req.body;

  if (!req.user) {
    return res.redirect("/auth/login");
  }

  try {
    const file = await File.findByPk(fileId);

    if (!file || !file.openComments) {
      return res
        .status(403)
        .send("No se pueden agregar comentarios a este archivo.");
    }

    if (commentText && commentText.trim().length > 0) {
      await Comment.create({
        idUser: req.user.id,
        idFile: fileId,
        text: commentText.trim(),
      });
    }

    res.redirect(`/post/${postId}/file/${fileId}`);
  } catch (error) {
    console.error("❌ Error al agregar comentario:", error);
    res.status(500).send("Ocurrió un error al intentar agregar el comentario.");
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

    let fileBuffer = req.file.buffer;
    let { mimetype } = req.file;
    const originalName = req.file.originalname;
    let fileName = `${Date.now()}-${originalName}`;

    // Proceso la imagen con Sharp
    if (mimetype.startsWith("image/")) {
      fileBuffer = await sharp(fileBuffer)
        .resize({ width: 1920, withoutEnlargement: true }) // Max 1920px de ancho
        .webp({ quality: 80 }) // Convierto a WebP con 80% de calidad
        .toBuffer();
      mimetype = "image/webp";
      const nameWithoutExtension =
        originalName.substring(0, originalName.lastIndexOf(".")) ||
        originalName;
      fileName = `${Date.now()}-${nameWithoutExtension}.webp`;
    }

    // Guardar el archivo en storage (local o blob)
    const filePath = await uploadFile(fileBuffer, fileName);

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
      path: filePath,
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
      // Error de validacion o restriccion
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
          attributes: ["title", "idUser"],
          include: [
            {
              model: User,
              attributes: ["id", "nickname", "avatarUrl"],
            },
          ],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname", "avatarUrl", "firstName"],
            },
          ],
        },
      ],
      order: [[Comment, "createdAt", "DESC"]],
    });

    if (!response) {
      return res.status(404).render("file/detail.pug", {
        error: "No se encontró el archivo solicitado",
        postId,
      });
    }

    const file = response.toJSON();

    const totalRatings = await Rating.count({ where: { idFile: fileId } });
    const sumRatings = await Rating.sum("score", { where: { idFile: fileId } });

    //Calculo del promedio
    file.averageRating =
      totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;
    file.totalRatings = totalRatings;
    file.userRating = 0; // Por defecto 0

    if (req.user) {
      const currentRating = await Rating.findOne({
        where: { idFile: fileId, idUser: req.user.id },
      });
      if (currentRating) file.userRating = currentRating.score;
    }

    res.render("file/detail.pug", { file });
  } catch (error) {
    console.error("❌ Error al obtener el detalle del archivo:", error);
    res.render("file/detail.pug", {
      error: "Error al intentar cargar el archivo",
      postId,
    });
  }
};

// VALORAR UN ARCHIVO (1 a 5 estrellas)
export const rateFile = async (req, res) => {
  const { fileId } = req.params;
  const { score } = req.body;

  if (!req.user)
    return res
      .status(401)
      .json({ success: false, error: "Debes iniciar sesión para valorar." });

  try {
    const userId = req.user.id;

    const file = await File.findByPk(fileId, {
      include: [{ model: Post, attributes: ["idUser"] }],
    });

    if (!file)
      return res
        .status(404)
        .json({ success: false, error: "Archivo no encontrado." });
    if (file.Post && file.Post.idUser === userId) {
      return res.status(400).json({
        success: false,
        error: "No puedes valorar tus propias fotos.",
      });
    }

    let rating = await Rating.findOne({
      where: { idUser: userId, idFile: fileId },
    });

    if (rating) {
      rating.score = score;
      await rating.save();
    } else {
      await Rating.create({ idUser: userId, idFile: fileId, score });
    }

    const totalRatings = await Rating.count({ where: { idFile: fileId } });
    const sumRatings = await Rating.sum("score", { where: { idFile: fileId } });
    const averageRating =
      totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;

    return res.json({
      success: true,
      message: "Valoración guardada exitosamente",
      newScore: score,
      newAverage: averageRating,
      newTotal: totalRatings,
    });
  } catch (error) {
    console.error("❌ Error al valorar archivo:", error);

    if (
      error.name === "SequelizeValidationError" ||
      error.message.includes("propio archivo")
    ) {
      return res.status(400).json({
        success: false,
        error: "No puedes calificar tu propio archivo.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Ocurrió un error al guardar la valoración",
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

    if (req.file) {
      let fileBuffer = req.file.buffer;
      let { mimetype } = req.file;
      const originalName = req.file.originalname;
      let fileName = `${Date.now()}-${originalName}`;

      // proceso con Sharp
      if (mimetype.startsWith("image/")) {
        fileBuffer = await sharp(fileBuffer)
          .resize({ width: 1920, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
        mimetype = "image/webp";
        const nameWithoutExtension =
          originalName.substring(0, originalName.lastIndexOf(".")) ||
          originalName;
        fileName = `${Date.now()}-${nameWithoutExtension}.webp`;
      }

      // Guardo el nuevo archivo en storage (local o blob)
      const newFilePath = await uploadFile(fileBuffer, fileName);
      updateData.path = newFilePath;
      updateData.mimetype = mimetype;
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
    // Busco el archivo para eliminarlo del storage antes de borrarlo de la BD
    const file = await File.findByPk(fileId);

    if (file && file.path) {
      await deleteStorageFile(file.path);
    }

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

// BORRAR COMENTARIO
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Debes iniciar sesión para realizar esta acción.",
    });
  }

  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment)
      return res
        .status(404)
        .json({ success: false, error: "El comentario no existe." });

    if (comment.idUser !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "No tienes permiso para borrar este comentario.",
      });
    }

    await comment.destroy();
    res.json({ success: true, message: "Comentario borrado correctamente." });
  } catch (error) {
    console.error("❌ Error al borrar comentario:", error);
    res.status(500).json({
      success: false,
      error: "Ocurrió un error al intentar borrar el comentario.",
    });
  }
};
