CREATE DATABASE IF NOT EXISTS gmail_db;

USE gmail_db;

-- Table "labels" to store Gmail labels information
CREATE TABLE IF NOT EXISTS labels (

    -- An auto-incremented unique identifier for each label record.
    label_id INT(11) NOT NULL AUTO_INCREMENT,
    
    -- A unique identifier for Gmail labels.
    gmail_label_id VARCHAR(50) NOT NULL,
    
    -- The user ID associated with the label.
    user_id INT(11) NOT NULL,
    
    -- The name of the Gmail label.
    label_name VARCHAR(100) NOT NULL,
    
    -- The type of label, e.g., "user" or "system".
    label_type VARCHAR(50) NOT NULL,
    
    -- Primary key for the "labels" table
    PRIMARY KEY(label_id)
);