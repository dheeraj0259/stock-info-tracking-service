const AWS = require("aws-sdk");
const chalk = require('chalk');

const getTable = () => {
    if(process.env.ENVIRONMENT === "local") {
        console.log(chalk.bgGreenBright(
            chalk.white.bold("****** Using Table-Name: orders_table ******")
            ));
            return "orders_table";
    }
    else {
        console.log(chalk.bgGreenBright(
            chalk.white.bold(`****** Using Table-Name: ${process.env.USER_INFO_TABLE} ******`)
            ));
            return process.env.USER_INFO_TABLE
    }
}

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
    dbConnection,
    getTable
}