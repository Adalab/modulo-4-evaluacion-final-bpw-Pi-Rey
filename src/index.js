const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

require('dotenv').config();

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 5001;

//Conexión con la database
async function connectDB(){
    const connex = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: "reggaeton",
    });
    await connex.connect();
    console.log("conexion con la DB" + connex.threadId);
    return connex;
}

connectDB();


server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });