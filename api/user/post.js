const uuid = require("uuid");
const moment = require("moment");

const { common, db } = require("../../util");

const dynamoDb = db.dbConnection();
const tableName = db.getTable();

const validateParams = (firstName, lastName, password, email, callback) => {
    if (!firstName || !lastName || !password || !email) {
        callback(null, {
            statusCode: 404,
            body:       JSON.stringify({ message: "Missing parameters" }),
        });
        return;
    }

    if (
        typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string"
    ) {
        callback(null, {
            statusCode: 412,
            body:       JSON.stringify({ message: "validation failed for the params" }),
        });
        return;
    }
};

const userInfomation = (firstName, lastName, password, email) => {
    const timestamp = moment().format();
    return {
        id:          uuid.v1(),
        firstName,
        lastName,
        password,
        email,
        submittedAt: timestamp,
        updatedAt:   timestamp,
    };
};

const submitUserInfo = userInfo => {
    console.log("Submitting userInfo");
    const UserInfo = {
        TableName: tableName,
        Item:      userInfo,
    };

    return dynamoDb.put(UserInfo, (err, data) => {
        if (err) throw new Error(err);
        else return userInfo;
    });
};

const userInfo = async (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const firstName = requestBody.firstName;
    const lastName = requestBody.lastName;
    const password = requestBody.password;
    const email = requestBody.email;

    validateParams(firstName, lastName, password, email, callback);
    const userDetails = userInfomation(firstName, lastName, password, email);
    try {
        submitUserInfo(userDetails);
        return common.responseObj(
            callback,
            200,
            "Sucessfully submitted user information with email",
            "this_is_test_success_id",
        );
    } catch (err) {
        return common.responseObj(
            callback,
            500,
            "Failed submitting user information with email",
            "this_is_test_fail_id",
        );
    }
};

module.exports = { userInfo };
