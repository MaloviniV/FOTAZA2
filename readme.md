# Fotaza 2 - Plataforma para Compartir Fotos

Fotaza 2 es una aplicación web full-stack diseñada como una plataforma para que los usuarios compartan y descubran fotos. Funciona como una versión simplificada de sitios populares para compartir fotos, permitiendo a los usuarios crear álbumes (llamados "Posts"), subir imágenes y videos, comentar, calificar y seguir a otros creadores.

Este proyecto fue desarrollado como un proyecto final integrador para el curso "Programación Web 2" en la ULP.

## ✨ Características

- **Autenticación de Usuarios:** Sistema seguro de registro e inicio de sesión de usuarios.
- **Gestión de Álbumes:** Los usuarios pueden crear, editar y eliminar sus propios álbumes (Posts).
- **Carga de Archivos:** Sube imágenes y videos a los álbumes.
  - **Optimización de Imágenes:** Las imágenes se redimensionan automáticamente y se convierten al moderno formato `.webp` para un mejor rendimiento utilizando `sharp`.
  - **Almacenamiento en la Nube:** Los archivos se suben y se sirven desde el almacenamiento de Vercel Blob.
- **Interacciones Sociales:**
  - Comenta en los archivos.
  - Califica archivos en una escala de 5 estrellas.
  - Sigue y deja de seguir a otros usuarios.
- **Perfiles de Usuario:** Perfiles de usuario públicos que muestran sus subidas y estadísticas.
- **Panel de Control (Dashboard):** Un espacio personal para que los usuarios gestionen su contenido (publicaciones, colecciones, etc.).
- **Descubrimiento:**
  - Un muro público con archivos populares.
  - Funcionalidad de búsqueda avanzada para filtrar archivos por texto, etiquetas o tipo de medio.

## 🛠️ Pila Tecnológica

- **Backend:** Node.js, Express.js
- **Base de Datos:** PostgreSQL con Sequelize ORM
- **Motor de Plantillas:** Pug
- **Frontend:** Bootstrap 5, JavaScript
- **Almacenamiento de Archivos:** Vercel Blob
- **Procesamiento de Imágenes:** Sharp
- **Autenticación:** Express Session con `connect-session-sequelize`

## 🚀 Primeros Pasos

Sigue estas instrucciones para tener una copia local en funcionamiento para desarrollo y pruebas.

### Prerrequisitos

- Node.js (v18 o superior recomendado)
- NPM
- Una instancia de base de datos PostgreSQL en ejecución.

### Instalación y Configuración

1.  **Clonar el repositorio:**

    ```sh
    git clone https://github.com/MaloviniV/FOTAZA2/tree/Prod
    cd fotaza2
    ```

2.  **Instalar dependencias:**

    ```sh
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto copiando el archivo de ejemplo (.env.example):

    ```sh
    cp .env.example .env
    ```

    Ahora, abre el archivo `.env` y completa los valores requeridos, especialmente tus credenciales de base de datos.

4.  **Inicializar la base de datos:**
    El proyecto está configurado para crear automáticamente las tablas necesarias y poblarlas con datos de prueba.

    Asegúrate de que `DB_SYNC=true` esté configurado en tu archivo `.env`. Luego, ejecuta el script de inicialización:

    ```sh
    npm run db:init
    ```

    Este comando conectará a la base de datos, sincronizará los modelos (creará tablas) y ejecutará el seeder de datos.

    **Importante:** Después de la primera ejecución exitosa, es altamente recomendable establecer `DB_SYNC=false` en tu archivo `.env` para evitar la pérdida accidental de datos durante el desarrollo.
    La aplicacion esta desarrollada para la BD PostgreSQL, tener en cuenta a la hora de poblar cualquier otra BD, por compatibilidad de querys.

5.  **Ejecutar la aplicación:**
    Para iniciar el servidor en modo de desarrollo (con recarga automática):
    ```sh
    npm run dev
    ```
    Para ejecutar la aplicación en producción:
    ```sh
    npm start
    ```
    La aplicación debería estar ejecutándose en `http://localhost:3000` (o el puerto que especificaste en `.env`).

## 👨‍💻 Usuarios de Prueba

El seeder de la base de datos crea algunos usuarios de prueba para que los uses durante el desarrollo.

| Correo Electrónico | Contraseña |
| ------------------ | ---------- |
| `mail@mail.com`    | `1111`     |
| `ana@mail.com`     | `123`      |
| `carlos@mail.com`  | `123`      |
| `maria@mail.com`   | `123`      |


## ⚙️ Variables de Entorno

Las siguientes variables deben configurarse en el archivo `.env`:

- `APP_PORT`: El puerto en el que se ejecutará el servidor (ej. `3000`).
- `SESSION_SECRET`: Una cadena secreta utilizada para firmar las cookies de sesión.
- `DB_SYNC`: Establecer en `true` para sincronizar el esquema de la base de datos al iniciar. **Establecer en `false` en producción.**
- `DB_DIALECT`: El dialecto SQL (debe ser `postgres`).
- `DB_HOST`: El host de tu base de datos (ej. `localhost`).
- `DB_PORT`: El puerto de tu base de datos (ej. `5432`).
- `DB_NAME`: El nombre de tu base de datos.
- `DB_USER`: El nombre de usuario para tu base de datos.
- `DB_PASSWORD`: La contraseña para el usuario de tu base de datos.
- `BLOB_READ_WRITE_TOKEN`: Tu token de lectura/escritura para el almacenamiento de Vercel Blob (solo en Producción).