const AWS = require("aws-sdk");
const chalk = require('chalk');

const dbConnection = () => {
    if(process.env.ENVIRONMENT === "local") {
        console.log(chalk.bgGreenBright(
            chalk.white.bold("****** Connecting to local DynamoDB ******")
            ));
        return new AWS.DynamoDB.DocumentClient({
            endpoint: "http://localhost:8000"
          });
    } else {
        console.log(chalk.bgGreenBright(
            chalk.white.bold("****** Connecting to production DynamoDB ******")
            ));
        return new AWS.DynamoDB.DocumentClient({});
    }
}

module.exports = {
    dbConnection
}