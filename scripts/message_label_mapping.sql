CREATE DATABASE IF NOT EXISTS gmail_db;

USE gmail_db;

-- Table named "messages_label_mapping" to map messages to labels.
CREATE TABLE IF NOT EXISTS messages_label_mapping (

    -- An auto-incremented unique identifier for each mapping record.
    mapping_id INT(11) NOT NULL AUTO_INCREMENT,
    
    -- The ID of the message associated with this mapping.
    message_id INT(11) NOT NULL,
    
    -- The ID of the label associated with this mapping.
    label_id VARCHAR(100) NOT NULL,
    
    -- Primary key for the "messages_label_mapping" table
    PRIMARY KEY(mapping_id)
);
