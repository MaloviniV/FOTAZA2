import Post from "../models/Post.js";
import File from "../models/File.js";

export const seedTestData = async (testUser) => {
  try {
    const postCount = await Post.count({ where: { idUser: testUser.id } });

    if (postCount === 0) {
      console.log(
        "🌱 Poblando la base de datos con álbumes y fotos de prueba...",
      );

      const albums = [
        {
          title: "Aventura en la Montaña",
          desc: "Fotos de mi último viaje a los Andes.",
          tags: ["Paisaje", "Naturaleza"],
        },
        {
          title: "Viaje a la Playa",
          desc: "Relajación total frente al mar.",
          tags: ["Paisaje", "Viajes"],
        },
        {
          title: "Paisajes Urbanos",
          desc: "Explorando la jungla de cemento.",
          tags: ["Urbano", "Arquitectura"],
        },
      ];

      let imageId = 10; // Para usar picsum.photos/id/10, 11, 12...

      for (const albumData of albums) {
        const post = await Post.create({
          idUser: testUser.id,
          title: albumData.title,
          description: albumData.desc,
          selectedTags: albumData.tags,
          openComments: true,
        });

        // Crear 3 fotos por cada álbum
        for (let i = 1; i <= 3; i++) {
          await File.create({
            idPost: post.id,
            title: `Foto ${i}`,
            description: `Una increíble toma de ${albumData.title.toLowerCase()}.`,
            path: `https://picsum.photos/id/${imageId}/800/600`, // Imágenes de prueba aleatorias
            mimetype: "image/jpeg",
            selectedTags: albumData.tags,
            openComments: true,
            textCopyright: "© 2026 FOTAZA",
          });
          imageId++;
        }
      }
      console.log("✅ Datos de prueba creados exitosamente.");
    }
  } catch (error) {
    console.error("Error ejecutando el seeder de prueba:", error);
  }
};
