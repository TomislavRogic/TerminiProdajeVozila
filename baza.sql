
SELECT name, collation_name FROM sys.databases;
GO
ALTER DATABASE db_aad629_terminprodaje_admin SET SINGLE_USER WITH
ROLLBACK IMMEDIATE;
GO
ALTER DATABASE db_aad629_terminprodaje_admin COLLATE Croatian_CI_AS;
GO
ALTER DATABASE db_aad629_terminprodaje_admin SET MULTI_USER;
GO
SELECT name, collation_name FROM sys.databases;
GO



create table Osobe(
Sifraosoba int primary key not null identity(1,1),
Ime varchar(30) not null,
Prezime varchar(30) not null,
Email varchar(50) not null
);


-- izrada tablice Vozila

create table Vozila(
Sifravozila int primary key not null identity(1,1),
Marka varchar(100) not null,
Opisvozila varchar(100),
Cijena decimal(10,3)
);


-- izrada tablice Termini

create table Termini(
Sifratermina int primary key not null identity(1,1),
Osobe int not null,
Vozila int not null,
Termin smalldatetime
);



 --dodavanje foreign keya
 -- primary key uvijek mora biti int

alter table Termini add foreign key (Osobe) references Osobe(sifraosoba);
alter table Termini  add foreign key (Vozila) references Vozila(sifravozila);
go

-- dodavanje podataka u tablicu Osobe


insert into Osobe (Ime,Prezime,Email) values
('Tomislav','Rogić','tomislav.rogic@gmail.com'),
('Kristina','Andrić','kristinaadric13@gmail.com'),
('Hans', 'Grubner','hans.grubner@siol.at'),
('Markus','Walter','markus13@gmail.com'),
('Pierce','Brosnan','pierce.brosnan@gmail.com'),
('Milan','Prodanović','milan.prodanovic@gmail.com');
select * from Osobe;

--dodavanje podataka u tablicu Vozila



insert into Vozila (Marka,Opisvozila,Cijena) values
('Opel Mokka','2.2, dizel, 2017. godina, crna, 113.000 km, 5 sjedala, R17, prvi vlasnik',20.200),
('Bmw X4','3.0, dizel, 2021.godina, bijela, 32.000 km, 5 sjedala, R 19, prvi vlasnik', 30.800),
('Audi A4','2.2, dizel, 2020. godina, plava, 100.000 km, 5 sjedala, R 17, prvi vlasnik', 25.000),
('Mazda CX5','2.2, benzin, 2021. godina, bijela, 54.000 km, 5 sjedala, R 19, prvi vlasnik',30.500);
select * from Vozila;

-- dodavanje podataka u tablicu Termini



insert into Termini (Osobe,Vozila,Termin) values
(1,1,'2024-06-10 10:00'),
(2,4,'2024-06-10 12:00'),
(3,1,'2024-06-11 13:00'),
(6,3,'2024-06-10 15:00'),
(5,2,'2024-06-11 09:30'),
(4,2,'2024-06-11 11:30');  
select * from Termini;