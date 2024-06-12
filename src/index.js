const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 5001;

//Conexión con la database
async function connectDB() {
  const connex = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "reggaeton",
  });
  await connex.connect();
  //    console.log("conexion con la DB" + connex.threadId);
  return connex;
}



//BONUS:
const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_WORD, { expiresIn: "1h" });
    return token;
  };
  
  const authorize = (req, res, next) =>{
      const tokenString = req.headers.authorization;
      if (!tokenString) { 
        res.status(400).json({ success: false, message: "No estás autorizado." });
      } else {
        try {
          const token = tokenString.split(" ")[1]; 
          const verifiedToken = jwt.verify(token, process.env.JWT_WORD);
          req.userInfo = verifiedToken;
        } catch (error) {
          res.status(400).json({ success: false, message: error });
        }
        next();
      }
  }
  //1. Sign-up
  server.post("/user/signup", async (req, res) => {
    try {
      const { email, name, password } = req.body;
      const conn = await connectDB();
      const selectEmail = "SELECT * FROM users WHERE email = ?;";
      const [result] = await conn.query(selectEmail, [email]);
      if (result.length === 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const insertUser =
          "INSERT INTO users (email, name, password) VALUES (?,?, ?)";
        const [newUser] = await conn.query(insertUser, [
          email,
          name,
          hashedPassword,
        ]);
  
        //hasta aquí he registrado al newUser
        //a continuación voy a darle un token:
  
        const infoToken = { email: email, id: newUser.insertId };
        const newToken = generateToken(infoToken);
  
        res.status(201).json({ success: true, token: newToken });
      } else {
        res.status(200).json({ success: false, message: "El usuario ya existe" });
      }
      await conn.end();
    } catch (error) {
      res.status(400).json(error);
    }
  });
  
  //2. Login
  server.post("/user/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const conn = await connectDB();
      const selectEmail = "SELECT * FROM users WHERE email = ?;";
      const [result] = await conn.query(selectEmail, [email]);
      if (result.length !== 0) {
        const isSamePassword = await bcrypt.compare(password, result[0].password);
        if (isSamePassword) {
          const infoToken = { email: result[0].email, id: result[0].idUser };
          const token = generateToken(infoToken);
          res.status(201).json({
            success: true,
            token: token,
          });
        } else {
          res
            .status(400)
            .json({ success: false, message: "contraseña incorrecta" });
        }
      } else {
        res.status(400).json({ success: false, message: "email incorrecto" });
      }
      await conn.end();
    } catch (error) {
      res.status(400).json(error);
    }
  });

//Endpoints:
//1. mostrar todo:
server.get("/list", async (req, res) => {
  try {
    const conn = await connectDB();
    const select =
      "SELECT songName, name, country, album FROM song INNER JOIN artist ON IdArtist = fkArtist ORDER BY name;";
    const [result] = await conn.query(select);
    await conn.end();
    console.log(result);
    res.status(200).json({
      success: true,
      results: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      results: error,
    });
  }
});

//2. insert:
server.post("/add", authorize, async (req, res) => {
  try {
    const conn = await connectDB();
    const { songName, name, country } = req.body;
    //consulta sobre si existe ya la canción
    const getSong = "SELECT * FROM song WHERE songName = ?;";
    const [song] = await conn.query(getSong, [songName]);
    if (song.length !== 0) {
      res.status(200).json({
        success: false,
        message: "La canción que intentas introducir ya existe.",
      });
      //   console.log(fkArtist);
    } else {
      const getArtist = "SELECT * FROM artist WHERE name = ?;";
      const [artist] = await conn.query(getArtist, [name]);
      if (artist.length !== 0) {
        const fkArtist = artist[0].IdArtist;
        const sqlInsertSong =
          "INSERT INTO `reggaeton`.`song` (`songName`, `fkArtist`) VALUES (?, ?);";
        const [newSong] = await conn.query(sqlInsertSong, [songName, fkArtist]);
        res.status(200).json({
          success: true,
          message:
            "Canción introducida, el artista ya existía. Se muestra la lista actualizada.",
          result: newSong,
        });
      } else {
        const sqlInsertArtist =
          "INSERT INTO `reggaeton`.`artist` (`name`, `country`) VALUES (?, ?);";
        const [newArtist] = await conn.query(sqlInsertArtist, [name, country]);
        const sqlInsertSong =
          "INSERT INTO `reggaeton`.`song` (`songName`, `fkArtist`) VALUES (?, ?);";
        const [newSong] = await conn.query(sqlInsertSong, [
          songName,
          newArtist.insertId,
        ]);
        res.status(200).json({
          success: true,
          message:
            "Canción y artista introducidos. Se muestra la lista actualizada.",
          result: newSong,
        });
      }
      await conn.end();
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
});

//3. delete song
server.delete("/delete/:id", authorize, async (req, res) => {
  try {
    const idDelete = req.params.id;
    const conn = await connectDB();
    const sqlDelete = "DELETE FROM song WHERE idSong = ?;";
    const [result] = await conn.query(sqlDelete, [idDelete]);
    await conn.end();
    if (result.affectedRows > 0) {
      res.status(200).json({ success: true });
    } else {
      res
        .status(200)
        .json({ success: false, message: "No existe esa canción." });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//4. update song
server.put("/update/:id", authorize, async (req, res) => {
  try {
    const idUpdate = req.params.id;
    const { song, album } = req.body;
    const conn = await connectDB();
    const sqlUpdate =
      "UPDATE song SET songName = ?, album = ? WHERE idSong = ?;";
    const [result] = await conn.query(sqlUpdate, [song, album, idUpdate]);
    await conn.end();
    if (result.affectedRows > 0) {
      res.status(200).json({ success: true });
    } else {
      res
        .status(200)
        .json({ success: false, message: "No existe esa canción" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//5. filter
server.get("/artist", async (req, res) => {
  try {
    const { artist } = req.body;
    const conn = await connectDB();
    const sqlFilter =
      "SELECT songName, name, country, album FROM song INNER JOIN artist ON IdArtist = fkArtist WHERE name = ?;";
    const [result] = await conn.query(sqlFilter, [artist]);
    await conn.end();
    if (result.length !== 0) {
      res.status(200).json({
        success: true,
        results: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: `No tenemos ninguna canción de ${artist}`,
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});
//6. get one register
server.get("/:id", async (req, res) => {
  try {
    const idSong = req.params.id;
    const conn = await connectDB();
    const sqlId =
      "SELECT songName, name, country, album FROM song INNER JOIN artist ON IdArtist = fkArtist WHERE idSong = ?;";
    const [result] = await conn.query(sqlId, [idSong]);
    await conn.end();
    if (result.length !== 0) {
      res.status(200).json({
        success: true,
        results: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No existe ninguna canción con ese id.",
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//BONUS - logout
server.put("/user/logout", function (req, res) {
    const tokenString = req.headers.authorization;
    jwt.sign(tokenString, "", { expiresIn: 1 } , (logout, err) => {
       if (logout) {
          res.send({msg : 'Has sido desconectado' });
       } else {
          res.send({msg:'Error'});
       }
    });
 });


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

server.use(express.static("./public"));
