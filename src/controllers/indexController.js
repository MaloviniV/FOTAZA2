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

    res.render("public/wallPublic.pug", { hasMore, nextOffset, fotos });
    //res.render("layout.pug");
  });
};

export const contact = (req, res) => {
  res.send("Formulario de contacto");
}

export const plans = (req, res) => {
  res.render("plans.pug");
}

