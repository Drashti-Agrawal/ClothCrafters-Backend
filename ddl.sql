CREATE DATABASE clothcrafters;
USE clothcrafters;

CREATE TABLE users(
 user_id INT UNIQUE AUTO_INCREMENT,          
    username VARCHAR(50) NOT NULL,                   
    email VARCHAR(100) PRIMARY KEY NOT NULL,              
    password VARCHAR(255) NOT NULL,                  
    phone_number VARCHAR(15),                        
    address TEXT,                                    
    profile_image_url VARCHAR(255),                  
    user_type ENUM('User', 'Tailor', 'Boutique') NOT NULL  
);

CREATE TABLE Measurements(
measurement_id INT PRIMARY KEY AUTO_INCREMENT,
email VARCHAR(50),
chest_size FLOAT,
waist_size FLOAT,
hip_size FLOAT,
height FLOAT,
shoulder_width FLOAT,
FOREIGN KEY (email) REFERENCES users (email) 
);

CREATE TABLE alter_clothes(
alter_id INT PRIMARY KEY AUTO_INCREMENT,
email VARCHAR(50),
category VARCHAR(50),
image LONGBLOB,
description TEXT,
FOREIGN KEY (email) REFERENCES users (email)
);

CREATE TABLE customize_clothes(
customize_id INT PRIMARY KEY AUTO_INCREMENT,
email VARCHAR(50),
category VARCHAR(50),
image LONGBLOB,
design_inspiration TEXT,
FOREIGN KEY (email) REFERENCES users (email)
);