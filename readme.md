# ¡LA PROGRAMACIÓN HASTA ARRIBA...
# Y EL PERREO HASTA ABAJO!

Con esta API puedes tener todos los temazos de reggaeton (viejo y nuevo) al alcance de un click.

---

## Descripción

Esta es una API para gestionar canciones y artistas de reggaeton. Permite realizar operaciones CRUD básicas y autenticación mediante tokens JWT.

---

## Configuración

Antes de ejecutar la API, asegúrate de configurar correctamente las variables de entorno en un archivo `.env` en la raíz del proyecto. Debes incluir las siguientes variables:

DB_HOST=hostname_de_tu_database
DB_USER=usuario_de_tu_database
DB_PASSWORD=password_de_tu_database
PORT=????
JWT_WORD=secreto_para_jwt

## Instalación
1. Clona el repositorio.
2. Consulta el script para crear la base de datos y las tablas necesarias. También hay alguna querySQL comentada en caso de que quieras probar que todo funciona.

3. Instala las dependencias (  
"dependencies": {
"bcrypt": "^5.1.1",
"cors": "^2.8.5",
"dotenv": "^16.4.5",
"express": "^4.19.2",
"jsonwebtoken": "^9.0.2",
"mysql2": "^3.10.0"
}
y nodemon si lo necesitas)
4. Inicia el servidor con npm run dev y sigue la url que muestra la consola.

## ¡Bienvenida, estás en la humilde parte de front de este proyecto!
Gracias al servidor estático almacenado en ./public, tenemos un frontend que facilita algunas de las interacciones del usuario con la API: 
- registo de usuarios, 
- inicio de sesión,
- cierre de sesión,
- agregar canciones
- pintar la lista de canciones

![Captura de pantalla de la interfaz del front, muy simple](https://github.com/Adalab/modulo-4-evaluacion-final-bpw-Pi-Rey/blob/de103d76878259b24385c5f5eefa58b335c2b430/images/image.png)

Para el resto de interaciones, te dejo en buenas manos con Postman :)

Una última cosa... hay algunos endpoints que son rutas protegidas así que recuerda "tener la sesión iniciada" y el token a mano si quieres: 
- añadir
- eliminar canciones
- actualizar canciones (introducir su álbum)

## Endpoints:

### Registro de Usuario
Registra un nuevo usuario en la base de datos con POST /user/signup
Parámetros de entrada:
{
"email": "ejemplo@correo.com",
"name": "Nombre Apellido",
"password": "contraseña"
}

### Inicio de Sesión
Inicia sesión con un usuario registrado con POST /user/login
Parámetros de entrada:
{
"email": "ejemplo@correo.com",
"password": "contraseña"
}

### Cierre de Sesión
Cierra la sesión actual del usuario con PUT /user/logout
(recuerda poner el token del usuario en los headers!)

## Operaciones con Canciones

### Obtén la lista completa de canciones con GET /list

### Agrega una nueva canción a la base de datos con POST /add
Parámetros de entrada:
{
"songName": "Nombre de la Canción",
"name": "Nombre del Artista",
"country": "País del Artista"
}

### Elimina una canción por su ID con DELETE /delete/:id
(No olvides pasar el id en la url!)

### Actualiza el nombre de una canción y añade su álbum por su ID con PUT /update/:id
Parámetros de entrada:
{
"song": "Nuevo Nombre de la Canción",
"album": "Nuevo Álbum"
}

### Obtén una canción por su ID con GET /:id

### Filtra canciones por nombre de artista con GET /artist
Parámetros de entrada:
{
"artist": "Nombre del Artista"
}

---

Ejercicio realizado con NodeJS, Express.js, y MySQL.
