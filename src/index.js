const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

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
server.post("/add", async (req, res) => {
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
          message: "Canción introducida, el artista ya existía. Se muestra la lista actualizada.",
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
          message: "Canción y artista introducidos. Se muestra la lista actualizada.",
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
server.delete("/delete/:id", async (req, res) => {
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
server.put("/update/:id", async (req, res) => {
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

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

server.use(express.static("./public"));
