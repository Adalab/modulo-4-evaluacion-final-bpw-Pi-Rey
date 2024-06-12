CREATE DATABASE reggaeton;
use reggaeton;
CREATE TABLE artist (
  IdArtist INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  country VARCHAR(45) NULL
  );
  CREATE TABLE song (
  idSong INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  songName VARCHAR(100) NOT NULL,
  fkArtist INT,
  FOREIGN KEY (fkArtist) REFERENCES artist( idArtist)
  );

INSERT INTO `reggaeton`.`artist` (`name`, `country`) VALUES ('Don Omar', 'Puerto Rico');
INSERT INTO `reggaeton`.`song` (`songName`, `fkArtist`) VALUES ('Callaita', '2');