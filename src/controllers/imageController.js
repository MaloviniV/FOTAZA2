import fs from "fs";

const LIMIT = 10;

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