-- Active: 1746701667812@@127.0.0.1@3306@mysql
CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';
GRANT ALL ON tarea2.* TO 'cc5002'@'localhost';

-- Eliminar usuario de ser necesario
DROP USER 'cc5002'@'localhost';
