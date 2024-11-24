CREATE DATABASE SchoolManagement;
USE SchoolManagement;

CREATE TABLE Students (
    ID INT auto_increment  PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    DateOfBirth DATE NOT NULL,
    NationalityId INT NOT NULL
);

CREATE TABLE FamilyMembers (
    FamilyMember_ID INT auto_increment PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    DateOfBirth DATE NOT NULL,
    RelationshipId INT NOT NULL, -- Parent = 1, Sibling = 2, Spouse = 3
    NationalityId INT NOT NULL,
    ID INT NOT NULL REFERENCES Students(ID) 
);
CREATE TABLE Nationalities (
    ID INT auto_increment PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL
);

CREATE TABLE Relationships (
    ID INT auto_increment PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL
);
select * from students;

INSERT INTO Nationalities (Name) VALUES 
('American'),
('Canadian'),
('Indian'),
('British'),
('Australian');
INSERT INTO Relationships (Name) VALUES 
('Parent'),
('Sibling'),
('Spouse');

INSERT INTO Students (FirstName, LastName, DateOfBirth, NationalityId) VALUES 
('John', 'Doe', '2000-05-15', 1),
('Jane', 'Smith', '1998-12-25', 3),
('Alex', 'Johnson', '2002-03-10', 4);

INSERT INTO FamilyMembers (FirstName, LastName, DateOfBirth, RelationshipId, NationalityId, ID) VALUES 
('Michael', 'Doe', '1975-06-20', 1, 1, 16), -- Parent of John
('Emily', 'Doe', '1978-09-10', 1, 1, 17),   -- Parent of John
('Anna', 'Smith', '2000-01-15', 2, 3, 18),  -- Sibling of Jane
('Sam', 'Johnson', '1999-11-05', 3, 4, 19); -- Spouse of Alex

CREATE USER 'root'@'%' IDENTIFIED BY 'Root@235';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

SHOW GRANTS FOR 'root'@'localhost';
