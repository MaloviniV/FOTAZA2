import Post from "../models/Post.js";
import File from "../models/File.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Rating from "../models/Rating.js";
import Follow from "../models/Follow.js";

// Datos de usuarios de prueba
const TEST_USERS = [
  {
    firstName: "Vic",
    lastName: "Malo",
    nickname: "@testVic",
    dni: "11111111",
    birthdate: "1988-02-20",
    email: "mail@mail.com",
    password: "1111",
    role: "usuario",
    avatarUrl: "https://ui-avatars.com/api/?name=Vic+Malo&background=random",
  },
  {
    firstName: "Ana",
    lastName: "García",
    nickname: "anita_g",
    dni: "44444444",
    birthdate: "1995-04-12",
    email: "ana@mail.com",
    password: "123",
    avatarUrl: "https://ui-avatars.com/api/?name=Ana+Garcia&background=random",
  },
  {
    firstName: "Carlos",
    lastName: "López",
    nickname: "carlos_l",
    dni: "22222222",
    birthdate: "1988-10-20",
    email: "carlos@mail.com",
    password: "123",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Carlos+Lopez&background=random",
  },
  {
    firstName: "María",
    lastName: "Fernández",
    nickname: "mary_f",
    dni: "33333333",
    birthdate: "1992-07-05",
    email: "maria@mail.com",
    password: "123",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Maria+Fernandez&background=random",
  },
];

const ALBUMS_TEMPLATES = [
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
  {
    title: "Mis Mascotas",
    desc: "Momentos divertidos en casa.",
    tags: ["Naturaleza"],
  },
  {
    title: "Ruta Gastronómica",
    desc: "Comida deliciosa del fin de semana.",
    tags: ["Viajes", "Urbano"],
  },
];

export const seedTestData = async () => {
  try {
    // Verificar si ya existen datos
    const userCount = await User.count();
    if (userCount > 0) {
      console.log("✅ Base de datos ya contiene usuarios. Saltando seeder.");
      return;
    }

    console.log(
      "🌱 Poblando la base de datos con usuarios, albumes y fotos de prueba...",
    );

    // Creo todos los usuarios
    const usersToSeed = [];
    for (const userData of TEST_USERS) {
      const user = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData,
      });
      usersToSeed.push(user[0]);
    }

    // Creo fotos y albums para cada usuario
    console.log("➡️  Creando álbumes y fotos...");
    let imageId = 10;

    for (const user of usersToSeed) {
      // selecciono 3 albums al azar
      const userAlbums = [...ALBUMS_TEMPLATES]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      for (const album of userAlbums) {
        const post = await Post.create({
          idUser: user.id,
          title: album.title,
          description: album.desc,
          selectedTags: album.tags,
          openComments: true,
        });

        // creo 3 fotos por album
        for (let i = 1; i <= 3; i++) {
          await File.create({
            idPost: post.id,
            title: `Foto ${i}`,
            description: `Una toma de ${album.title.toLowerCase()}.`,
            path: `https://picsum.photos/id/${imageId}/800/600`,
            mimetype: "image/jpeg",
            selectedTags: album.tags,
            openComments: true,
            textCopyright:
              i % 2 === 0 ? `© 2026 FOTAZA - ${user.firstName}` : null,
          });
          imageId++;
        }
      }
    }

    // Creo comentarios
    console.log("➡️  Creando comentarios...");
    const allFiles = await File.findAll();

    for (const file of allFiles) {
      const post = await Post.findByPk(file.idPost);
      const otherUsers = usersToSeed.filter((u) => u.id !== post.idUser);

      // 2 comentarios por archivo
      for (let i = 0; i < Math.min(otherUsers.length, 2); i++) {
        await Comment.findOrCreate({
          where: { idUser: otherUsers[i].id, idFile: file.id },
          defaults: {
            idUser: otherUsers[i].id,
            idFile: file.id,
            text: `¡Excelente foto! Me encanta.`,
          },
        });
      }
    }

    // Creo valoraciones
    console.log("➡️  Creando valoraciones...");
    for (const file of allFiles) {
      const post = await Post.findByPk(file.idPost);
      const otherUsers = usersToSeed.filter((u) => u.id !== post.idUser);

      // 3 valoraciones por archivo
      for (let i = 0; i < Math.min(otherUsers.length, 3); i++) {
        const score = Math.floor(Math.random() * 5) + 1;
        await Rating.findOrCreate({
          where: { idUser: otherUsers[i].id, idFile: file.id },
          defaults: {
            idUser: otherUsers[i].id,
            idFile: file.id,
            score,
          },
        });
      }
    }

    //Creo seguimientos
    console.log("➡️  Creando relaciones de seguimiento...");
    for (const follower of usersToSeed) {
      const toFollow = usersToSeed.filter((u) => u.id !== follower.id);
      // Cada usuario sigue a 1-2 usuarios al azar
      const followCount = Math.min(
        Math.floor(Math.random() * 2) + 1,
        toFollow.length,
      );

      for (let i = 0; i < followCount; i++) {
        const following = toFollow[i];
        await Follow.findOrCreate({
          where: { followerId: follower.id, followingId: following.id },
        });
      }
    }

    console.log(
      `✅ Datos creados: ${usersToSeed.length} usuarios con álbumes, fotos y relaciones.`,
    );
  } catch (error) {
    console.error("❌ Error en seeder:", error);
    throw error;
  }
};
