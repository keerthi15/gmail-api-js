# GMAIL-API-JS README

## Description
This project has two scripts : 

1. [index](index.js)
This Node.js script is designed to import gmail messages and labels. 
It accomplishes this by using Gmail APIs to import the messages and MySQL to store the data.

2. [message-modifier](modifier.js)
This Node.js script is designed to modify the labels or status of gmail messages.
It accomplishes this by using the MySQL DB to filter the messages by conditions and Gmail APIs to modify the labels on the messages

## Prerequisites

Before running this script, ensure you have the following installed:

- [Node.js](https://nodejs.org/) - You can download and install Node.js from the official website.
- [npm](https://www.npmjs.com/) (Node Package Manager) - Usually comes bundled with Node.js.
- [mysql](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/) - Mysql Installation Reference

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/keerthi15/gmail-api-js.git
   ```

2. Navigate to the project directory:

   ```bash
   cd gmail-api-js
   ```

3. Install dependencies:

   ```bash
   npm install
   ```
4. Create the required tables on mysql using the [mysql scripts](./scripts/)

5. Update the mysql db credentials in the [dbConfig](./config/dbConfig.js) file

## Usage
### Importer Script
- To run the importer script, use the following command:

```bash
npm run importer
```
### Modifier Script
- To run the modifier script, follow the steps

1. Change the `inputPayload` in the [modifier file](./modifier.js) to define the filters.
Refer the payload structure and rules in the [rules config file](./config/rules.js).

2. Use the following command to run the modifier script

```bash
npm run messageModifier
```
## TODO

- Load DB credentials, pagination limit from .env file. - Using dotenv package
- Need to implement test cases
### Importer Script
- Implement pagination while importing messages
- Import messages that are received only after the previous import
- Better extraction of email address (from address) to get the sender's name
### Modifier Script
- Need to update the message_label_mapping on DB once the message labels are modified

## Contact

If you have any questions or feedback, feel free to contact Keerthana V via email at keerthi0898@gmail.com.