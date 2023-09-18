CREATE DATABASE IF NOT EXISTS gmail_db;

USE gmail_db;

-- Table "messages" to store Gmail message information.
CREATE TABLE IF NOT EXISTS messages (
    
    -- An auto-incremented unique identifier for each message record.
    message_id INT(11) NOT NULL AUTO_INCREMENT,
    
    -- The user ID associated with the message.
    user_id INT(11) NOT NULL,
    
    -- A unique reference ID for the Gmail message.
    gmail_message_ref_id VARCHAR(50) NOT NULL,
    
    -- The thread ID associated with the message.
    thread_id VARCHAR(50) NOT NULL,
    
    -- Sender's email address.
    from_email VARCHAR(100) NOT NULL,
    
    -- Recipient's email address.
    to_email VARCHAR(100) NOT NULL,
    
    -- Subject of the email message.
    email_subject VARCHAR(1000) NOT NULL,
    
    -- Body content of the email message.
    email_body TEXT NOT NULL,
    
    -- The date when the message was received (timestamp).
    created_date INT(20) NOT NULL,
    
    -- Primary key for the "messages" table
    PRIMARY KEY(message_id),
    
    -- Constraint to ensure that the combination of "gmail_message_ref_id" and "thread_id" is unique.
    CONSTRAINT gmail_message_id_unique UNIQUE (gmail_message_ref_id, thread_id)
);
