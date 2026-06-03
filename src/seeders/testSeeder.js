import Post from "../models/Post.js";
import File from "../models/File.js";
import User from "../models/User.js";

export const seedTestData = async (testUser) => {
  try {
    console.log(
      "🌱 Verificando y poblando la base de datos con múltiples usuarios, álbumes y fotos de prueba...",
    );

    // 1. Definir lista de usuarios adicionales de prueba
    const testUsersData = [
      {
        firstName: "Ana",
        lastName: "García",
        nickname: "anita_g",
        dni: 44444444,
        birthdate: "1995-04-12",
        email: "ana@mail.com",
        password: "123",
        avatarUrl:
          "https://ui-avatars.com/api/?name=Ana+Garcia&background=random",
      },
      {
        firstName: "Carlos",
        lastName: "López",
        nickname: "carlos_l",
        dni: 22222222,
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
        dni: 33333333,
        birthdate: "1992-07-05",
        email: "maria@mail.com",
        password: "123",
        avatarUrl:
          "https://ui-avatars.com/api/?name=Maria+Fernandez&background=random",
      },
    ];

    // Array para almacenar todos los usuarios a poblar (incluyendo el usuario principal testUser)
    const usersToSeed = [];
    if (testUser) usersToSeed.push(testUser);

    // Buscar o crear los usuarios adicionales en la base de datos
    for (const userData of testUsersData) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData,
      });
      usersToSeed.push(user);
    }

    // 2. Definir una plantilla de álbumes variados
    const albumsTemplates = [
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
      {
        title: "Atardeceres Mágicos",
        desc: "El cielo pintado de colores.",
        tags: ["Paisaje", "Naturaleza"],
      },
      {
        title: "Callejones Antiguos",
        desc: "Historia en cada rincón.",
        tags: ["Urbano", "Arquitectura"],
      },
      {
        title: "Amigos Peludos",
        desc: "Jugando en el parque.",
        tags: ["Naturaleza"],
      },
      {
        title: "Sabores del Mundo",
        desc: "Platos increíbles que probé.",
        tags: ["Viajes", "Urbano"],
      },
      {
        title: "Escapada al Bosque",
        desc: "Respirando aire puro.",
        tags: ["Paisaje", "Naturaleza"],
      },
    ];

    let imageId = 10; // Para usar picsum.photos/id/10, 11, 12... de forma secuencial

    // 3. Crear álbumes y fotos para CADA usuario
    for (const user of usersToSeed) {
      const postCount = await Post.count({ where: { idUser: user.id } });

      // Solo creamos los posts si este usuario no tiene ninguno
      if (postCount === 0) {
        console.log(`➡️  Creando álbumes para el usuario: ${user.email}...`);

        // Seleccionar 5 álbumes al azar de la plantilla para que los usuarios tengan datos variados
        const userAlbums = [...albumsTemplates]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);

        for (const albumData of userAlbums) {
          const post = await Post.create({
            idUser: user.id,
            title: albumData.title,
            description: albumData.desc,
            selectedTags: albumData.tags,
            openComments: true,
          });

          // Crear 5 fotos por cada álbum
          for (let i = 1; i <= 5; i++) {
            await File.create({
              idPost: post.id,
              title: `Foto ${i}`,
              description: `Una increíble toma de ${albumData.title.toLowerCase()} capturada por ${user.firstName}.`,
              path: `https://picsum.photos/id/${imageId}/800/600`, // Imágenes de prueba aleatorias
              mimetype: "image/jpeg",
              selectedTags: albumData.tags,
              openComments: true,
              textCopyright: `© 2026 FOTAZA - ${user.firstName} ${user.lastName}`,
            });
            imageId++; // Incrementar para asegurar imágenes diferentes
          }
        }
      }
    }

    console.log(
      "✅ Datos de prueba creados exitosamente para múltiples usuarios.",
    );
  } catch (error) {
    console.error("Error ejecutando el seeder de prueba:", error);
  }
};
