CREATE DATABASE IF NOT EXISTS gmail_db;

USE gmail_db;

-- Table "users" to store user information.
CREATE TABLE IF NOT EXISTS users (
    
    -- An auto-incremented unique identifier for each user record.
    user_id INT(11) NOT NULL AUTO_INCREMENT,
    
    -- A masked email id for the user's Gmail account.
    gmail_id VARCHAR(50) UNIQUE,
    
    -- The date when the user account was created (timestamp).
    created_date INT(11),
    
    -- The date when the user account was last updated (timestamp).
    updated_date INT(11),
    
    -- Primary key for the "users" table
    PRIMARY KEY(user_id)
);
