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
ALTER TABLE `reggaeton`.`song` 
ADD COLUMN `album` VARCHAR(100) NULL AFTER `fkArtist`;

INSERT INTO `reggaeton`.`artist` (`name`, `country`) VALUES ('Don Omar', 'Puerto Rico');
INSERT INTO `reggaeton`.`song` (`songName`, `fkArtist`) VALUES ('Callaita', '2');

INSERT INTO `reggaeton`.`artist` (`name`, `country`) VALUES ('Ivy Queen', 'Puerto Rico');
INSERT INTO `reggaeton`.`song` (`songName`, `fkArtist`) VALUES ('Quiero bailar', '6');

SELECT songName, name, country FROM song INNER JOIN artist ON IdArtist = fkArtist;
SELECT * FROM song INNER JOIN artist WHERE IdArtist = fkArtist;

DELETE FROM song WHERE idSong = 10;
UPDATE song SET songName = 