import fs from "fs";

const LIMIT = 10;
//HARDCODEADO PARA CARGAR IMAGENS PRECARGADAS DESDE PUBLIC/IMAGENES
export const index = (req, res) => {
  fs.readdir("public/imagenes", (error, files) => {
    if (error) res.send("Error al leer los archivos");

    const offset = parseInt(req.query.offset) || 0;
    const nextOffset = offset + LIMIT;
    const fotos = files.slice(offset, nextOffset);
    const hasMore = nextOffset < files.length;

    console.log(fotos);

    res.render("index.pug", { hasMore, nextOffset, fotos });
  });
};

export const loadMoreImages = (req, res) => {
  fs.readdir("public/imagenes", (error, files) => {
    if (error) res.send("Error al leer los archivos");

    const offset = parseInt(req.query.offset) || 0;
    const nextOffset = offset + LIMIT;
    const fotos = files.slice(offset, nextOffset);
    const hasMore = nextOffset < files.length;

    console.log(fotos);

    res.json({ hasMore, nextOffset, fotos });
  });
};
